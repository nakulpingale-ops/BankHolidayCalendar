"use client";

import { useState, useEffect } from "react";
import { addDays } from "date-fns";
import { Zap, MapPin, AlertCircle, CheckCircle, Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StatusCard } from "@/components/StatusCard";
import { useHolidayData } from "@/lib/HolidayContext";
import { INDIAN_STATES } from "@/lib/constants";

interface DayViewProps {
    mode: "today" | "tomorrow";
}

export function DayView({ mode }: DayViewProps) {
    const [mounted, setMounted] = useState(false);
    const [todayDate, setTodayDate] = useState<Date>(new Date());

    useEffect(() => {
        setMounted(true);
        setTodayDate(new Date());
    }, []);

    const { isBankOpen, selectedState, setSelectedState, detectUserLocation } = useHolidayData();

    // Dynamic Title Update for Client Side
    useEffect(() => {
        if (selectedState && mounted) {
            const dayLabel = mode === "today" ? "Today" : "Tomorrow";
            document.title = `Are Banks Open ${dayLabel} in ${selectedState}? | Bank Holiday Calendar`;
        }
    }, [selectedState, mode, mounted]);

    const [isDetecting, setIsDetecting] = useState(false);

    const handleDetect = async () => {
        setIsDetecting(true);
        await detectUserLocation();
        setIsDetecting(false);
    };

    if (!mounted) return <div className="h-[400px] w-full animate-pulse bg-gray-900/20 rounded-lg"></div>;

    const targetDate = mode === "today" ? todayDate : addDays(todayDate, 1);
    const status = isBankOpen(targetDate, selectedState);
    const label = mode === "today" ? "TODAY" : "TOMORROW";

    return (
        <section className="w-full pt-36 md:pt-48 pb-12 text-white">
            <div className="w-full max-w-[800px] mx-auto px-4 flex flex-col gap-8">

                {/* Header / Selector */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-[#7d3cff]" />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-none uppercase">
                                <span className="text-gray-400 block text-lg font-bold mb-1">Are banks open</span>
                                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                    {label} in {selectedState}?
                                </span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-col w-full md:w-auto min-w-[250px]">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-[12px] font-bold text-gray-500 uppercase tracking-normal pl-3 block">Change State/UT</label>
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
                        <div className="relative w-full">
                            <select
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                className="w-full bg-[#0e0a18] border-[0.25px] border-[#7D3CFF]/65 text-white text-sm rounded-[4px] focus:ring-[0.5px] focus:ring-[#7d3cff] focus:border-[#7d3cff] block py-3 pl-4 pr-10 transition-all outline-none appearance-none hover:border-[#7d3cff] cursor-pointer truncate shadow-lg"
                            >
                                {INDIAN_STATES.map(s => <option key={s} value={s} className="bg-black text-white">{s}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Card */}
                <div className="w-full">
                    <StatusCard
                        label={label}
                        date={targetDate}
                        state={selectedState}
                        status={status}
                    />
                </div>

                {/* Internal Navigation */}
                <div className="flex flex-col md:flex-row gap-4 justify-between pt-6 border-t border-white/10">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        View Full 2026 Calendar
                    </Link>

                    {mode === 'today' ? (
                        <Link
                            href="/tomorrow"
                            className="flex items-center gap-2 text-[#7d3cff] hover:text-[#14A900] transition-colors text-sm font-bold uppercase border border-[#7d3cff]/30 px-4 py-2 rounded bg-[#7d3cff]/5"
                        >
                            Check Tomorrow's Status
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    ) : (
                        <Link
                            href="/today"
                            className="flex items-center gap-2 text-[#7d3cff] hover:text-[#14A900] transition-colors text-sm font-bold uppercase border border-[#7d3cff]/30 px-4 py-2 rounded bg-[#7d3cff]/5"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Check Today's Status
                        </Link>
                    )}
                </div>

                {/* Disclaimers */}
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 text-[12px] text-gray-500">
                    <div className="flex items-start gap-1.5">
                        <AlertCircle className="w-[14px] h-[14px] text-yellow-500 shrink-0 mt-[1.5px]" />
                        <span>Confirm with local branch</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                        <CheckCircle className="w-[14px] h-[14px] text-[#14A900] shrink-0 mt-[1.5px]" />
                        <span>Based on RBI & State Govt Holidays</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
