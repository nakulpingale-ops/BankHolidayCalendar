import Papa from "papaparse";
import { format, parse, isValid, isSaturday, isSameDay, getMonth, getDate, eachDayOfInterval, startOfYear, endOfYear, addDays, getYear, getDay } from "date-fns";

export interface CsvHolidayRow {
    Date: string;
    Holiday: string;
    State: string;
    Status: string;
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

// Helper: Normalize state names for robust matching
export function normalizeStateName(name: string): string {
    if (!name) return "";
    return name
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/\s+/g, " ");
}

// 1. Fetch and Parse CSV
export async function fetchHolidaysCsv(): Promise<CsvHolidayRow[]> {
    try {
        const response = await fetch("/holidays2026.csv"); // Using the file mentioned in prompt
        if (!response.ok) {
            console.error("Failed to fetch CSV");
            return [];
        }
        const text = await response.text();
        const { data } = Papa.parse<CsvHolidayRow>(text, {
            header: true,
            skipEmptyLines: true,
        });
        return data;
    } catch (error) {
        console.error("Error loading holidays:", error);
        return [];
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

    // Parse date safely. Assuming CSV format is YYYY-MM-DD based on file view
    // If format is different, adjust parsing structure.
    // The previous file view showed "2026-01-26", so it is standard ISO-like.
    let parsedDate = parse(row.Date, "yyyy-MM-dd", new Date());

    // Fallback if generic parse fails
    if (!isValid(parsedDate)) {
        parsedDate = new Date(row.Date);
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
    const normalizedState = normalizeStateName(selectedState);

    // A. Filter CSV rows for this state (or All) and convert
    const csvHolidays: HolidayItem[] = [];
    csvData.forEach(row => {
        const rowState = normalizeStateName(row.State);
        if (rowState === "all" || rowState === normalizedState) {
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
    if (jan1States.includes(normalizedState)) {
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
