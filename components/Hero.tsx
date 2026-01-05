"use client";

import { useState, useEffect } from "react";
import { addDays } from "date-fns";
import { Zap, MapPin, AlertCircle, CheckCircle } from "lucide-react";
import { StatusCard } from "./StatusCard";
import { useHolidayData } from "@/lib/HolidayContext";
import { INDIAN_STATES } from "@/lib/constants";

export function Hero() {
    const [mounted, setMounted] = useState(false);
    // Use 'mounted' check to prevent hydration warnings on date.

    // Use today's date
    const [today, setToday] = useState<Date>(new Date());

    useEffect(() => {
        setMounted(true);
        setToday(new Date());
    }, []);

    const { isBankOpen, selectedState, setSelectedState, detectUserLocation } = useHolidayData();
    const [isDetecting, setIsDetecting] = useState(false);

    const handleDetect = async () => {
        setIsDetecting(true);
        await detectUserLocation();
        setIsDetecting(false);
    };

    if (!mounted) return <div className="h-[400px] w-full animate-pulse bg-gray-900/20 rounded-lg"></div>;

    const tomorrow = addDays(today, 1);
    const statusToday = isBankOpen(today, selectedState);
    const statusTomorrow = isBankOpen(tomorrow, selectedState);

    return (
        <section id="quick-status" className="w-full pt-16 pb-0 -mb-10 text-white">
            <div className="w-full max-w-[1050px] mx-auto px-4">
                {/* State Selector for Global Context */}

                <div className="flex flex-row justify-between items-end mb-[4px] gap-2">
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <Zap className="w-6 h-6 text-[#7d3cff]" />
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Quick Status</h2>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink max-w-full">
                        <div className="flex flex-col w-full md:w-auto">
                            <div className="flex items-center justify-between mb-[3px]">
                                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-normal pl-3 block">STATE/UT</label>
                                <button
                                    onClick={handleDetect}
                                    disabled={isDetecting}
                                    className="hidden md:flex items-center gap-1 text-[12px] font-medium text-[#7d3cff] hover:text-[#14A900] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-wait uppercase tracking-normal"
                                    title="Auto-detect location"
                                >
                                    <MapPin className={`w-[14px] h-[14px] ${isDetecting ? 'animate-pulse' : ''}`} />
                                    {isDetecting ? '...' : 'DETECT'}
                                </button>
                            </div>
                            <div className="relative flex-shrink max-w-[140px] md:max-w-none w-full">
                                <select
                                    value={selectedState}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                    className="w-full bg-[#0e0a18] border-[0.25px] border-[#7D3CFF]/50 text-white text-sm rounded-[4px] focus:ring-[0.5px] focus:ring-[#7d3cff] focus:border-[#7d3cff] block py-2 pl-3 pr-8 transition-all outline-none appearance-none hover:border-[#7d3cff] cursor-pointer truncate"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-[6px]">
                    <StatusCard
                        label="TODAY"
                        date={today}
                        state={selectedState}
                        status={statusToday}
                    />
                    <StatusCard
                        label="TOMORROW"
                        date={tomorrow}
                        state={selectedState}
                        status={statusTomorrow}
                    />
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-[12px] px-4 text-[12px] text-white">
                    <div className="flex items-start md:items-center gap-1.5">
                        <AlertCircle className="w-[14px] h-[14px] text-yellow-500 shrink-0 mt-[1.5px]" />
                        <span>Branch visits and clearing services are available basis bank operational hours.</span>
                    </div>
                    <div className="flex items-start md:items-center gap-1.5">
                        <CheckCircle className="w-[14px] h-[14px] text-[#14A900] shrink-0 mt-[1.5px]" />
                        <span>Verified via RBI circulars, State Gazettes & bank notices. Updated daily.</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
