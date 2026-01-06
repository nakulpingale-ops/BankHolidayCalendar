"use client";

import { useEffect, useState } from "react";
import { format, endOfMonth, startOfMonth, eachDayOfInterval, isSaturday, isBefore, isSameDay, isAfter, getDate, addMonths, parse } from "date-fns";
import { Activity, CalendarDays, TrendingUp } from "lucide-react";
import { useHolidayData } from "@/lib/HolidayContext";

export function TrackerInsight() {
    const { holidays, selectedState, isBankOpen } = useHolidayData();
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


        // --- 2. Dynamic Upcoming Holiday Logic (New) ---
        // Find the first future holiday that is closed for the selected state
        // We check: Jan 1 special rule, then CSV data

        let foundHoliday: { date: Date; name: string } | null = null;

        // 2a. Check Jan 1 explicitly if it's in the future (or today)
        const jan1 = new Date(2026, 0, 1);
        if ((isAfter(jan1, now) || isSameDay(jan1, now))) {
            const statusJan1 = isBankOpen(jan1, selectedState);
            if (!statusJan1.isOpen && statusJan1.type === 'holiday') {
                foundHoliday = { date: jan1, name: statusJan1.reason };
            }
        }

        // 2b. If not Jan 1, check CSV holidays
        if (!foundHoliday && holidays.length > 0) {
            // Filter holidays relative to selected state and today
            const relevant = holidays
                .map(h => ({ ...h, parsedDate: parse(h.Date, "yyyy/MM/dd", new Date()) }))
                .filter(h => isAfter(h.parsedDate, now) || isSameDay(h.parsedDate, now))
                .filter(h => h.State === "All" || h.State === selectedState)
                .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

            // Pick the first one that is actually 'Closed'
            // Note: Our CSV usually implies closed, but best to be sure.
            // We can skip Jan 1 here if we already checked it, or let it be found if CSV governs it.
            // Since we have manual Jan 1 logic in isBankOpen, and CSV might not reflect the "Closed States" list perfectly,
            // we rely on the list we just filtered.

            if (relevant.length > 0) {
                // Check if the first candidate is Jan 1. If so, re-verify with isBankOpen just in case
                // logic overlaps.
                for (const h of relevant) {
                    const status = isBankOpen(h.parsedDate, selectedState);
                    if (!status.isOpen && status.type === 'holiday') {
                        foundHoliday = { date: h.parsedDate, name: h["Holiday"] };
                        break;
                    }
                }
            }
        }

        // Fallback or "None"
        setUpcomingHoliday(foundHoliday);

    }, [holidays, selectedState, isBankOpen]); // Re-run when state changes

    return (
        <section className="w-full max-w-[1050px] mx-auto z-20 relative -mt-[39px] px-4">
            <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-[#7d3cff]" />
                <h2 className="text-2xl font-bold tracking-tight text-white">Tracker Insights</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1: Upcoming Insight (Now Left) */}
                <div className="relative group rounded-[4px] bg-white/5 backdrop-blur-sm border border-[#5a171e] px-6 pt-6 pb-6 shadow-xl transition-all hover:shadow-[0_0_25px_rgba(220,38,38,0.25)] hover:border-red-500/50 h-full min-h-[290px]">
                    <div className="flex gap-4">
                        {/* Left Column: Icon */}
                        <div className="flex-shrink-0 pt-1">
                            <Activity className="w-6 h-6 animate-pulse text-purple-400" />
                        </div>

                        {/* Right Column: Content */}
                        <div className="flex flex-col w-full">
                            {/* Header */}
                            <h3 className="text-sm font-semibold tracking-wide text-white">Upcoming insight ({selectedState})</h3>

                            {/* Main Highlight */}
                            <div className="mt-2">
                                <h2 className="text-[26px] font-bold text-white leading-none">
                                    {upcomingHoliday ? upcomingHoliday.name : "No Upcoming Holiday"}
                                </h2>
                                <div className="flex items-center gap-3">
                                    <span className="text-white font-medium">
                                        {upcomingHoliday ? format(upcomingHoliday.date, "EEE, d MMM yyyy") : "-"}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-[12px] text-gray-400 leading-relaxed mt-3 mb-4">
                                Banks closed across {selectedState}. <br />Digital channels (UPI/IMPS) remain fully operational.
                            </p>

                            {/* Service Status Grid */}
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
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: 2nd & 4th Saturday Tracker (Now Right) */}
                <div className="relative group rounded-[4px] bg-white/5 backdrop-blur-sm border border-[#5a171e] px-6 pt-6 pb-6 shadow-xl transition-all hover:shadow-[0_0_25px_rgba(220,38,38,0.25)] hover:border-red-500/50 h-full min-h-[290px] flex flex-col justify-between">
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
                            <div className="flex items-start gap-3 mt-6">
                                {saturdays.map((sat, idx) => {
                                    const isTarget = targetHoliday && isSameDay(sat, targetHoliday);
                                    const isHoliday = isHolidaySaturday(sat);

                                    let boxClass = "w-10 h-10 rounded-[4px] flex items-center justify-center text-sm font-bold border transition-all duration-300 ";

                                    if (isTarget) {
                                        boxClass += "bg-red-600/40 border-red-500/70 text-white shadow-[0_0_15px_rgba(220,38,38,0.12)] opacity-100 ring-2 ring-red-400/10 z-10 scale-105";
                                    } else if (isHoliday) {
                                        boxClass += "bg-red-900/40 border-red-800 text-red-200 opacity-50";
                                    } else {
                                        boxClass += "bg-gray-800/40 border-gray-700 text-gray-500 opacity-20";
                                    }

                                    const labels = ["1st", "2nd", "3rd", "4th", "5th"];

                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-1.5">
                                            <div className={boxClass}>
                                                {getDate(sat)}
                                            </div>
                                            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{labels[idx]}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer - Moved inside Left Column */}
            <div className="flex flex-col items-end mt-4">
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
        </section>
    );
}
