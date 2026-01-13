"use client";

import { useState, useMemo, useEffect } from "react";
import { format, getMonth, parseISO, isSameDay, isSaturday, getWeekOfMonth } from "date-fns";
import Papa from "papaparse";
import { useHolidayData, HolidayItem } from "@/lib/HolidayContext";
import { isPastDate, isTodayDate } from "@/src/lib/holidays";
import { List, CalendarDays, ChevronLeft, ChevronRight, Share2, CalendarPlus, Download, Printer } from "lucide-react";
import { Toast } from "@/components/Toast";
import { PrintHeader } from "./PrintHeader";

export function HolidayList() {
    const { selectedState, getHolidays, isBankOpen } = useHolidayData();
    const year = 2026;
    const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

    // --- View Mode State ---
    const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
    const [calendarMonth, setCalendarMonth] = useState<number>(() => new Date().getMonth());
    const [selectedDateDetails, setSelectedDateDetails] = useState<{ date: Date, holidays: HolidayItem[] } | null>(null);

    // --- Date Check Mode State ---
    const [checkDate, setCheckDate] = useState("");
    const [dateCheckResult, setDateCheckResult] = useState<{ date: Date; status: any } | null>(null);

    const [includeSaturdayClosures, setIncludeSaturdayClosures] = useState(true);

    // Persist View Mode and Saturday Toggle
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem("viewMode");
            if (savedMode === "list" || savedMode === "calendar") {
                setViewMode(savedMode);
            }
            const savedSatToggle = localStorage.getItem("includeSaturdayClosures");
            if (savedSatToggle !== null) {
                setIncludeSaturdayClosures(savedSatToggle === "true");
            }
        }
    }, []);

    const handleSatToggleChange = (value: boolean) => {
        setIncludeSaturdayClosures(value);
        if (typeof window !== 'undefined') {
            localStorage.setItem("includeSaturdayClosures", value.toString());
        }
    };

    const handleViewChange = (mode: "list" | "calendar") => {
        setViewMode(mode);
        if (typeof window !== 'undefined') {
            localStorage.setItem("viewMode", mode);
        }
    };

    // 1. Get Full List
    const allHolidays = useMemo(() => {
        const rawHolidays = getHolidays(selectedState, year);
        return rawHolidays.map(h => {
            const dateObj = h.date;
            const weekOfMonth = getWeekOfMonth(dateObj);
            const isSat = isSaturday(dateObj);
            const nameLower = h.name.toLowerCase();

            const isSaturdayClosure =
                nameLower.includes("second saturday") ||
                nameLower.includes("fourth saturday") ||
                (isSat && h.type === "Banking" && (weekOfMonth === 2 || weekOfMonth === 4));

            return { ...h, isSaturdayClosure };
        });
    }, [selectedState, getHolidays, year]);

    // 2. Month Filtering (Control Bar)
    const [selectedMonth, setSelectedMonth] = useState<number | "All">(() => new Date().getMonth());

    // Reset to current month when state changes, unless date check is active
    useEffect(() => {
        if (!checkDate) {
            const currentMonth = new Date().getMonth();
            setSelectedMonth(currentMonth);
            setCalendarMonth(currentMonth);
            setSelectedDateDetails(null);
        }
    }, [selectedState, checkDate]);

    // Sync Calendar Month with Filter
    useEffect(() => {
        if (selectedMonth !== "All" && !checkDate) {
            setCalendarMonth(Number(selectedMonth));
        }
    }, [selectedMonth, checkDate]);

    // Handle Date Check Logic
    useEffect(() => {
        if (!checkDate) {
            setDateCheckResult(null);
            return;
        }

        const dateObj = parseISO(checkDate);
        // Only validate year 2026 for now as per requirements, or leave open if logic supports it.
        // The requirement mentions: "If user selects date outside 2026: show message".
        // For now, let's process it. logic.ts likely defaults to Sunday/Sat rules.

        const status = isBankOpen(dateObj, selectedState);
        setDateCheckResult({ date: dateObj, status });

        // When checking date, ensure we are in List mode to show result
        if (viewMode !== "list") setViewMode("list");

    }, [checkDate, selectedState, isBankOpen, viewMode]);


    const filteredHolidays = useMemo(() => {
        let list = includeSaturdayClosures ? allHolidays : allHolidays.filter(h => !h.isSaturdayClosure);
        if (selectedMonth === "All") return list;
        return list.filter(h => getMonth(h.date) === selectedMonth);
    }, [allHolidays, selectedMonth, includeSaturdayClosures]);

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // --- Calendar View Helpers ---
    const calendarDays = useMemo(() => {
        const firstDay = new Date(year, calendarMonth, 1);
        const lastDay = new Date(year, calendarMonth + 1, 0);
        const days = [];
        const startPadding = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
        const totalDays = lastDay.getDate();

        // Padding
        for (let i = 0; i < startPadding; i++) days.push(null);
        // Days
        for (let i = 1; i <= totalDays; i++) days.push(new Date(year, calendarMonth, i));

        return days;
    }, [calendarMonth, year]);

    const holidaysInCalendarMonth = useMemo(() => {
        return allHolidays.filter(h => getMonth(h.date) === calendarMonth);
    }, [allHolidays, calendarMonth]);

    const getHolidaysForDate = (date: Date) => {
        return holidaysInCalendarMonth.filter(h => format(h.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"));
    };

    const handleMonthNav = (direction: -1 | 1) => {
        let newMonth = calendarMonth + direction;
        if (newMonth < 0) newMonth = 11;
        if (newMonth > 11) newMonth = 0;
        setCalendarMonth(newMonth);
        setSelectedMonth(newMonth);
        setSelectedDateDetails(null);
    };


    const showSuccessToast = (message: string) => {
        setToast({ show: true, message });
    };

    const closeToast = () => {
        setToast((prev) => ({ ...prev, show: false }));
    };

    // --- Action Handlers ---
    const handleShare = async () => {
        const shareData = {
            title: `${selectedState} Bank Holidays ${year}`,
            text: `Check out the complete list of bank holidays in ${selectedState} for ${year}.`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                showSuccessToast("Shared successfully!");
            } else {
                await navigator.clipboard.writeText(window.location.href);
                showSuccessToast("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    const handleDownloadCSV = () => {
        const dataToExport = filteredHolidays.map(h => ({
            Date: h.dateISO,
            Day: h.dayOfWeek,
            Holiday: h.name,
            State: h.state,
            Type: h.type,
            Status: "Closed"
        }));

        const csv = Papa.unparse(dataToExport);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const filename = `${selectedState.replace(/ /g, "-")}-Bank-Holidays-${year}.csv`;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showSuccessToast("Success! Action completed.");
    };

    const handleAddToCalendar = () => {
        let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//BankHolidayCalendar//EN\n";

        filteredHolidays.forEach((h) => {
            const dateStr = h.dateISO.replace(/[-]/g, ""); // YYYYMMDD
            const uid = `${dateStr}-${h.name.replace(/\s+/g, "")}@bankholidaycalendar.com`;

            icsContent += "BEGIN:VEVENT\n";
            icsContent += `UID:${uid}\n`;
            icsContent += `DTSTART;VALUE=DATE:${dateStr}\n`;
            icsContent += `SUMMARY:${h.name} (${h.type})\n`;
            icsContent += `DESCRIPTION:Bank Holiday in ${h.state}. Type: ${h.type}\n`;
            icsContent += "END:VEVENT\n";
        });

        icsContent += "END:VCALENDAR";

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${selectedState.toLowerCase().replace(/ /g, "-")}-holidays-${year}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showSuccessToast("Success! Action completed.");
    };

    const handlePrint = () => {
        window.print();
    };

    const isActionDisabled = !checkDate && filteredHolidays.length === 0;
    const actionButtonClass = `p-2 border border-[#7d3cff]/20 rounded-[4px] text-[#7d3cff] hover:border-[#7d3cff] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#7d3cff]/20 print:hidden`;


    // Helper for Type Badge/Color
    const getTypeColor = (type: string) => {
        switch (type) {
            case "National": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
            case "Banking": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
            case "State": return "text-[#7d3cff] bg-[#7d3cff]/10 border-[#7d3cff]/20";
            case "weekend": return "text-red-400 bg-red-400/10 border-red-400/20";
            case "holiday": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
            default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
        }
    };

    // Helper for Status Badge
    const getStatusBadge = (isOpen: boolean, isPast: boolean = false) => {
        if (isOpen) {
            const style = isPast ? "text-green-400/50 bg-green-400/5 border-green-400/10" : "text-green-400 bg-green-400/10 border-green-400/20";
            return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border print:border-black print:text-black print:bg-transparent print:font-bold ${style}`}>Open</span>;
        }
        const style = isPast ? "text-red-400/50 bg-red-400/5 border-red-400/10" : "text-red-400 bg-red-400/10 border-red-400/20";
        return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border print:border-black print:text-black print:bg-transparent print:font-bold ${style}`}>Closed</span>;
    };

    return (
        <section id="state-holidays-complete-list" className="w-full pt-0 -mt-[24px] pb-0 mb-8 text-white relative z-20">
            <div className="w-full max-w-none px-4 sm:max-w-[1050px] sm:mx-auto">
                {/* LIST BOX WRAPPER */}
                <div className="w-full flex flex-col sm:rounded-[4px] sm:border sm:border-[#7d3cff]/45 sm:bg-[#121212]/80 sm:shadow-2xl">
                    <div className="w-full mb-0 sticky top-20 z-30 p-2 sm:p-2 border-b-0 sm:border-b sm:border-white/10 bg-transparent sm:bg-[#0e0a18]/95 sm:backdrop-blur-md sm:rounded-t-[4px] print:hidden">

                        {/* Unified Header: Dropdown + Date Check + View Toggle */}
                        <div className="flex items-center justify-between gap-2 sm:gap-4 flex-nowrap">

                            {/* Left Group: Month & Date Selector */}
                            <div className="flex items-center gap-2 sm:gap-3 shrink w-auto">
                                {/* Month Dropdown */}
                                <div className="relative shrink">
                                    <label className="sr-only" htmlFor="monthFilter">Month</label>
                                    <select
                                        id="monthFilter"
                                        value={selectedMonth}
                                        onChange={(e) => {
                                            if (checkDate) setCheckDate(""); // Clear date check if changing month
                                            setSelectedMonth(e.target.value === "All" ? "All" : Number(e.target.value));
                                        }}
                                        disabled={!!checkDate}
                                        className="h-9 w-auto min-w-[72px] sm:w-[140px] rounded-[4px] bg-[#7d3cff] border-white/20 px-2 sm:px-3 text-sm text-white font-medium outline-none appearance-none hover:bg-[#8b52ff] focus:ring-[0.5px] focus:ring-white/30 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink"
                                        title={checkDate ? "Clear date to browse months" : "Select Month"}
                                    >
                                        <option value="All" className="bg-[#0e0a18] text-white">All months</option>
                                        {months.map((m, idx) => (
                                            <option key={m} value={idx} className="bg-[#0e0a18] text-white">{m}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-white">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>

                                <span className="sm:hidden text-xs text-white/50 px-0 whitespace-nowrap">or</span>
                                <span className="hidden sm:inline text-xs text-white/50 whitespace-nowrap">or check a custom date</span>

                                {/* Custom Date Input + Helper */}
                                <div className="relative shrink flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="date"
                                            value={checkDate}
                                            onChange={(e) => setCheckDate(e.target.value)}
                                            className="h-9 w-auto min-w-[128px] sm:w-auto rounded-[4px] border px-2 sm:px-3 text-sm outline-none transition-colors uppercase appearance-none shrink
                                                text-[rgba(255,255,255,0.92)] sm:text-white/90
                                                bg-[rgba(255,255,255,0.06)] sm:bg-black/20
                                                border-[rgba(255,255,255,0.14)] sm:border-white/10
                                                caret-[rgba(255,255,255,0.92)] sm:caret-current
                                                placeholder:text-[rgba(255,255,255,0.45)] placeholder:opacity-100
                                                focus:border-[rgba(125,60,255,0.6)] focus:shadow-[0_0_0_2px_rgba(125,60,255,0.25)]
                                                hover:border-[#7d3cff]/30"
                                            placeholder="DD-MM-YYYY"
                                        />
                                        {checkDate && (
                                            <button
                                                onClick={() => setCheckDate("")}
                                                className="h-9 px-2 rounded-[4px] border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-white/70 transition-colors"
                                                title="Clear date and return to list"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Desktop Saturday Toggle - placed right after date selector */}
                                <div className="hidden lg:flex items-center ml-2">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={includeSaturdayClosures}
                                                onChange={(e) => handleSatToggleChange(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-8 h-4 bg-white/10 rounded-full peer peer-checked:bg-[#7d3cff]/60 transition-colors"></div>
                                            <div className="absolute left-0.5 w-3 h-3 bg-white/60 rounded-full peer-checked:translate-x-4 transition-transform peer-checked:bg-white"></div>
                                        </div>
                                        <span className="text-xs text-white/70 group-hover:text-white transition-colors whitespace-nowrap select-none">
                                            Include 2nd and 4th Saturdays
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Right Group: View Toggle */}
                            <div className="flex items-center gap-1 shrink-0 ml-auto sm:ml-0">
                                <button
                                    onClick={() => handleViewChange("list")}
                                    className={`p-1.5 rounded-[4px] transition-all ${viewMode === "list" ? "bg-[#7d3cff]/20 text-[#7d3cff] ring-1 ring-[#7d3cff]/50" : "text-gray-400 hover:text-white"}`}
                                    aria-label="List View"
                                    aria-pressed={viewMode === "list"}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        if (checkDate) setCheckDate(""); // Switch out of date mode
                                        handleViewChange("calendar");
                                    }}
                                    className={`p-1.5 rounded-[4px] transition-all ${viewMode === "calendar" ? "bg-[#7d3cff]/20 text-[#7d3cff] ring-1 ring-[#7d3cff]/50" : "text-gray-400 hover:text-white"}`}
                                    aria-label="Calendar View"
                                    aria-pressed={viewMode === "calendar"}
                                >
                                    <CalendarDays className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Saturday Toggle */}
                        <div className="flex lg:hidden items-center justify-start pl-0 pr-2 py-1 mt-[5px]">
                            <label className="flex items-center gap-4 cursor-pointer group">
                                <div className="relative flex items-center scale-[1.35] origin-left">
                                    <input
                                        type="checkbox"
                                        checked={includeSaturdayClosures}
                                        onChange={(e) => handleSatToggleChange(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-7 h-3.5 bg-white/10 rounded-full peer peer-checked:bg-[#7d3cff]/60 transition-colors"></div>
                                    <div className="absolute left-0.5 w-2.5 h-2.5 bg-white/60 rounded-full peer-checked:translate-x-3.5 transition-transform peer-checked:bg-white"></div>
                                </div>
                                <span className="text-[14px] text-white/70 group-hover:text-white transition-colors whitespace-nowrap select-none">
                                    Include 2nd and 4th Saturdays
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* CONTENT AREA */}
                    <div className="w-full print-container">
                        <PrintHeader stateName={selectedState} />
                        {/* LIST MODE (Either Month List OR Date Check Result) */}
                        {viewMode === "list" ? (
                            checkDate && dateCheckResult ? (
                                // DATE CHECK RESULT ROW
                                <div className="w-full">
                                    {/* Helper message */}
                                    <div className="px-4 py-2 text-xs text-gray-400 bg-white/5 border-b border-white/10">
                                        Result for <span className="text-white font-bold">{format(dateCheckResult.date, "dd MMM yyyy")}</span> ({selectedState})
                                        {dateCheckResult.date.getFullYear() !== 2026 && <span className="ml-2 text-red-400 font-bold">(Note: Showing data for 2026 only)</span>}
                                    </div>

                                    {/* Result Table (Desktop) */}
                                    <div className="hidden sm:block overflow-hidden rounded-b-[4px] print:block print:rounded-none">
                                        <table className="w-full text-left border-collapse print:w-full">
                                            <thead>
                                                <tr className="bg-white/5 border-b border-white/10 print:bg-gray-100">
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[180px] print:text-black print:p-2 print:border-b print:border-black">Date</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[100px] print:text-black print:p-2 print:border-b print:border-black">Day</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:text-black print:p-2 print:border-b print:border-black">Holiday Name</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[100px] print:text-black print:p-2 print:border-b print:border-black">Status</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[150px] print:text-black print:p-2 print:border-b print:border-black">Type</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 print:divide-black">
                                                <tr className="hover:bg-white/5 transition-colors print:break-inside-avoid">
                                                    <td className="p-4 text-sm font-medium text-white print:text-black print:p-2">
                                                        {format(dateCheckResult.date, "dd MMM yyyy")}
                                                    </td>
                                                    <td className="p-4 text-sm text-gray-400 print:text-black print:p-2">
                                                        {format(dateCheckResult.date, "EEE")}
                                                    </td>
                                                    <td className="p-4 text-sm font-semibold text-white print:text-black print:p-2">
                                                        {dateCheckResult.status.isOpen ? "—" : dateCheckResult.status.reason}
                                                    </td>
                                                    <td className="p-4 print:p-2">
                                                        {getStatusBadge(dateCheckResult.status.isOpen)}
                                                    </td>
                                                    <td className="p-4 print:p-2">
                                                        {dateCheckResult.status.isOpen ? "—" : (
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border print:border-black print:text-black print:bg-transparent print:font-bold ${getTypeColor(dateCheckResult.status.type)}`}>
                                                                {dateCheckResult.status.type || "N/A"}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Result Card (Mobile) */}
                                    <div className="sm:hidden p-4">
                                        <div className="bg-[#0e0a18]/80 border border-white/10 rounded-[4px] p-4 shadow-lg active:scale-[0.99] transition-transform">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{format(dateCheckResult.date, "EEE")}</span>
                                                    <span className="text-lg font-bold text-white">{format(dateCheckResult.date, "dd MMM yyyy")}</span>
                                                </div>
                                                {getStatusBadge(dateCheckResult.status.isOpen)}
                                            </div>
                                            <div className="h-px w-full bg-white/5 my-2"></div>
                                            <h3 className="text-base font-semibold text-white leading-tight mb-2">
                                                {dateCheckResult.status.isOpen ? "Normal Working Day" : dateCheckResult.status.reason}
                                            </h3>
                                            {!dateCheckResult.status.isOpen && (
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getTypeColor(dateCheckResult.status.type)}`}>
                                                    {dateCheckResult.status.type}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // MONTH LIST VIEW
                                filteredHolidays.length === 0 ? (
                                    <div className="w-full py-12 text-center border border-white/10 rounded-[4px] bg-white/5">
                                        <p className="text-gray-400">No holidays found for this selection.</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Desktop Table View */}
                                        <div className="hidden sm:block overflow-hidden rounded-b-[4px] print:block print:rounded-none">
                                            <table className="w-full text-left border-collapse print:w-full">
                                                <thead>
                                                    <tr className="bg-white/5 border-b border-white/10 print:bg-gray-100">
                                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[180px] print:text-black print:p-2 print:border-b print:border-black">Date</th>
                                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[100px] print:text-black print:p-2 print:border-b print:border-black">Day</th>
                                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:text-black print:p-2 print:border-b print:border-black">Holiday Name</th>
                                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[100px] print:text-black print:p-2 print:border-b print:border-black">Status</th>
                                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[150px] print:text-black print:p-2 print:border-b print:border-black">Type</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5 print:divide-black">
                                                    {filteredHolidays.map((h, idx) => {
                                                        const isPast = isPastDate(h.dateISO);
                                                        return (
                                                            <tr key={`${h.dateISO}-${idx}`} className={`hover:bg-white/5 transition-colors print:break-inside-avoid ${isPast ? 'opacity-60' : ''}`}>
                                                                <td className={`p-4 text-sm font-medium print:text-black print:p-2 ${h.date.getDay() === 0 ? (isPast ? 'text-red-400/50' : 'text-red-400') : (isPast ? 'text-white/50' : 'text-white')}`}>
                                                                    {format(h.date, "dd MMM yyyy")}
                                                                </td>
                                                                <td className={`p-4 text-sm print:text-black print:p-2 ${h.date.getDay() === 0 ? (isPast ? 'text-red-400/40' : 'text-red-400/70') : (isPast ? 'text-gray-500/50' : 'text-gray-400')}`}>
                                                                    {h.dayOfWeek}
                                                                </td>
                                                                <td className={`p-4 text-sm font-semibold print:text-black print:p-2 ${isPast ? 'text-white/50' : 'text-white'}`}>
                                                                    {h.name}
                                                                </td>
                                                                <td className="p-4 print:p-2">
                                                                    {getStatusBadge(false, isPast)}
                                                                </td>
                                                                <td className="p-4 print:p-2">
                                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border print:border-black print:text-black print:bg-transparent print:font-bold ${getTypeColor(h.type)} ${isPast ? 'opacity-70' : ''}`}>
                                                                        {h.type}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile Card View */}
                                        <div className="sm:hidden flex flex-col gap-3 p-4 pt-2">
                                            {filteredHolidays.map((h, idx) => {
                                                const isPast = isPastDate(h.dateISO);
                                                return (
                                                    <div key={`${h.dateISO}-${idx}-mob`} className={`bg-[#0e0a18]/80 border border-white/10 rounded-[4px] p-4 shadow-lg active:scale-[0.99] transition-transform ${isPast ? 'opacity-70' : ''}`}>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex flex-col">
                                                                <span className={`text-xs font-bold uppercase tracking-widest ${h.dayOfWeek === 'Sun' ? (isPast ? 'text-red-400/40' : 'text-red-400/70') : (isPast ? 'text-gray-500/60' : 'text-gray-500')}`}>{h.dayOfWeek}</span>
                                                                <span className={`text-lg font-bold ${isPast ? 'text-white/60' : 'text-white group-hover:text-[#ef4444]'}`}>{format(h.date, "dd MMM yyyy")}</span>
                                                            </div>
                                                            {getStatusBadge(false, isPast)}
                                                        </div>
                                                        <div className={`h-px w-full my-2 ${isPast ? 'bg-white/5' : 'bg-white/5'}`}></div>
                                                        <h3 className={`text-base font-semibold leading-tight mb-2 ${isPast ? 'text-white/60' : 'text-white'}`}>
                                                            {h.name}
                                                        </h3>
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getTypeColor(h.type)} ${isPast ? 'opacity-70' : ''}`}>
                                                            {h.type}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                )
                            )
                        ) : (
                            /* CALENDAR VIEW (Unchanged logic, wrapped in container) */
                            <div className="w-full p-2">
                                {/* Calendar Header */}
                                <div className="flex items-center justify-between mb-4 px-2 pt-2">
                                    <h3 className="text-xl font-bold text-white">{getMonthName(calendarMonth)} {year}</h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleMonthNav(-1)} className="p-1 rounded hover:bg-white/10">
                                            <ChevronLeft className="w-5 h-5 text-gray-400" />
                                        </button>
                                        <button onClick={() => handleMonthNav(1)} className="p-1 rounded hover:bg-white/10">
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
                                    {/* Weekday Labels */}
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className={`text-center text-xs font-medium py-2 ${day === 'Sun' ? 'text-red-400' : 'text-gray-500'}`}>
                                            {day}
                                        </div>
                                    ))}

                                    {/* Days */}
                                    {calendarDays.map((date, i) => {
                                        if (!date) return <div key={`empty-${i}`} className="aspect-square bg-transparent" />;

                                        // Determine status for this date
                                        const bankStatus = isBankOpen(date, selectedState);
                                        const isOpenWorkingDay = bankStatus.isOpen; // True if not holiday, not Sunday, not 2nd/4th Sat

                                        const dayHolidays = getHolidaysForDate(date);
                                        const hasHoliday = dayHolidays.length > 0;
                                        const isSelected = selectedDateDetails && isSameDay(date, selectedDateDetails.date);
                                        const isToday = isTodayDate(format(date, "yyyy-MM-dd"));
                                        const isPast = isPastDate(format(date, "yyyy-MM-dd"));
                                        const isSundayDay = date.getDay() === 0;

                                        const holidayNames = dayHolidays.map(h => h.name).join(", ");

                                        // Tooltip Content logic
                                        let tooltipLabel: string | undefined = undefined;
                                        if (hasHoliday) tooltipLabel = holidayNames;
                                        else if (isOpenWorkingDay) tooltipLabel = "Open (Normal business day)";

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => hasHoliday ? setSelectedDateDetails({ date, holidays: dayHolidays }) : setSelectedDateDetails(null)}
                                                // If I enable it for hover, I might enable click?
                                                // "Hover should not set selection state". So onClick can stay as is (only sets selection if hasHoliday).
                                                // But `disabled` prevents hover events in some browsers/UI libs? Use 'pointer-events-none' on disabled?
                                                // React `disabled` usually blocks onClick. We want hover. Standard button supports title on disabled.
                                                // BUT to get `hover:` classes working, element shouldn't be effectively disabled for mouse.
                                                // Usually `disabled` buttons don't receive hover in Tailwind/CSS unless enforced.
                                                // User wants "Hover 12 Jan (working day): cell subtly turns green".
                                                // So I should remove `disabled` or ensure styles work.
                                                // Best to remove `disabled` but make onClick no-op if no holiday.

                                                title={tooltipLabel}
                                                aria-label={hasHoliday ? `${format(date, 'd MMMM yyyy')}: ${holidayNames}` : (isOpenWorkingDay ? `${format(date, 'd MMMM yyyy')}, Open` : format(date, 'd MMMM yyyy'))}
                                                className={`aspect-square rounded-[4px] flex flex-col items-center justify-center relative transition-all border group
                                                ${isSelected ? 'border-[#ef4444] ring-1 ring-[#ef4444] bg-[#ef4444]/10' : ''}
                                                
                                                ${hasHoliday && !isSelected ?
                                                        (isPast ? 'border-red-500/20 bg-red-500/5' // PAST HOLIDAY muted
                                                            : (isToday ? 'border-[#ef4444]/60 bg-red-500/20 ring-2 ring-violet-500/60 hover:bg-red-500/30' // TODAY HOLIDAY (Red + Purple Ring, Red hover)
                                                                : 'border-red-500/30 bg-red-500/10 hover:bg-red-500/20')) // FUTURE HOLIDAY
                                                        : ''}

                                                ${!hasHoliday ? (
                                                        isOpenWorkingDay
                                                            ? (isToday
                                                                ? 'bg-violet-500/10 border-violet-500/40 ring-1 ring-violet-500/30 cursor-default hover:bg-emerald-500/20 hover:border-emerald-500/40' // TODAY OPEN (Purple base, Green hover)
                                                                : 'border-transparent text-gray-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 cursor-default') // NORMAL OPEN
                                                            : (isSundayDay
                                                                ? (isPast ? 'border-transparent text-red-400/30 cursor-default' : 'border-transparent text-red-400/50 cursor-default')
                                                                : 'border-transparent text-gray-600 cursor-default')
                                                    ) : ''}
                                                
                                                ${hasHoliday && !isSelected && !isPast && !isToday ? 'cursor-pointer' : ''}
                                            `}
                                            >
                                                <span className={`text-sm ${hasHoliday
                                                    ? (isPast ? 'font-bold text-white/50' : 'font-bold text-white')
                                                    : (isSundayDay
                                                        ? (isPast ? 'text-red-400/40' : 'text-red-400/60')
                                                        : (isPast ? 'text-gray-500/50' : (isToday ? 'text-violet-200 font-bold' : 'text-gray-500 group-hover:text-gray-300'))
                                                    )
                                                    }`}>{date.getDate()}</span>
                                                {hasHoliday && <div className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${isPast ? 'bg-[#ef4444]/50' : 'bg-[#ef4444]'}`} />}

                                                {/* Tooltip */}
                                                {(hasHoliday || isOpenWorkingDay) && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] hidden group-hover:block z-50 pointer-events-none">
                                                        <div className="bg-[#0e0a18] border border-white/10 text-white text-[10px] rounded px-2 py-1.5 shadow-xl whitespace-pre-line text-center">
                                                            {hasHoliday ? dayHolidays.map((h, idx) => (
                                                                <div key={idx} className={idx > 0 ? "mt-1 pt-1 border-t border-white/10" : ""}>
                                                                    {h.name}
                                                                </div>
                                                            )) : (
                                                                "Open (Normal business day)"
                                                            )}
                                                        </div>
                                                        {/* Arrow */}
                                                        <div className="w-2 h-2 bg-[#0e0a18] border-r border-b border-white/10 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"></div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Holiday Details Panel */}
                                {selectedDateDetails && (
                                    <div className="mt-4 p-4 rounded-[4px] border border-[#ef4444]/30 bg-[#ef4444]/5 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex items-baseline justify-between mb-2">
                                            <h4 className="text-lg font-bold text-white">
                                                {format(selectedDateDetails.date, "EEEE, d MMM yyyy")}
                                            </h4>
                                            <span className="text-xs text-[#ef4444] font-medium uppercase tracking-wider">
                                                {selectedDateDetails.holidays.length} Event{selectedDateDetails.holidays.length > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            {selectedDateDetails.holidays.map((h, idx) => (
                                                <div key={idx} className="flex flex-col gap-1 p-2 rounded bg-black/20">
                                                    <div className="flex justify-between items-start">
                                                        <span className="font-medium text-gray-200">{h.name}</span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getTypeColor(h.type)}`}>{h.type}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions - Strict Sibling with 15px gap */}
                <div className="flex items-center justify-end gap-2 mt-[15px] print:hidden">
                    <button
                        onClick={handleShare}
                        disabled={isActionDisabled}
                        className={actionButtonClass}
                        title="Share"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleAddToCalendar}
                        disabled={isActionDisabled}
                        className={actionButtonClass}
                        title="Add to Calendar (.ics)"
                    >
                        <CalendarPlus className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDownloadCSV}
                        disabled={isActionDisabled}
                        className={actionButtonClass}
                        title="Download CSV"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handlePrint}
                        disabled={isActionDisabled}
                        className={actionButtonClass}
                        title="Print Calendar"
                    >
                        <Printer className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <Toast
                message={toast.message}
                isVisible={toast.show}
                onClose={closeToast}
            />
        </section >
    );
}

// Helpers
function getMonthName(m: number) {
    const d = new Date();
    d.setMonth(m);
    return format(d, "MMM");
}
