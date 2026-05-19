"use client";

import { useHolidayData } from "@/lib/HolidayContext";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { format } from "date-fns";
import { getNextBankClosure } from "@/src/lib/holidays";
import { useEffect, useState } from "react";
import { INDIAN_STATES, stateToSlug } from "@/lib/constants";

export function HomeVerificationLines() {
    const { selectedState, setSelectedState, getHolidays, detectUserLocation } = useHolidayData();
    const [nextClosure, setNextClosure] = useState<{ date: Date, name: string } | null>(null);
    const [isDetecting, setIsDetecting] = useState(false);

    // Compute next closure whenever state changes
    useEffect(() => {
        const holidays = getHolidays(selectedState, 2026);
        const closure = getNextBankClosure(holidays, new Date());
        setNextClosure(closure);
    }, [selectedState, getHolidays]);

    const handleDetect = async () => {
        setIsDetecting(true);
        // detectUserLocation already updates context state
        await detectUserLocation();
        setIsDetecting(false);
    };

    const handleStateChange = (newState: string) => {
        setSelectedState(newState);
        // No navigation - in-place update only
    };

    return (
        <div className="flex flex-col items-center gap-0 mt-0 w-full max-w-5xl mx-auto">
            {/* 1. Merged Subtitle */}
            <div className="flex items-center justify-center px-4 mb-4 w-full">
                <p className="text-gray-400 text-[12px] text-center whitespace-normal break-words line-clamp-3 lg:line-clamp-none">
                    <CheckCircle className="inline w-3 h-3 text-[#14A900] shrink-0 -mt-[2px] mr-1" /> Official RBI holiday list for all States/UTs • Includes 2nd & 4th Saturday closures • Updated regularly &nbsp;&nbsp;<span className="block sm:inline whitespace-nowrap sm:whitespace-normal"><Info className="inline w-3 h-3 text-yellow-500 -mt-[2px] mr-0.5" /> Branch services available during operational hours.</span>
                </p>
            </div>

            {/* 2. State Selector Row */}
            <div className="flex flex-col w-full sm:w-auto min-w-[300px] sm:min-w-[340px] relative z-20">
                <div className="flex items-center justify-between mb-[3px]">
                    <label className="text-[12px] font-bold text-gray-500 uppercase tracking-normal pl-1 block">SELECT STATE/UT</label>
                    <button
                        onClick={handleDetect}
                        disabled={isDetecting}
                        className="flex items-center gap-1 text-[12px] font-medium text-[#2563eb] hover:text-[#14A900] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-wait uppercase tracking-normal"
                        title="Auto-detect location"
                    >
                        {isDetecting ? '...' : 'DETECT'}
                    </button>
                </div>
                <div className="relative w-full">
                    <select
                        value={selectedState}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className="w-full h-12 bg-[#2563eb] border-none text-white text-base rounded-xl focus:ring-2 focus:ring-[#2563eb]/45 block pl-4 pr-10 transition-all outline-none appearance-none hover:bg-[#5127A6] cursor-pointer truncate shadow-lg font-medium"
                    >
                        {INDIAN_STATES.map(s => <option key={s} value={s} className="bg-black text-white">{s}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            {/* 3. Next Closure Badge */}
            {nextClosure && (
                <div className="flex items-center gap-1.5 mt-[5px] animate-fadeIn">
                    <AlertTriangle className="w-[14px] h-[14px] text-yellow-500 shrink-0" />
                    <span className="text-yellow-500 text-xs font-medium">
                        Next bank closure: <span className="font-bold">{format(nextClosure.date, "d MMM")}</span> — {nextClosure.name}
                    </span>
                </div>
            )}
        </div>
    );
}
