"use client";

import { useEffect, useState } from "react";
import { format, endOfMonth, startOfMonth, eachDayOfInterval, isSaturday, isBefore, isSameDay, isAfter, getDate, addMonths, parse } from "date-fns";
import { Activity, CalendarDays, TrendingUp } from "lucide-react";
import { useHolidayData } from "@/lib/HolidayContext";

export function TrackerInsight() {
    const { holidays, selectedState, isBankOpen, getHolidays } = useHolidayData();
    const [saturdays, setSaturdays] = useState<Date[]>([]);
    const [today, setToday] = useState<Date>(new Date());
    const [displayDate, setDisplayDate] = useState<Date>(new Date());
    const [targetHoliday, setTargetHoliday] = useState<Date | null>(null);

    // New State for Upcoming Insight
    const [upcomingHoliday, setUpcomingHoliday] = useState<{ date: Date; name: string } | null>(null);

    // Helper to check if a saturday is 2nd or 4th
    const isHolidaySaturday = (date: Date) => {
        const dayOfMonth = getDate(date);
        const weekOfMonth = Math.ceil(dayOfMonth / 7);
        return weekOfMonth === 2 || weekOfMonth === 4;
    };

    useEffect(() => {
        const now = new Date();
        setToday(now);

        // --- 1. Saturday Tracker Logic (Existing) ---
        const currentStart = startOfMonth(now);
        const currentEnd = endOfMonth(now);
        const currentDays = eachDayOfInterval({ start: currentStart, end: currentEnd });
        const currentSats = currentDays.filter(day => isSaturday(day));
        const currentHolidays = currentSats.filter(s => isHolidaySaturday(s));
        const nextHolidayInCurrent = currentHolidays.find(h => isAfter(h, now) || isSameDay(h, now));

        let calculatedDisplayDate = now;
        let calculatedTarget = nextHolidayInCurrent || null;

        if (!nextHolidayInCurrent) {
            calculatedDisplayDate = addMonths(now, 1);
            const nextStart = startOfMonth(calculatedDisplayDate);
            const nextEnd = endOfMonth(calculatedDisplayDate);
            const nextDays = eachDayOfInterval({ start: nextStart, end: nextEnd });
            const nextSats = nextDays.filter(day => isSaturday(day));
            const nextMonthHolidays = nextSats.filter(s => isHolidaySaturday(s));
            if (nextMonthHolidays.length > 0) {
                calculatedTarget = nextMonthHolidays[0];
            }
        }

        setDisplayDate(calculatedDisplayDate);
        setTargetHoliday(calculatedTarget);

        const start = startOfMonth(calculatedDisplayDate);
        const end = endOfMonth(calculatedDisplayDate);
        const days = eachDayOfInterval({ start, end });
        const sats = days.filter(day => isSaturday(day));
        setSaturdays(sats);


        // --- 2. Dynamic Upcoming Holiday Logic (New Simplified) ---
        // Use the robust combined list which includes CSV + Saturdays + Jan 1 rule
        const fullList = getHolidays(selectedState, 2026);

        // Find first holiday >= today that is NOT a 2nd/4th Saturday
        // Note: fullList is already sorted by date
        const upcoming = fullList
            .filter(h => isAfter(h.date, now) || isSameDay(h.date, now))
            .find(h => {
                const nameLower = h.name.toLowerCase();
                const isSaturdayHoliday = nameLower.includes("second saturday") || nameLower.includes("fourth saturday");
                // Defensive: Exclude any banking holiday with "Saturday" in name (if type is Banking)
                const isBankingSaturday = h.type === "Banking" && nameLower.includes("saturday");

                return !isSaturdayHoliday && !isBankingSaturday;
            });

        if (upcoming) {
            setUpcomingHoliday({ date: upcoming.date, name: upcoming.name });
        } else {
            setUpcomingHoliday(null);
        }

    }, [holidays, selectedState, isBankOpen, getHolidays]); // Re-run when state changes

    return (
        <section className="w-full py-6 z-20 relative -mt-[66px]">
            <div className="w-full max-w-none px-4 sm:max-w-[1050px] sm:mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1: Upcoming Insight (Now Left) */}
                    <div className="relative group rounded-[12px] overflow-hidden bg-[#1A1A1A] backdrop-blur-sm border border-[#7d3cff]/45 px-6 pt-6 pb-6 shadow-xl transition-all h-full min-h-[290px]">
                        <div className="flex gap-4">
                            {/* Left Column: Icon */}
                            <div className="flex-shrink-0 pt-1">
                                <Activity className="w-6 h-6 animate-pulse text-purple-400" />
                            </div>

                            {/* Right Column: Content */}
                            <div className="flex flex-col w-full">
                                {/* Header */}
                                <h3 className="text-sm font-semibold tracking-wide text-white">Upcoming Insight ({selectedState})</h3>

                                {/* Main Highlight */}
                                <div className="mt-2">
                                    <h2 className="text-[26px] font-bold text-white leading-none">
                                        {upcomingHoliday ? upcomingHoliday.name : "No Upcoming Holiday"}
                                    </h2>
                                    <div className="flex flex-col items-start gap-1 mt-1">
                                        <span className="text-white font-medium">
                                            {upcomingHoliday ? format(upcomingHoliday.date, "EEE, d MMM yyyy") : "in 2026"}
                                        </span>
                                        {upcomingHoliday && (
                                            <span className="text-xs bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20">
                                                {Math.ceil((upcomingHoliday.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} days away
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-[12px] text-gray-400 leading-relaxed mt-3 mb-4">
                                    {upcomingHoliday
                                        ? `Banks in ${selectedState} will be closed.`
                                        : `No more bank holidays found in ${selectedState} for 2026. Check next year's calendar or switch state.`
                                    }
                                </p>

                                {/* Digital Banking List (Expanded by default) */}
                                <div className="border-t border-white/10 pt-2">
                                    <h4 className="text-[12px] font-medium text-[#7d3cff] mb-3">
                                        Operational Services
                                    </h4>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                        {[
                                            { name: "RTGS / NEFT", ok: true },
                                            { name: "UPI / IMPS", ok: true },
                                            { name: "Cheque Clearing", ok: false },
                                            { name: "Forex Windows", ok: false }
                                        ].map(s => (
                                            <div key={s.name} className="flex items-center gap-2">
                                                <div
                                                    className="w-2.5 h-2.5 rounded-full liveGlow transition-colors duration-300"
                                                    data-status={s.ok ? "open" : "closed"}
                                                    style={{
                                                        backgroundColor: s.ok ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"
                                                    }}
                                                />
                                                <span className="text-[11px] font-medium text-gray-300 tracking-wide">{s.name}</span>
                                            </div>
                                        ))}
                                        <p className="col-span-2 text-[10px] text-gray-500 mt-1 italic">
                                            * Online transfers available 24x7. Branch services closed.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: 2nd & 4th Saturday Tracker (Now Right) */}
                    <div className="relative group rounded-[12px] overflow-hidden bg-[#1A1A1A] backdrop-blur-sm border border-[#7d3cff]/45 px-6 pt-6 pb-6 shadow-xl transition-all h-full min-h-[290px] flex flex-col justify-between">
                        <div className="flex gap-4">
                            {/* Left Column: Icon */}
                            <div className="flex-shrink-0 pt-1">
                                <Activity className="w-6 h-6 animate-pulse text-red-500" />
                            </div>

                            {/* Right Column: All Text & Tracker */}
                            <div className="flex flex-col w-full">
                                {/* Line 1: Title */}
                                <h3 className="text-[16px] font-bold text-white tracking-wide leading-tight">
                                    Second and Fourth Saturday Tracker
                                    <span className="block whitespace-nowrap text-[26px] font-bold text-white leading-none mt-1">{format(displayDate, 'MMMM yyyy')}</span>
                                </h3>

                                {/* Line 2: Subtitle */}
                                <p className="text-[14px] font-normal text-gray-400 mt-1 leading-snug">
                                    Recurring RBI Rule: 2nd & 4th Saturdays are holidays
                                </p>

                                {/* Spacer */}
                                <div className="h-6"></div>

                                {/* Line 3: Dynamic Date */}
                                <p className="text-[14px] font-normal text-gray-400 leading-snug">
                                    Next Holiday: Sat, {targetHoliday ? format(targetHoliday, 'd MMM') : 'None'} is
                                </p>

                                {/* Line 4: Status */}
                                <div className="text-[26px] font-bold text-white tracking-tight leading-none mt-1">
                                    Closed
                                </div>

                                {/* Visual Date Tracker (Box Row) */}
                                <div className="flex items-start gap-2 mt-[14px]">
                                    {saturdays.map((sat, idx) => {
                                        const isTarget = targetHoliday && isSameDay(sat, targetHoliday);
                                        const isHoliday = isHolidaySaturday(sat);

                                        let boxClass = "w-8 h-8 rounded-[3px] flex items-center justify-center text-xs font-bold border transition-all duration-300 ";

                                        if (isTarget) {
                                            boxClass += "bg-red-600/40 border-red-500/70 text-white shadow-[0_0_15px_rgba(220,38,38,0.12)] opacity-100 ring-2 ring-red-400/10 z-10 scale-105";
                                        } else if (isHoliday) {
                                            boxClass += "bg-red-900/40 border-red-800 text-red-200 opacity-50";
                                        } else {
                                            boxClass += "bg-gray-800/40 border-gray-700 text-gray-500 opacity-20";
                                        }

                                        const labels = ["1st", "2nd", "3rd", "4th", "5th"];

                                        return (
                                            <div key={idx} className="flex flex-col items-center gap-1">
                                                <div className={boxClass}>
                                                    {getDate(sat)}
                                                </div>
                                                <span className="text-[9px] text-gray-500 font-medium uppercase tracking-wider">{labels[idx]}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        {/* Footer - Moved inside Card */}
                        <div className="static sm:absolute sm:bottom-[10px] sm:right-6 mt-4 sm:mt-0 flex flex-col items-end text-right">
                            <div className="text-[12px] tracking-widest font-medium transition-all">
                                <span className="text-gray-500 opacity-60 hover:opacity-100 transition-opacity">powered by </span>
                                <a href="https://saturdaytracker.com/" target="_blank" rel="noopener noreferrer" className="text-[#7d3cff] border-b border-dotted border-[#7d3cff] hover:text-[#14A900] hover:border-[#14A900] hover:border-solid hover:border-b-[1.5px] transition-all duration-300 ease-in-out">SaturdayTracker.com</a>
                            </div>
                            <div className="text-[12px] font-medium tracking-wide">
                                <span className="text-gray-500">a </span>
                                <span className="text-[#7d3cff]">HOLBANK</span>
                                <span className="text-gray-500"> product</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Old Footer Removed */}
            </div>
        </section>
    );
}
