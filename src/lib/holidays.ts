import Papa from "papaparse";
import { format, parse, isValid, isSaturday, isSunday, isSameDay, getMonth, getDate, eachDayOfInterval, startOfYear, endOfYear, addDays, getYear, getDay } from "date-fns";

export interface CsvHolidayRow {
    Date: string;
    Holiday: string;
    State: string;
    Status: string;
    stateKey?: string; // Derived for matching
}

export type HolidayType = "National" | "State" | "Banking" | "Weekend" | "Holiday";

export interface HolidayItem {
    date: Date;
    dateISO: string; // YYYY-MM-DD
    name: string;
    state: string;
    type: HolidayType;
    dayOfWeek: string; // Mon, Tue...
}

// Map common variations to canonical keys
const STATE_ALIASES: Record<string, string> = {
    "nct of delhi": "delhi",
    "odisha": "orissa", // if orissa is the canonical key in data, or vice versa. Assuming 'odisha' is modern.
    "orissa": "odisha",
    "puducherry": "pondicherry",
    "pondicherry": "puducherry",
    "jammu and kashmir": "jammu kashmir",
    "jammu & kashmir": "jammu kashmir",
    "andaman and nicobar islands": "andaman nicobar",
    "andaman & nicobar islands": "andaman nicobar"
};

// Helper: Normalize state names for robust matching
// Rules: trim, lower, replace &, collapse spaces, strip symbols
export function normalizeKey(name: string): string {
    if (!name) return "";
    let s = name.trim().toLowerCase();

    // Replace symbol variants
    s = s.replace(/&/g, "and");

    // Strip punctuation/symbols except letters, numbers, spaces
    // Keeping simple: remove anything that isn't a-z, 0-9, or space
    s = s.replace(/[^a-z0-9\s]/g, "");

    // Collapse multiple spaces
    s = s.replace(/\s+/g, " ");

    s = s.trim();

    // Check aliases
    if (STATE_ALIASES[s]) {
        return STATE_ALIASES[s];
    }

    // Special check for "andaman" specific simplification if strictly needed, but alias handles it.

    return s;
}

// Deprecated old helper, mapped to new one for backward compat if needed
export const normalizeStateName = normalizeKey;

// Helper to enrich raw rows
export function enrichCsvData(data: CsvHolidayRow[]): CsvHolidayRow[] {
    return data.map(row => ({
        ...row,
        stateKey: normalizeKey(row.State)
    }));
}

// 1. Fetch and Parse CSV (runtime, never cached)
export async function fetchHolidaysCsv(): Promise<CsvHolidayRow[]> {
    let text = "";

    // A. Try Local Public File first (Fastest)
    try {
        // Resolve absolute URL for server-side fetches, relative for client
        const baseUrl = typeof window !== "undefined" 
            ? "" 
            : (process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"));
        
        const localUrl = `${baseUrl}/holidays2026.csv`;
        const localResponse = await fetch(localUrl, { cache: "no-store" });
        
        if (localResponse.ok) {
            text = await localResponse.text();
            console.log("CSV FETCHED FROM LOCAL");
        } else {
            throw new Error(`Local fetch HTTP ${localResponse.status}`);
        }
    } catch (localError) {
        console.log("Local CSV fetch failed, falling back to Google Sheets");
        
        // B. Fallback to Google Sheets
        try {
            const remoteResponse = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vS1Ahvu0GCKd8m3pQrA3nY44QTk4sB-NAULWgef9olKoJ6gqQxqGVyyYu20TBBYTVgh6m31HY-_f2kb/pub?output=csv", {
                cache: "no-store",
            });
            
            if (!remoteResponse.ok) {
                console.error("REMOTE CSV FETCH FAILED – HTTP", remoteResponse.status);
                return [];
            }
            text = await remoteResponse.text();
            console.log("CSV FETCHED FROM GOOGLE SHEETS");
        } catch (remoteError) {
            console.error("BOTH CSV FETCHES FAILED", remoteError);
            return [];
        }
    }

    if (!text) return [];

    try {
        const { data } = Papa.parse<CsvHolidayRow>(text, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header: string) => {
                const lower = header.toLowerCase();
                if (lower.includes('state')) return 'State';
                return header;
            }
        });

        console.log("CSV PARSED –", data.length, "rows loaded");
        return enrichCsvData(data); // Add stateKey
    } catch (parseError) {
        console.error("CSV PARSE FAILED", parseError);
        return [];
    }
}

