"use client";

import { useHolidayData } from "@/lib/HolidayContext";

export function DynamicH1() {
    const { selectedState } = useHolidayData();

    return (
        <div className="w-full max-w-[1050px] mx-auto px-4 pt-8 pb-0">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight text-center">
                Bank Holidays 2026 in <span className="text-[#2563eb]">{selectedState}</span>
            </h1>
            <p className="text-center text-gray-400 text-sm mt-2">
                Check live banking status, official holiday list, and future date availability.
            </p>
        </div>
    );
}
