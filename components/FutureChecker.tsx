"use client";

import { useState, useEffect } from "react";
import { format, parseISO, isValid, addDays } from "date-fns";
import { Calendar, Info, MapPin } from "lucide-react";
import { useHolidayData } from "@/lib/HolidayContext";
import { INDIAN_STATES } from "@/lib/constants";
import { StatusCard } from "./StatusCard";

export function FutureChecker() {
    // 1. Get global detected state from context
    const { isBankOpen, selectedState } = useHolidayData();

    // 2. Initialize local state with global default
    const [state, setState] = useState(selectedState);

    // Sync local state when global selectedState changes (e.g. after auto-detection)
    useEffect(() => {
        setState(selectedState);
    }, [selectedState]);

    const [date, setDate] = useState("");
    const [result, setResult] = useState<{ date: Date; status: any } | null>(null);
    const [isDetecting, setIsDetecting] = useState(false);
    const [showPulse, setShowPulse] = useState(false);
    const [isValidYear, setIsValidYear] = useState(true);

    // Initialize with Today + 2 days on mount
    useEffect(() => {
        const today = new Date();
        const futureDate = addDays(today, 2);
        const dateStr = format(futureDate, "yyyy-MM-dd");
        setDate(dateStr);
        // Check initial validity (should be valid)
        const y = new Date(dateStr).getFullYear();
        setIsValidYear(y === 2026);
    }, []);

    // Reactive check effect
    useEffect(() => {
        if (!date) {
            setResult(null);
            return;
        }

        // Live validation check
        const y = new Date(date).getFullYear();
        if (y !== 2026) {
            setIsValidYear(false);
            setResult(null); // Clear result immediately
            return;
        }
        setIsValidYear(true);

        const parsedDate = parseISO(date);
        if (!isValid(parsedDate)) {
            setResult(null);
            return;
        }

        const status = isBankOpen(parsedDate, state);
        setResult({ date: parsedDate, status });
    }, [date, state, isBankOpen]);

    useEffect(() => {
        setFlash(true);
        const timer = setTimeout(() => setFlash(false), 250);
        return () => clearTimeout(timer);
    }, [state]);

    const { detectUserLocation } = useHolidayData();

    const handleDetect = async () => {
        setIsDetecting(true);

        // 1. Reset Date to Default (Today + 2 days)
        const today = new Date();
        const futureDate = addDays(today, 2);
        const dateStr = format(futureDate, "yyyy-MM-dd");
        setDate(dateStr);

        // 2. Clear Error State explicitly
        setIsValidYear(true);

        // 3. Trigger Detection
        const detected = await detectUserLocation();
        if (detected) {
            setState(detected);
            setShowPulse(true);
            setTimeout(() => setShowPulse(false), 600);
        }
        setIsDetecting(false);
    };

    // Helper to get tooltip text
    const getTooltipText = (status: any) => {
        if (status.isOpen) return "Normal working day";

        switch (status.reason) {
            case 'Sunday':
                return "Weekly Holiday: All banks in India remain closed on Sundays as per RBI guidelines.";
            case 'Second Saturday':
                return "Weekend Holiday: Banks are closed on the 2nd Saturday of every month.";
            case 'Fourth Saturday':
                return "Weekend Holiday: Banks are closed on the 4th Saturday of every month.";
            default:
                // Named holidays (e.g., "Republic Day") take priority over weekend logic in HolidayContext
                return `Holiday: ${status.reason}`;
        }
    };

    const [flash, setFlash] = useState(false);

    return (
        <section className="w-full py-4 md:py-12 -mt-[23px] md:-mt-[38px] relative z-10">
            <div className="flex flex-col gap-8 w-full max-w-[1050px] mx-auto px-4">
                <div className="flex flex-col gap-2">
                    <section className="w-full py-8 text-white">
                        {/* Header & Controls Row */}
                        <div className="flex flex-col md:flex-row justify-between items-start mb-[3px]">
                            {/* Header - Pushed down to align with Input Boxes (skipping labels) */}
                            <div className="flex items-start md:items-center gap-3 mt-[35px]">
                                <Calendar className="w-6 h-6 text-[#7d3cff]" />
                                <h2 className="text-2xl font-bold tracking-tight">Future Bank Holiday <span className="whitespace-nowrap">Date Check</span></h2>
                            </div>

                            {/* External Control Bar - Right Aligned */}
                            <div className="w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-end justify-end gap-3">
                                {/* Date Input */}
                                <div className="w-full md:w-auto">
                                    <label className="block text-[12px] font-bold text-gray-500 mb-[5px] uppercase tracking-normal pl-3">Select Date</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full md:w-[160px] h-[38px] bg-[#0e0a18] border-[0.25px] border-[#7D3CFF]/50 rounded-[4px] px-3 text-white text-[14px] focus:ring-[0.5px] focus:ring-[#7d3cff] focus:border-[#7d3cff] outline-none transition-all hover:border-[#7d3cff]"
                                    />
                                </div>

                                {/* State/UT Dropdown with Header Row */}
                                <div className="w-full md:w-auto">
                                    <div className="flex justify-between items-center mb-[5px]">
                                        <label className="text-[12px] font-bold text-gray-500 uppercase tracking-normal pl-3 mb-0">State/UT</label>

                                        {/* Detect Button - Now Right Aligned in Header */}
                                        <button
                                            onClick={handleDetect}
                                            disabled={isDetecting}
                                            className="flex items-center gap-1 text-[12px] font-medium text-[#7d3cff] hover:text-[#14A900] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-wait uppercase tracking-normal"
                                            title="Auto-detect location"
                                        >
                                            <MapPin className={`w-[14px] h-[14px] ${isDetecting ? 'animate-pulse' : ''}`} />
                                            {isDetecting ? '...' : 'DETECT'}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            className="w-full md:w-auto h-[38px] bg-[#0e0a18] border-[0.25px] border-[#7D3CFF]/50 rounded-[4px] pl-3 pr-8 text-white text-[14px] focus:ring-[0.5px] focus:ring-[#7d3cff] focus:border-[#7d3cff] outline-none appearance-none transition-all cursor-pointer hover:border-[#7d3cff] truncate"
                                        >
                                            {INDIAN_STATES.map(s => <option key={s} value={s} className="bg-black text-white">{s}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Big Bounding Box - Results Only */}
                        <div className={`backdrop-blur-sm border rounded-[4px] p-6 shadow-xl transition-all duration-300 ${flash
                            ? "bg-[#17102A] border-[#7d3cff] shadow-[0_0_30px_rgba(125,60,255,0.3)]"
                            : result?.status.isOpen
                                ? "bg-white/5 border-[#14A900]/50"
                                : "bg-white/5 border-[#ef4444]/50"
                            }`}>
                            {!isValidYear ? (
                                <div className="flex flex-col items-center justify-center p-8 gap-3 text-center">
                                    <div className="text-[14px] text-gray-400 font-medium">
                                        Verified data available for <span className="text-white font-bold">2026 only</span>
                                    </div>
                                </div>
                            ) : result ? (
                                <div className="flex flex-col gap-4">
                                    {/* Main Status Bar */}
                                    <div className={`w-full px-4 py-5 rounded-[4px] flex items-center justify-center gap-2 shadow-inner min-h-[60px] h-auto relative transition-colors duration-500 ${result.status.isOpen
                                        ? "bg-[#14a900] shadow-[0_0_20px_rgba(20,169,0,0.1)]"
                                        : "bg-[#850000] shadow-[0_0_20px_rgba(133,0,0,0.1)]"
                                        }`}>

                                        {/* Text Container */}
                                        <div className="md:max-w-[650px] text-center">
                                            <h3 className="text-white text-[14px] font-normal relative z-10 break-words text-center" style={{ overflowWrap: 'break-word', wordWrap: 'break-word', lineHeight: '1.4' }}>
                                                {state === "Dadra and Nagar Haveli and Daman and Diu" ? (
                                                    <span className="flex flex-col items-center">
                                                        <span>
                                                            <span className="font-bold">{result.status.isOpen ? "YES." : "NO."}</span> Banks are {result.status.isOpen ? "open" : "closed"} on {format(result.date, "EEE, d MMM yyyy")} in
                                                        </span>
                                                        <span>{state}</span>
                                                    </span>
                                                ) : result.status.isOpen ? (
                                                    <>
                                                        <span className="font-bold">YES.</span> Banks are open on {format(result.date, "EEE, d MMM yyyy")} in {state}
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="font-bold">NO.</span> Banks are closed on {format(result.date, "EEE, d MMM yyyy")} in {state}
                                                    </>
                                                )}
                                            </h3>
                                        </div>

                                        {/* Info Icon with Tooltip - Inline */}
                                        {!result.status.isOpen && (
                                            <div className="relative group/info shrink-0">
                                                <Info className="w-5 h-5 text-white hover:text-white/80 cursor-pointer transition-colors" />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[200px] px-3 py-2 bg-[#1e293b] border border-white/10 rounded-[6px] shadow-2xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all duration-200 z-50 pointer-events-none transform translate-y-1 group-hover/info:translate-y-0">
                                                    <span className="text-[11px] text-white font-medium block text-center leading-tight">
                                                        {getTooltipText(result.status)}
                                                    </span>
                                                    {/* Arrow */}
                                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1e293b] border-r border-b border-white/10 transform rotate-45"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Services Row */}
                                    <div className="flex flex-wrap justify-start md:justify-center gap-x-6 gap-y-2">
                                        {[
                                            { name: "RTGS / NEFT", ok: true },
                                            { name: "UPI / IMPS", ok: true },
                                            { name: "Cheque Clearing", ok: result.status.isOpen },
                                            { name: "Forex Windows", ok: result.status.isOpen }
                                        ].map(s => (
                                            <div key={s.name} className="flex items-center gap-2">
                                                <div className={`w-2.5 h-2.5 rounded-full ${s.ok
                                                    ? 'bg-[#14a900] animate-status-live'
                                                    : 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]'
                                                    }`} />
                                                <span className="text-gray-300 text-xs font-medium">{s.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-4">
                                    Select a date to check bank holiday status
                                </div>
                            )}
                        </div>
                    </section>
                </div >
            </div >
        </section >
    );
}