// Helper: Returns today's date in YYYY-MM-DD (local time zone safe)
export function getTodayISO(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Helper: Warn when no holiday is found for today
export function warnIfNoHolidayToday(holidays: CsvHolidayRow[], state: string): void {
    const today = getTodayISO();
    const found = holidays.some(h => h.Date === today && (h.State === "All" || h.State === state));
    if (!found) {
        console.warn("No holiday for today", today, "in state:", state);
    }
}

// 2. Compute 2nd and 4th Saturdays for a year
export function computeBankingHolidays(year: number, state: string): HolidayItem[] {
    const start = startOfYear(new Date(year, 0, 1));
    const end = endOfYear(new Date(year, 0, 1));
    const days = eachDayOfInterval({ start, end });
    const saturdays = days.filter(d => isSaturday(d));

    const bankingHolidays: HolidayItem[] = [];

    saturdays.forEach(date => {
        const dayOfMonth = getDate(date);
        const weekOfMonth = Math.ceil(dayOfMonth / 7);

        if (weekOfMonth === 2 || weekOfMonth === 4) {
            bankingHolidays.push({
                date: date,
                dateISO: format(date, "yyyy-MM-dd"),
                name: weekOfMonth === 2 ? "Second Saturday" : "Fourth Saturday",
                state: state, // These apply to all states effectively
                type: "Banking",
                dayOfWeek: "Sat"
            });
        }
    });

    return bankingHolidays;
}

// 3. Normalize single CSV row
export function normalizeCsvRow(row: CsvHolidayRow): HolidayItem | null {
    if (!row.Date || !row.Holiday) return null;

    // CSV format is dd-MM-yyyy (e.g. "04-03-2026" = 4 March 2026)
    // Try dd-MM-yyyy first, then yyyy-MM-dd as fallback for robustness
    let parsedDate = parse(row.Date, "dd-MM-yyyy", new Date());

    // Fallback to yyyy-MM-dd if first parse fails
    if (!isValid(parsedDate)) {
        parsedDate = parse(row.Date, "yyyy-MM-dd", new Date());
    }

    if (!isValid(parsedDate)) return null;

    // Infer Type
    let type: HolidayType = "Holiday";
    const lowerName = row.Holiday.toLowerCase();

    if (["republic day", "independence day", "gandhi jayanti"].some(n => lowerName.includes(n))) {
        type = "National";
    } else if (lowerName.includes("bank") || lowerName.includes("closing")) {
        type = "Banking";
    } else {
        type = "State"; // Default for state-specific lists
    }

    return {
        date: parsedDate,
        dateISO: format(parsedDate, "yyyy-MM-dd"),
        name: row.Holiday,
        state: row.State,
        type: type,
        dayOfWeek: format(parsedDate, "EEE")
    };
}

// 4. Main Merger Function
export function getCombinedHolidays(csvData: CsvHolidayRow[], selectedState: string, year: number = 2026): HolidayItem[] {
    const selectedStateKey = normalizeKey(selectedState);
    const isAll = selectedStateKey === "all" || selectedStateKey === "all statesuts" || selectedStateKey === "all states";

    // A. Filter CSV rows for this state (or All) and convert
    const csvHolidays: HolidayItem[] = [];
    csvData.forEach(row => {
        // Ensure stateKey exists (in case data came from somewhere else not enriched)
        const rowKey = row.stateKey || normalizeKey(row.State);

        if (isAll || rowKey === "all" || rowKey === selectedStateKey) {
            const item = normalizeCsvRow(row);
            if (item && getYear(item.date) === year) {
                csvHolidays.push(item);
            }
        }
    });

    // B. Compute Banking Holidays (Saturdays)
    const saturdays = computeBankingHolidays(year, selectedState);

    // C. Merge & Dedupe
    // Priority: CSV (Specific Name) > Computed Banking (Generic)
    // If a CSV holiday falls on a 2nd Saturday, we keep the CSV one (usually more descriptive).
    // Or we can keep both if we want to show multiple reasons, but typically one row is better.
    // Let's use a Map by DateISO

    const holidayMap = new Map<string, HolidayItem>();

    // 1. Add Saturdays first
    saturdays.forEach(sat => {
        holidayMap.set(sat.dateISO, sat);
    });

    // 2. Overwrite with CSV (Official) holidays
    csvHolidays.forEach(hol => {
        if (holidayMap.has(hol.dateISO)) {
            // Already exists (it's a Saturday). 
            // If the CSV says it's a holiday, it probably has a specific name (e.g., "Second Saturday" or "Festival")
            // Use the CSV version as it likely has the specific name.
            // Exception: If CSV just says "Second Saturday" and we generated "Second Saturday", it's same.
            holidayMap.set(hol.dateISO, hol);
        } else {
            holidayMap.set(hol.dateISO, hol);
        }
    });

    // 2.5 Add Global Jan 1 Rule (from Context logic)
    const jan1States = [
        "tamil nadu", "west bengal", "sikkim", "mizoram",
        "manipur", "arunachal pradesh", "meghalaya", "nagaland"
    ];
    // Check using Key
    if (jan1States.map(normalizeKey).includes(selectedStateKey)) {
        const jan1Date = new Date(year, 0, 1);
        const jan1ISO = format(jan1Date, "yyyy-MM-dd");
        if (!holidayMap.has(jan1ISO)) {
            holidayMap.set(jan1ISO, {
                date: jan1Date,
                dateISO: jan1ISO,
                name: "New Year's Day",
                state: selectedState,
                type: "State",
                dayOfWeek: format(jan1Date, "EEE")
            });
        }
    }

    // 2.6 Add Sundays (Generic)
    const start = startOfYear(new Date(year, 0, 1));
    const end = endOfYear(new Date(year, 0, 1));
    const days = eachDayOfInterval({ start, end });
    const sundays = days.filter(d => isSunday(d));

    sundays.forEach(sunDate => {
        const sunISO = format(sunDate, "yyyy-MM-dd");
        if (!holidayMap.has(sunISO)) {
            holidayMap.set(sunISO, {
                date: sunDate,
                dateISO: sunISO,
                name: "Sunday",
                state: selectedState,
                type: "Weekend",
                dayOfWeek: "Sun"
            });
        }
    });

    // D. Convert back to array and Sort
    return Array.from(holidayMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
}
// 5. Get Next Bank Closure (for Hero)
export function getNextBankClosure(holidays: HolidayItem[], fromDate: Date = new Date()): { date: Date, name: string } | null {
    // Start checking from tomorrow to avoid "today" confusion
    let checkDate = addDays(fromDate, 1);

    // Check next 60 days to be safe
    for (let i = 0; i < 60; i++) {
        // 1. Is it in the official holiday list? (Priority: Holiday > Saturday)
        // Since our 'holidays' list already includes 2nd/4th Saturdays (if using getCombinedHolidays),
        // we just check if the date exists in the list.
        const holiday = holidays.find(h => isSameDay(h.date, checkDate));
        if (holiday) {
            return { date: holiday.date, name: holiday.name };
        }

        // 2. Is it a Sunday? (Usually not in holiday list)
        if (getDay(checkDate) === 0) {
            return { date: checkDate, name: "Sunday" };
        }

        checkDate = addDays(checkDate, 1);
    }
    return null;
}

// 6. Date Visual State Helpers
export function isPastDate(dateISO: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Local midnight
    const checkDate = new Date(dateISO);
    return checkDate < today; // Strictly less than today
}

export function isTodayDate(dateISO: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateISO);
    checkDate.setHours(0, 0, 0, 0); // Ensure comparison date is also stripped
    return checkDate.getTime() === today.getTime();
}
