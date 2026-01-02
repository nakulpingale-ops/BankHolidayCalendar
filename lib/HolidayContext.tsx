"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Papa from "papaparse";
import { parse, isSameDay, isSunday, isSaturday, getWeekOfMonth, getYear } from "date-fns";
import { BankStatus } from "@/lib/logic";

import { INDIAN_STATES } from "@/lib/constants";

export interface Holiday {
    Date: string;
    "Holiday": string;
    State: string;
    Status: string;
}

interface HolidayContextType {
    holidays: Holiday[];

    isBankOpen: (date: Date, state: string) => BankStatus;
    getHolidays: (state: string, month?: number) => Holiday[];
    selectedState: string;
    setSelectedState: (state: string) => void;
    detectUserLocation: () => Promise<string>;
}

// Helper: Normalize state names for robust matching
// 1. Trim whitespace
// 2. Convert to lowercase
// 3. Replace '&' with 'and'
// 4. Collapse multiple spaces
function normalizeStateName(name: string): string {
    if (!name) return "";
    return name
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/\s+/g, " ");
}

const HolidayContext = createContext<HolidayContextType | undefined>(undefined);

// Import standardized slug functions from constants
import { stateToSlug, slugToState } from "@/lib/constants";

export function HolidayProvider({ children, initialHolidays }: { children: React.ReactNode, initialHolidays: Holiday[] }) {
    const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);

    // Default to Maharashtra as fallback
    const [selectedState, setSelectedStateInternal] = useState("Maharashtra");

    const setSelectedState = (state: string) => {
        setSelectedStateInternal(state);

        // Update URL status parameter without refresh
        if (typeof window !== "undefined") {
            const slug = stateToSlug(state);
            const newUrl = `${window.location.pathname}?state=${slug}`;
            window.history.pushState({ state }, "", newUrl);
        }
    };

    const detectUserLocation = async (): Promise<string> => {
        try {
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

            const normalizedState = normalizeStateName(state);
            if (closedStates.some(s => normalizeStateName(s) === normalizedState)) {
                return { isOpen: false, reason: "New Year's Day", type: "holiday" };
            }
            // For other states, it enters normal flow (likely open unless Sunday/CSV says otherwise)
        }

        // 2. Check CSV for specific holidays
        const holiday = holidays.find((h) => {
            const holidayDate = parse(h.Date, "yyyy/MM/dd", new Date());

            const normalizedParamState = normalizeStateName(state);
            const normalizedRowState = normalizeStateName(h.State);

            return (
                isSameDay(holidayDate, date) &&
                (h.State === "All" || normalizedRowState === normalizedParamState) &&
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

    const getHolidays = (state: string, month?: number): Holiday[] => {
        return holidays.filter((h) => {
            const hDate = parse(h.Date, "yyyy/MM/dd", new Date());

            // Updated matching logic as per final request
            // Logic: if (selectedState.trim().toLowerCase() === csvState.trim().toLowerCase())
            const s1 = state.trim().toLowerCase();
            const s2 = h.State.trim().toLowerCase();

            const isStateMatch = h.State === "All" || s2 === s1;
            const isMonthMatch = month !== undefined ? hDate.getMonth() === month : true;
            // Also filter for year 2026 if specifically requested, but for now just all
            return isStateMatch && isMonthMatch;
        });
    }



    return (
        <HolidayContext.Provider value={{ holidays, isBankOpen, getHolidays, selectedState, setSelectedState, detectUserLocation }}>
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
