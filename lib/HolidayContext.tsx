"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { parse, isSameDay, isSunday, isSaturday, getWeekOfMonth } from "date-fns";
import { BankStatus } from "@/lib/logic";
import {
    fetchHolidaysCsv,
    CsvHolidayRow,
    getCombinedHolidays,
    HolidayItem,
    normalizeKey // Update import
} from "@/src/lib/holidays";

import { INDIAN_STATES, stateToSlug, slugToState } from "@/lib/constants";

// Re-export types for consumers
export type { HolidayItem, CsvHolidayRow };

interface HolidayContextType {
    holidays: CsvHolidayRow[]; // Raw CSV data
    isBankOpen: (date: Date, state: string) => BankStatus;
    getHolidays: (state: string, year?: number) => HolidayItem[]; // Returns rich, merged list
    selectedState: string;
    setSelectedState: (state: string) => void;
    detectUserLocation: () => Promise<string>;
    loading: boolean;
}

const HolidayContext = createContext<HolidayContextType | undefined>(undefined);

export function HolidayProvider({ children }: { children: React.ReactNode }) {
    const [holidays, setHolidays] = useState<CsvHolidayRow[]>([]);
    const [loading, setLoading] = useState(true);

    // Default to Maharashtra as fallback
    const [selectedState, setSelectedStateInternal] = useState("Maharashtra");

    // Load CSV data client-side using new utility
    useEffect(() => {
        fetchHolidaysCsv().then(data => {
            setHolidays(data);
            setLoading(false);
        });
    }, []);

    const setSelectedState = (state: string) => {
        setSelectedStateInternal(state);

        // Update URL status parameter without refresh
        if (typeof window !== "undefined") {
            const pathname = window.location.pathname;
            // If we are on a state slug page, don't append ?state parameter
            const isStateSlugPage = pathname.endsWith("-bank-holiday-2026");
            
            if (!isStateSlugPage) {
                const slug = stateToSlug(state);
                const newUrl = `${pathname}?state=${slug}`;
                window.history.pushState({ state }, "", newUrl);
            }
        }
    };

    const detectUserLocation = async (): Promise<string> => {
        try {
            // Check if we are already on a state slug page before auto-detecting
            if (typeof window !== "undefined") {
                const pathname = window.location.pathname;
                if (pathname.endsWith("-bank-holiday-2026")) {
                    const slugPart = pathname.split("/").pop()?.replace("-bank-holiday-2026", "");
                    if (slugPart && slugPart !== "all") {
                        const matchedState = slugToState(slugPart);
                        if (matchedState) {
                            setSelectedStateInternal(matchedState);
                            return matchedState;
                        }
                    }
                }
            }
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Timeout")), 2000)
            );

            const fetchPromise = fetch("https://ipapi.co/json/").then(res => res.json());
            const data: any = await Promise.race([fetchPromise, timeoutPromise]);

            if (data && data.region) {
                const matchedState = INDIAN_STATES.find(
                    (s) => s.toLowerCase() === data.region.toLowerCase() ||
                        s.toLowerCase().includes(data.region.toLowerCase()) ||
                        data.region.toLowerCase().includes(s.toLowerCase())
                );

                if (matchedState) {
                    setSelectedState(matchedState);
                    return matchedState;
                }
            }
        } catch (error) {
            console.warn("Auto-detection failed. Using default.", error);
        }
        return "Maharashtra";
    };

    // Deep-linking and URL sync
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const stateSlug = params.get("state");

            if (stateSlug) {
                const stateFromUrl = slugToState(stateSlug);
                if (stateFromUrl) {
                    setSelectedStateInternal(stateFromUrl);
                } else {
                    detectUserLocation();
                }
            } else {
                detectUserLocation();
            }

            // Handle browser back/forward buttons
            const handlePopState = (event: PopStateEvent) => {
                const params = new URLSearchParams(window.location.search);
                const stateSlug = params.get("state");
                if (stateSlug) {
                    const stateFromUrl = slugToState(stateSlug);
                    if (stateFromUrl) setSelectedStateInternal(stateFromUrl);
                }
            };

            window.addEventListener("popstate", handlePopState);
            return () => window.removeEventListener("popstate", handlePopState);
        }
    }, []);

    const isBankOpen = (date: Date, state: string): BankStatus => {
        // 1. Global Rule: 1st Jan 2026 is CLOSED only for specific states
        if (isSameDay(date, new Date(2026, 0, 1))) {
            const closedStates = [
                "Tamil Nadu", "West Bengal", "Sikkim", "Mizoram",
                "Manipur", "Arunachal Pradesh", "Meghalaya", "Nagaland"
            ];

            const normalizedState = normalizeKey(state);
            // Use normalizeKey for comparison
            if (closedStates.some(s => normalizeKey(s) === normalizedState)) {
                return { isOpen: false, reason: "New Year's Day", type: "holiday" };
            }
            // For other states, it enters normal flow (likely open unless Sunday/CSV says otherwise)
        }

        // 2. Check CSV for specific holidays
        const holiday = holidays.find((h) => {
            const holidayDate = parse(h.Date, "yyyy-MM-dd", new Date());
            // Fallback parse if needed, but getCombinedHolidays handles this robustly.
            // Here we do a quick check on raw data for performance, or we could use the optimized map.
            // For simplicity and to match previous logic, we parse here.

            // Note: CsvHolidayRow Date is string YYYY-MM-DD
            if (!holidayDate || isNaN(holidayDate.getTime())) return false;

            const normalizedParamState = normalizeKey(state);
            const normalizedRowState = h.stateKey || normalizeKey(h.State);

            return (
                isSameDay(holidayDate, date) &&
                (h.State === "All" || normalizedRowState === "all" || normalizedRowState === normalizedParamState) &&
                h.Status === "Closed"
            );
        });

        if (holiday) {
            return { isOpen: false, reason: holiday["Holiday"], type: "holiday" };
        }

        // 3. Check Sundays
        if (isSunday(date)) {
            return { isOpen: false, reason: "Sunday", type: "weekend" };
        }

        // 4. Check 2nd and 4th Saturdays
        if (isSaturday(date)) {
            const weekOfMonth = getWeekOfMonth(date);
            if (weekOfMonth === 2) {
                return { isOpen: false, reason: `Second Saturday`, type: "weekend" };
            }
            if (weekOfMonth === 4) {
                return { isOpen: false, reason: `Fourth Saturday`, type: "weekend" };
            }
        }

        return { isOpen: true, reason: "", type: "weekday" };
    };

    // New Helper: Returns the robust, merged list of holidays for UI
    const getHolidays = (state: string, year: number = 2026): HolidayItem[] => {
        return getCombinedHolidays(holidays, state, year);
    }

    return (
        <HolidayContext.Provider value={{ holidays, isBankOpen, getHolidays, selectedState, setSelectedState, detectUserLocation, loading }}>
            {children}
        </HolidayContext.Provider>
    );
}

export function useHolidayData() {
    const context = useContext(HolidayContext);
    if (context === undefined) {
        throw new Error("useHolidayData must be used within a HolidayProvider");
    }
    return context;
}
