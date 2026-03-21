"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { format, getMonth, parseISO, isSameDay, isSaturday, getWeekOfMonth, isSunday, eachDayOfInterval } from "date-fns";
import Papa from "papaparse";
import { useHolidayData, HolidayItem } from "@/lib/HolidayContext";
import { isPastDate, isTodayDate } from "@/src/lib/holidays";
import { List, Calendar, CalendarDays, ChevronLeft, ChevronRight, Share2, CalendarPlus, Download, Printer } from "lucide-react";
import { Toast } from "@/components/Toast";
import { PrintHeader } from "./PrintHeader";
import { useSaturdayToggle } from "@/lib/hooks";

export function HolidayList() {
    const { selectedState, getHolidays, isBankOpen } = useHolidayData();
    const year = 2026;
    const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

    // --- Ref for mobile date picker ---
    const dateInputRef = useRef<HTMLInputElement>(null);

    // --- View Mode State ---
    const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
    const [calendarMonth, setCalendarMonth] = useState<number>(() => new Date().getMonth());
    const [selectedDateDetails, setSelectedDateDetails] = useState<{ date: Date, holidays: HolidayItem[] } | null>(null);

    // --- Date Check Mode State ---
    const [checkDate, setCheckDate] = useState("");
    const [dateCheckResult, setDateCheckResult] = useState<{ date: Date; status: any } | null>(null);

    const { includeSaturdayClosures, setIncludeSaturdayClosures } = useSaturdayToggle();

    // Persist View Mode
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem("viewMode");
            if (savedMode === "list" || savedMode === "calendar") {
                setViewMode(savedMode);
            }
        }
    }, []);

    const handleViewChange = (mode: "list" | "calendar") => {
        setViewMode(mode);
        if (typeof window !== 'undefined') {
            localStorage.setItem("viewMode", mode);
        }
    };

    // 1. Get Full List
    const allHolidays = useMemo(() => {
        const rawHolidays = getHolidays(selectedState, year);

        // Sundays and 2nd/4th Saturdays are now included in the result of getHolidays()
        // We just enrich them with flags for UI styling
        const combined = rawHolidays.map((h: HolidayItem) => {
            const dateObj = h.date;
            const weekOfMonth = getWeekOfMonth(dateObj);
            const isSat = isSaturday(dateObj);
            const isSun = isSunday(dateObj);
            const nameLower = h.name.toLowerCase();

            const isSaturdayClosure =
                nameLower.includes("second saturday") ||
                nameLower.includes("fourth saturday") ||
                (isSat && h.type === "Banking" && (weekOfMonth === 2 || weekOfMonth === 4));

            return { ...h, isSaturdayClosure, isSundayClosure: isSun };
        });

        return combined as (HolidayItem & { isSaturdayClosure: boolean; isSundayClosure: boolean })[];
    }, [selectedState, getHolidays, year]);

    // 2. Month Filtering (Control Bar)
    const [selectedMonth, setSelectedMonth] = useState<number | "All">("All");

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
        let list = includeSaturdayClosures ? allHolidays : allHolidays.filter(h => !h.isSaturdayClosure && !h.isSundayClosure);
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
        return filteredHolidays.filter(h => getMonth(h.date) === calendarMonth);
    }, [filteredHolidays, calendarMonth]);

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
            Type: formatType(h.type),
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
            icsContent += `SUMMARY:${h.name} (${formatType(h.type)})\n`;
            icsContent += `DESCRIPTION:Bank Holiday in ${h.state}. Type: ${formatType(h.type)}\n`;
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
    const actionButtonClass = `p-2 border border-[#7d3cff]/20 rounded-xl text-[#7d3cff] hover:border-[#7d3cff] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#7d3cff]/20 print:hidden`;


    // Helper for Type Badge/Color
    const getTypeColor = (type: string) => {
        switch (type) {
            case "National": return "text-orange-400";
            case "Banking": return "text-blue-400";
            case "State": return "text-[#7d3cff]";
            case "weekend": return "text-red-400";
            case "holiday": return "text-orange-400";
            default: return "text-gray-400";
        }
    };

    const formatType = (type: string) => {
        if (!type) return "N/A";
        if (type === "weekend") return "Weekend";
        return type;
    };

    // Helper for Status Badge
    const getStatusBadge = (isOpen: boolean, isPast: boolean = false) => {
        if (isOpen) {
            const style = isPast ? "text-green-400/50" : "text-green-400";
            return <span className={`text-sm print:text-black ${style}`}>Open</span>;
        }
        const style = isPast ? "text-red-400/50" : "text-red-400";
        return <span className={`text-sm print:text-black ${style}`}>Closed</span>;
    };

    // Helper for Days Away Indicator
    const getDaysAwayText = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = new Date(date);
        target.setHours(0, 0, 0, 0);

        const diffTime = target.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return null;
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "1 day";
        return `${diffDays} days`;
    };

    return (
        <section id="state-holidays-complete-list" className="w-full pt-0 -mt-[9px] pb-0 mb-8 text-white relative z-20">
            <div className="w-full max-w-none px-4 sm:max-w-[1050px] sm:mx-auto">
                {/* LIST BOX WRAPPER */}
                <div className="w-full flex flex-col border-0 md:border md:border-[#7d3cff]/45 md:rounded-xl md:bg-[#121212]/80 md:shadow-2xl">
                    <div className="w-full mb-0 sticky top-20 z-30 p-2 sm:p-2 border-b-0 sm:border-b sm:border-white/10 bg-transparent sm:bg-[#0e0a18]/95 sm:backdrop-blur-md sm:rounded-t-xl print:hidden">

                        {/* Unified Header: Dropdown + Date Check + View Toggle */}
                        <div className="flex items-center justify-between gap-2 sm:gap-4 flex-nowrap">

                            {/* Left Group: Month & Date Selector */}
                            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
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
                                        className="h-9 w-auto min-w-[110px] rounded-xl border-0 bg-[#7d3cff] px-2 sm:px-3 text-sm text-white font-medium outline-none appearance-none hover:bg-[#8b52ff] focus:ring-[0.5px] focus:ring-white/30 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        title={checkDate ? "Clear date to browse months" : "Select Month"}
                                    >
                                        <option value="All" className="bg-[#0e0a18] text-white">All months</option>
                                        {months.map((m, idx) => (
                                            <option key={m} value={idx} className="bg-[#0e0a18] text-white">{m} {year}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-white">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>


                                {/* Mobile Group: Date Picker + Toggle */}
                                <div className="flex md:hidden items-center gap-2">
                                    <span className="text-[10px] text-white/50 whitespace-nowrap">or</span>

                                    {/* Mobile: Icon-only date picker button */}
                                    <button
                                        onClick={() => {
                                            if (dateInputRef.current) {
                                                if ('showPicker' in dateInputRef.current) {
                                                    try {
                                                        (dateInputRef.current as any).showPicker();
                                                    } catch (e) {
                                                        (dateInputRef.current as any).click();
                                                    }
                                                } else {
                                                    (dateInputRef.current as any).click();
                                                }
                                            }
                                        }}
                                        className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-[#7d3cff] border-white/20 hover:bg-[#8b52ff] text-white transition-all active:scale-95 shadow-lg"
                                        title="Select a custom date"
                                        aria-label="Select a custom date"
                                    >
                                        <CalendarDays className="w-4 h-4" />
                                    </button>

                                    {/* Mobile Saturday Toggle - Inline */}
                                    <label className="flex items-center gap-2 cursor-pointer group focus:outline-none">
                                        <span className="text-[10px] text-white/70 group-hover:text-white transition-colors select-none leading-tight text-right">
                                            2nd/4th Sat <br /> & Sundays
                                        </span>
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={includeSaturdayClosures}
                                                onChange={(e) => setIncludeSaturdayClosures(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-[42px] h-[21px] bg-white/10 rounded-full peer-checked:bg-[#7d3cff]/60 transition-colors"></div>
                                            <div className="absolute left-[3px] w-[15px] h-[15px] bg-white/60 rounded-full peer-checked:translate-x-[21px] transition-transform peer-checked:bg-white bottom-[3px]"></div>
                                        </div>
                                    </label>
                                </div>

                                {/* Desktop: Date input and Clear button */}
                                <div className="hidden md:flex items-center gap-3">
                                    <span className="text-xs text-white/50 whitespace-nowrap">or</span>
                                    <input
                                        ref={dateInputRef}
                                        type="date"
                                        value={checkDate}
                                        onChange={(e) => setCheckDate(e.target.value)}
                                        className="h-9 w-auto min-w-[128px] rounded-xl border px-2 sm:px-3 text-sm outline-none transition-colors uppercase appearance-none
                                            text-white/90
                                            bg-black/20
                                            border-white/10
                                            caret-current
                                            placeholder:text-[rgba(255,255,255,0.45)] placeholder:opacity-100
                                            focus:border-[rgba(125,60,255,0.6)] focus:shadow-[0_0_0_2px_rgba(125,60,255,0.25)]
                                            hover:border-[#7d3cff]/30"
                                        placeholder="DD-MM-YYYY"
                                    />

                                    {checkDate && (
                                        <button
                                            onClick={() => setCheckDate("")}
                                            className="h-9 px-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-white/70 transition-colors"
                                            title="Clear date and return to list"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Right Group: View Toggle & Filters */}
                            <div className="flex items-center gap-3 sm:gap-4 shrink-0 ml-auto sm:ml-auto">
                                {/* Desktop Saturday Toggle - placed right before view toggles */}
                                <div className="hidden lg:flex items-center">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <span className="text-xs text-white/70 group-hover:text-white transition-colors select-none leading-tight">
                                            Include 2nd/4th Sat and Sundays
                                        </span>
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={includeSaturdayClosures}
                                                onChange={(e) => setIncludeSaturdayClosures(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-[48px] h-[24px] bg-white/10 rounded-full peer peer-checked:bg-[#7d3cff]/60 transition-colors"></div>
                                            <div className="absolute left-[3px] w-[18px] h-[18px] bg-white/60 rounded-full peer-checked:translate-x-[24px] transition-transform peer-checked:bg-white bottom-[3px]"></div>
                                        </div>
                                    </label>
                                </div>
                                <div className="h-5 w-px bg-white/10 hidden lg:block mx-1"></div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <button
                                        onClick={() => handleViewChange("list")}
                                        className={`p-1.5 rounded-xl transition-all ${viewMode === "list" ? "bg-[#7d3cff]/20 text-[#7d3cff] ring-1 ring-[#7d3cff]/50" : "text-gray-400 hover:text-white"}`}
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
                                        className={`p-1.5 rounded-xl transition-all ${viewMode === "calendar" ? "bg-[#7d3cff]/20 text-[#7d3cff] ring-1 ring-[#7d3cff]/50" : "text-gray-400 hover:text-white"}`}
                                        aria-label="Calendar View"
                                        aria-pressed={viewMode === "calendar"}
                                    >
                                        <Calendar className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
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
                                    <div className="hidden sm:block overflow-hidden rounded-b-xl print:block print:rounded-none">
                                        <table className="w-full table-fixed text-left border-collapse print:w-full">
                                            <thead>
                                                <tr className="bg-white/5 border-b border-white/10 print:bg-gray-100">
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[120px] print:text-black print:p-2 print:border-b print:border-black whitespace-nowrap">Date</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[80px] print:text-black print:p-2 print:border-b print:border-black">Day</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:text-black print:p-2 print:border-b print:border-black">Holiday Name</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[110px] print:text-black print:p-2 print:border-b print:border-black">Status</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[110px] print:text-black print:p-2 print:border-b print:border-black">Type</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 print:divide-black">
                                                <tr className="hover:bg-white/5 transition-colors print:break-inside-avoid">
                                                    <td className="p-4 text-sm font-medium text-white print:text-black print:p-2 whitespace-nowrap">
                                                        {format(dateCheckResult.date, "dd MMM yyyy")}
                                                    </td>
                                                    <td className="p-4 text-sm text-white print:text-black print:p-2 whitespace-nowrap">
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
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border print:border-black print:text-black print:bg-transparent print:font-bold text-white`}>
                                                                {formatType(dateCheckResult.status.type)}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Result Card (Mobile) */}
                                    <div className="sm:hidden p-4">
                                        <div className="bg-[#0e0a18]/80 border border-white/10 rounded-xl p-4 shadow-lg active:scale-[0.99] transition-transform">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold uppercase tracking-widest text-white">{format(dateCheckResult.date, "EEE")}</span>
                                                    <span className="text-lg font-bold text-white">{format(dateCheckResult.date, "dd MMM yyyy")}</span>
                                                </div>
                                                {getStatusBadge(dateCheckResult.status.isOpen)}
                                            </div>
                                            <div className="h-px w-full bg-white/5 my-2"></div>
                                            <h3 className="text-base font-semibold text-white leading-tight mb-2">
                                                {dateCheckResult.status.isOpen ? "Normal Working Day" : dateCheckResult.status.reason}
                                            </h3>
                                            {!dateCheckResult.status.isOpen && (
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide text-white`}>
                                                    {formatType(dateCheckResult.status.type)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // MONTH LIST VIEW
                                filteredHolidays.length === 0 ? (
                                    <div className="w-full py-12 text-center border border-white/10 rounded-xl bg-white/5">
                                        <p className="text-gray-400">No holidays found for this selection.</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Desktop Table View */}
                                        <div className="hidden sm:block overflow-hidden rounded-b-xl print:block print:rounded-none">
                                            <table className="w-full table-fixed text-left border-collapse print:w-full">
                                                <thead>
                                                    <tr className="bg-white/5 border-b border-white/10 print:bg-gray-100">
                                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[80px] print:text-black print:p-2 print:border-b print:border-black whitespace-nowrap">Date</th>
                                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[80px] print:text-black print:p-2 print:border-b print:border-black">Day</th>
                                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:text-black print:p-2 print:border-b print:border-black">Holiday Name</th>
                                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[140px] print:text-black print:p-2 print:border-b print:border-black whitespace-nowrap">Days Remaining</th>
                                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[110px] print:text-black print:p-2 print:border-b print:border-black">Status</th>
                                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[110px] print:text-black print:p-2 print:border-b print:border-black">Type</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5 print:divide-black">
                                                    {filteredHolidays.map((h, idx) => {
                                                        const isPast = isPastDate(h.dateISO);
                                                        const isActualHoliday = !h.isSaturdayClosure && !h.isSundayClosure;
                                                        return (
                                                            <tr key={`${h.dateISO}-${idx}`} className={`hover:bg-white/5 transition-colors print:break-inside-avoid`}>
                                                                <td className={`p-4 text-sm font-medium print:text-black print:p-2 whitespace-nowrap text-white`}>
                                                                    {format(h.date, "dd MMM")}
                                                                </td>
                                                                <td className={`p-4 text-sm print:text-black print:p-2 whitespace-nowrap text-white`}>
                                                                    {h.dayOfWeek}
                                                                </td>
                                                                <td className={`p-4 text-sm font-semibold print:text-black print:p-2 text-white`}>
                                                                    {h.name}
                                                                </td>
                                                                <td className="p-4 print:p-2 whitespace-nowrap">
                                                                    {!isPast ? (
                                                                        <span className="text-sm text-red-400">
                                                                            {getDaysAwayText(h.date)}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-sm text-white/40">-</span>
                                                                    )}
                                                                </td>
                                                                <td className="p-4 print:p-2">
                                                                    {getStatusBadge(false, isPast)}
                                                                </td>
                                                                <td className="p-4 print:p-2">
                                                                    <span className={`text-sm print:text-black text-white`}>
                                                                        {formatType(h.type)}
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
                                                const isActualHoliday = !h.isSaturdayClosure && !h.isSundayClosure;
                                                return (
                                                    <div key={`${h.dateISO}-${idx}-mob`} className="flex flex-col p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <div className="text-sm font-medium text-white">
                                                                {h.dayOfWeek}: {format(h.date, "dd MMM")} - {h.name}
                                                            </div>
                                                            {getStatusBadge(false, isPast)}
                                                        </div>
                                                        <div className="text-xs text-gray-400 font-medium">{formatType(h.type)}</div>
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
                                                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all border group
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
                                    <div className="mt-4 p-4 rounded-xl border border-[#ef4444]/30 bg-[#ef4444]/5 animate-in fade-in slide-in-from-top-2">
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
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getTypeColor(h.type)}`}>{formatType(h.type)}</span>
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
