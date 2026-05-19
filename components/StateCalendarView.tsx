"use client";

import { useState, useEffect, useMemo } from "react";
import { format, eachMonthOfInterval, isSaturday, isSunday, isSameDay, addDays, getWeekOfMonth } from "date-fns";
import Link from "next/link";
import { useHolidayData } from "@/lib/HolidayContext";
import { normalizeCsvRow, HolidayItem, isPastDate, getCombinedHolidays, CsvHolidayRow, computeBankingHolidays } from "@/src/lib/holidays";
import { INDIAN_STATES, stateToSlug } from "@/lib/constants";
import { CustomSelect } from "@/components/CustomSelect";
import { FaqSection } from "@/components/FaqSection";
import { SeoGuideSection } from "@/components/SeoGuideSection";
import { UtilityGuideSection } from "@/components/UtilityGuideSection";
import { BrandHeadline } from "@/components/BrandHeadline";
import { Toast } from "@/components/Toast";
import { Share2, Printer, MapPin, Calendar, TrendingUp, Info, Smartphone } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PrintHeader } from "./PrintHeader";
import { ADS_ENABLED } from "@/lib/adsConfig";
import { CompareStates } from "@/components/InternalLinking/CompareStates";
import { LearnGuides } from "@/components/InternalLinking/LearnGuides";
import { useSaturdayToggle } from "@/lib/hooks";

interface StateCalendarViewProps {
    slug: string;
    initialStateName: string;
    initialHolidays?: CsvHolidayRow[];
}

export function StateCalendarView({ slug, initialStateName, initialHolidays }: StateCalendarViewProps) {
    const { getHolidays: contextGetHolidays, holidays: contextHolidays, selectedState: contextSelectedState, loading: contextLoading } = useHolidayData();
    const [stateName, setStateName] = useState(initialStateName);
    const [selectedMonth, setSelectedMonth] = useState<number | "all">("all");
    const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });
    const { includeSaturdayClosures, setIncludeSaturdayClosures } = useSaturdayToggle();

    // Use initialHolidays if available (Server Side), otherwise generic Context (Client Side)
    const holidaysSource = initialHolidays && initialHolidays.length > 0 ? initialHolidays : contextHolidays;

    // Check if we are waiting for client-side data
    const isLoading = (!initialHolidays || initialHolidays.length === 0) && contextLoading;

    const formatType = (type: string) => {
        if (!type) return "N/A";
        if (type === "weekend") return "Weekend";
        return type;
    };



    const showSuccessToast = (message: string) => {
        setToast({ show: true, message });
    };

    const closeToast = () => {
        setToast((prev) => ({ ...prev, show: false }));
    };

    // Logic: If "All States/UTs", show global list. Else show specific state list.
    let displayedHolidays: HolidayItem[] = [];



    if (stateName === "All States/UTs") {
        // Convert raw CSV rows to rich HolidayItems
        const csvItems = holidaysSource
            .map(row => normalizeCsvRow(row))
            .filter((item): item is HolidayItem => item !== null);

        // Generate Generic Saturdays (applicable to all)
        const saturdayItems = computeBankingHolidays(2026, "All States");

        // Merge
        displayedHolidays = [...csvItems, ...saturdayItems];

        // Month filter
        if (selectedMonth !== "all") {
            displayedHolidays = displayedHolidays.filter(h => h.date.getMonth() === selectedMonth);
        }
    } else {
        // Use local helper if source is our passed prop, or context helper
        // Actually getCombinedHolidays works with raw rows, so we can always use it directly if we have rows
        displayedHolidays = getCombinedHolidays(holidaysSource, stateName, 2026);

        if (selectedMonth !== "all") {
            displayedHolidays = displayedHolidays.filter(h => h.date.getMonth() === selectedMonth);
        }
    }

    // Sort chronologically
    displayedHolidays.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Add isSaturdayClosure flag to each holiday
    const holidaysWithSatFlag = useMemo(() => {
        return displayedHolidays.map(h => {
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
    }, [displayedHolidays]);

    // Filter based on Saturday toggle AND include Sundays if toggle is ON
    const visibleHolidays = useMemo(() => {
        if (includeSaturdayClosures) return holidaysWithSatFlag;
        // If toggle is OFF: Exclude both 2nd/4th Sats AND all Sundays
        return holidaysWithSatFlag.filter(h => !h.isSaturdayClosure && !isSunday(h.date));
    }, [holidaysWithSatFlag, includeSaturdayClosures]);

    // --- Insights Computation (Unique Content) ---
    const insights = useMemo(() => {
        // Use full year list for insights, independent of month filter
        const fullYearHolidays = stateName === "All States/UTs"
            ? holidaysSource.map(row => normalizeCsvRow(row)).filter((item): item is HolidayItem => item !== null)
            : getCombinedHolidays(holidaysSource, stateName, 2026);

        // 1. Total Count (Official vs Saturday)
        const officialHolidays = fullYearHolidays.filter(h => !h.name.toLowerCase().includes("saturday") && h.type !== "Banking");
        const saturdayCount = fullYearHolidays.length - officialHolidays.length; // Approximate, or count specific types

        // 2. Next Upcoming Holiday
        const today = new Date();
        const nextHoliday = fullYearHolidays.find(h => h.date >= today);

        // 3. Top 5 Holiday Months
        const monthCounts = new Map<string, number>();
        fullYearHolidays.forEach(h => {
            const m = format(h.date, "MMMM");
            monthCounts.set(m, (monthCounts.get(m) || 0) + 1);
        });
        const topMonths = Array.from(monthCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([month, count]) => `${month} (${count})`);

        // 4. Major Named Holidays (Top 3-5 unique names)
        const majorNames = Array.from(new Set(officialHolidays.map(h => h.name)))
            .slice(0, 5);

        return {
            totalOfficial: officialHolidays.length,
            totalSaturdays: saturdayCount,
            nextHoliday: nextHoliday ? `${nextHoliday.name} on ${format(nextHoliday.date, "dd MMM")}` : "None in 2026",
            topMonths,
            majorNames
        };
    }, [holidaysSource, stateName]);


    // Dropdown options for Inner Page
    const innerStateOptions = [
        { value: "All States/UTs", label: "All States/UTs" },
        ...INDIAN_STATES.map(s => ({ value: s, label: s }))
    ];

    const months = eachMonthOfInterval({
        start: new Date(2026, 0, 1),
        end: new Date(2026, 11, 31)
    });

    // --- Interactive Handlers ---

    const handleShare = async () => {
        if (visibleHolidays.length === 0) return;
        const shareData = {
            title: `Bank Holiday Calendar 2026 - ${stateName}`,
            text: `Check out the official Bank Holiday Calendar 2026 for ${stateName}`,
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

    const handlePrint = () => {
        window.print();
    };

    const isActionDisabled = visibleHolidays.length === 0;
    const actionButtonClass = `p-2 border border-[#2563eb]/20 rounded-xl text-[#2563eb] hover:border-[#2563eb] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#2563eb]/20 print:hidden`;

    return (
        <div className="flex flex-col gap-8 pt-[92px] pb-8 w-full">

            {/* Breadcrumb Navigation - Hidden on Print */}
            <div className="print:hidden">
                <Breadcrumb
                    stateName={stateName}
                    stateSlug={stateName === "All States/UTs" ? "all" : stateToSlug(stateName)}
                />
            </div>

            {/* A. High Impact Header - Hidden on Print */}
            <header className="w-full max-w-[1100px] mx-auto text-center space-y-1.5 px-4 -mt-[51px] md:-mt-7 print:hidden">
                <h1 className="font-black text-white uppercase tracking-tighter leading-none">
                    <span className="block text-[32px] md:text-[56px] md:whitespace-nowrap">
                        <span className="block md:inline">ANNUAL BANKING</span>
                        <span className="block md:inline"> CALENDAR 2026</span>
                    </span>
                    <span className="block mt-[3px] md:-mt-1 text-[#2563eb] text-[24px] md:text-[42px]">{stateName === "All States/UTs" ? "ALL INDIA" : stateName}</span>
                </h1>

            </header>

            {/* Insights Block - New Unique Content */}
            {stateName !== "All States/UTs" && (
                <section className="w-full max-w-[1050px] mx-auto px-4 print:hidden">
                    <div className="bg-[#1c1c21] border border-[#2563eb]/30 rounded-xl p-5 shadow-lg">
                        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                            <TrendingUp className="w-5 h-5 text-[#2563eb]" />
                            <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                                State Holiday Insights (2026)
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Official Holidays</div>
                                <div className="text-2xl font-bold text-white">{insights.totalOfficial} <span className="text-sm font-normal text-gray-500">Days</span></div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Upcoming Holiday</div>
                                <div className="text-lg font-bold text-[#2563eb]">{insights.nextHoliday}</div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Busiest Month</div>
                                <div className="text-sm font-medium text-white">{insights.topMonths[0] || "N/A"}</div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Saturday Closures</div>
                                <div className="text-xl font-bold text-white">{insights.totalSaturdays} <span className="text-sm font-normal text-gray-500">(2nd/4th)</span></div>
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500 flex flex-wrap gap-2">
                            <span className="font-bold text-gray-400">Major Events:</span>
                            {insights.majorNames.map((n, i) => (
                                <span key={i} className="bg-white/5 px-2 py-0.5 rounded-full">{n}</span>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* AdSense Slot - Hidden on Print */}
            {ADS_ENABLED && (
                <div className="w-[300px] lg:w-[970px] min-h-[250px] mx-auto -mt-[11px] mb-1 bg-[#0f0f12] flex items-center justify-center overflow-hidden print:hidden">
                    {/* Empty container ready for AdSense injection */}
                </div>
            )}

            {/* B. Control Bar (Filters & Actions) & C. Holiday List Wrapper */}
            <div className="flex flex-col gap-[5px] w-full max-w-[1050px] mx-auto px-4">
                {/* B. Control Bar (Filters & Actions) - Hidden on Print */}
                <div className="w-full print:hidden">
                    <div id="inner-page-filters" className="w-full relative z-[100] bg-[#131313] backdrop-blur-sm border border-[#2563eb]/65 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center md:items-end justify-between shadow-2xl scroll-mt-[100px]">
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            {/* Region Selector */}
                            <div className="w-full md:w-auto">
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest pl-1">STATE/UT</label>
                                <CustomSelect
                                    value={stateName}
                                    onChange={(val) => {
                                        if (val === "All States/UTs") {
                                            window.location.href = "/all-bank-holiday-2026";
                                        } else {
                                            const slug = stateToSlug(val);
                                            window.location.href = `/${slug}-bank-holiday-2026`;
                                        }
                                    }}
                                    options={innerStateOptions}
                                    className="h-[38px] w-full md:min-w-[300px] px-3 py-2 hover:border-[#2563eb] transition-colors"
                                />
                            </div>

                            {/* Month Filter Mobile Row */}
                            <div className="w-full md:w-auto flex items-end justify-between gap-3">
                                {/* Month Filter */}
                                <div className="flex-1 md:w-auto">
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest pl-1">Select Month</label>
                                    <CustomSelect
                                        value={selectedMonth}
                                        onChange={(val) => {
                                            const parsed = val === "all" ? "all" : parseInt(val);
                                            setSelectedMonth(parsed);
                                        }}
                                        options={[
                                            { value: "all", label: "All Months" },
                                            ...months.map((m, idx) => ({ value: idx, label: format(m, "MMMM") }))
                                        ]}
                                        className="h-[38px] w-full md:min-w-[200px] px-3 py-2 hover:border-[#2563eb] transition-colors"
                                    />
                                </div>
                                
                                {/* Saturday Toggle - Mobile Only */}
                                <label className="flex md:hidden items-center gap-2 cursor-pointer group mb-1.5 focus:outline-none">
                                    <span className="text-xs text-white/70 group-hover:text-white transition-colors select-none leading-tight text-right">
                                        2nd/4th Sat <br /> and Sundays
                                    </span>
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={includeSaturdayClosures}
                                            onChange={(e) => setIncludeSaturdayClosures(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-8 h-4 bg-white/10 rounded-full peer-checked:bg-[#2563eb]/60 transition-colors"></div>
                                        <div className="absolute left-0.5 w-3 h-3 bg-white/60 rounded-full peer-checked:translate-x-4 transition-transform peer-checked:bg-white"></div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center w-full md:w-auto justify-end gap-3" style={{ marginTop: '-3px', marginLeft: '2px' }}>
                            {/* Saturday Toggle - Desktop Only */}
                            <label className="hidden md:flex items-center gap-2 cursor-pointer group">
                                <span className="text-xs text-white/70 group-hover:text-white transition-colors select-none leading-tight">
                                    Include 2nd/4th Sat and Sundays
                                </span>
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        id="saturdayToggleDesktop"
                                        checked={includeSaturdayClosures}
                                        onChange={(e) => setIncludeSaturdayClosures(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-8 h-4 bg-white/10 rounded-full peer-checked:bg-[#2563eb]/60 transition-colors"></div>
                                    <div className="absolute left-0.5 w-3 h-3 bg-white/60 rounded-full peer-checked:translate-x-4 transition-transform peer-checked:bg-white"></div>
                                </div>
                            </label>

                            <button
                                onClick={handleShare}
                                disabled={isActionDisabled}
                                className={actionButtonClass}
                                title="Share"
                            >
                                <Share2 className="w-4 h-4" />
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
                </div>

                {/* C. Holiday List (Data Table) - VISIBLE on Print */}
                <section className="w-full max-w-[1050px] mx-auto px-4 print:block print:visible print:w-full print:p-0 print-container">
                    <PrintHeader stateName={stateName} />

                    <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#131313] print:border-black print:rounded-none">
                        {/* Desktop List View - Hidden on Mobile */}
                        <table className="hidden md:table w-full text-left border-collapse print:w-full print:table">
                            <thead className="bg-white/5 text-xs uppercase text-gray-400 font-bold tracking-wider print:bg-gray-100 print:text-black print:border-b print:border-black">
                                <tr>
                                    <th className="p-4 border-b border-white/10 print:border-black print:p-2">Date</th>
                                    <th className="p-4 border-b border-white/10 print:border-black print:p-2">Day</th>
                                    <th className="p-4 border-b border-white/10 w-1/3 print:border-black print:p-2">Holiday Name</th>
                                    {stateName === "All States/UTs" && (
                                        <th className="p-4 border-b border-white/10 print:border-black print:p-2">State</th>
                                    )}
                                    <th className="p-4 border-b border-white/10 print:border-black print:p-2">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm print:divide-black">
                                {visibleHolidays.length > 0 ? (
                                    visibleHolidays.map((h, idx) => {
                                        const isPast = isPastDate(h.dateISO);
                                        return (
                                            <tr key={idx} className={`hover:bg-white/5 transition-colors print:break-inside-avoid`}>
                                                <td className={`p-4 font-medium whitespace-nowrap print:text-black print:p-2 ${h.date.getDay() === 0 ? 'text-red-400' : 'text-white'}`}>
                                                    {format(h.date, "dd MMM yyyy")}
                                                </td>
                                                <td className={`p-4 print:text-black print:p-2 ${h.date.getDay() === 0 ? 'text-red-400/70' : 'text-gray-400'}`}>
                                                    {format(h.date, "EEEE")}
                                                </td>
                                                <td className={`p-4 font-medium print:text-black print:p-2 text-white`}>
                                                    {h.name}
                                                </td>
                                                {stateName === "All States/UTs" && (
                                                    <td className={`p-4 text-xs print:text-black print:p-2 text-gray-400`}>
                                                        {h.state}
                                                    </td>
                                                )}
                                                <td className="p-4 print:p-2">
                                                    <span className="text-sm text-red-400 print:text-black font-medium">
                                                        Closed ({formatType(h.type)})
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={stateName === "All States/UTs" ? 5 : 4} className="p-8 text-center text-gray-500 print:text-black">
                                            {isLoading ? (
                                                <div className="flex flex-col items-center justify-center gap-3 py-4">
                                                    <div className="w-8 h-8 border-4 border-[#2563eb]/30 border-t-[#2563eb] rounded-full animate-spin"></div>
                                                    <p className="text-gray-400 text-sm font-medium animate-pulse">Loading holidays...</p>
                                                </div>
                                            ) : (
                                                "No holidays found for this selection."
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Mobile List View - Hidden on Desktop */}
                        <div className="md:hidden flex flex-col divide-y divide-white/5 print:hidden">
                            {visibleHolidays.length > 0 ? (
                                visibleHolidays.map((h, idx) => (
                                    <div key={idx} className="flex flex-col p-4 hover:bg-white/5 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="text-sm font-medium text-white">
                                                {format(h.date, "dd MMM")} - {format(h.date, "EEEE")}
                                            </div>
                                            {stateName === "All States/UTs" && (
                                                <div className="text-xs text-gray-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                                                    {h.state}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-base font-bold text-white mb-1">{h.name}</div>
                                        <div className="text-xs text-red-400 font-medium">Closed ({formatType(h.type)})</div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    {isLoading ? (
                                        <div className="flex flex-col items-center justify-center gap-3 py-4">
                                            <div className="w-8 h-8 border-4 border-[#2563eb]/30 border-t-[#2563eb] rounded-full animate-spin"></div>
                                            <p className="text-gray-400 text-sm font-medium animate-pulse">Loading holidays...</p>
                                        </div>
                                    ) : (
                                        "No holidays found for this selection."
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions - Hidden on Print */}
                    <div className="flex items-center justify-end gap-2 mt-4 print:hidden">
                        <button
                            onClick={handleShare}
                            disabled={isActionDisabled}
                            className={actionButtonClass}
                            title="Share"
                        >
                            <Share2 className="w-4 h-4" />
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
                </section>

            </div>

            {/* G: State Page Content Upgrades (Month-wise & Insights) - Restructured */}
            <section className="w-full max-w-[1050px] mx-auto px-4 mb-3 print:hidden">

                {/* G2 & G3: Major Cities + Planning Tip - Below Month Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* G2: Major Cities */}
                    <div className="bg-[#0e0a18] border border-[#2563eb]/30 rounded-xl p-5">
                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#2563eb]" />
                            Major Cities
                        </h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Holiday dates are the same across {stateName === "All States/UTs" ? "all major cities" : `all cities in ${stateName}`}, including all district headquarters and major banking hubs.
                        </p>
                        <div className="mt-3 text-xs text-gray-500">
                            * Branch timings may vary slightly by bank, but closure dates are uniform as per the Negotiable Instruments Act.
                        </div>
                    </div>

                    {/* G3: Planning Tip */}
                    <div className="bg-gradient-to-br from-[#2563eb]/10 to-transparent border border-[#2563eb]/20 rounded-xl p-5">
                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#2563eb]" />
                            Planning Tip
                        </h4>
                        <p className="text-sm text-gray-300 leading-relaxed mb-3">
                            Plan your bank visits early. 2nd and 4th Saturdays are always closed.
                        </p>
                        {visibleHolidays.some(h => h.date.getDay() === 1 || h.date.getDay() === 5) && (
                            <p className="text-sm text-[#2563eb] font-medium">
                                Several holidays in 2026 fall on a Friday or Monday, creating long weekends. Check the list for details.
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Browse All States - Crawlable Links for SEO */}
            {stateName === "All States/UTs" ? (
                <section className="w-full max-w-[1050px] mx-auto px-4 print:hidden">
                    <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">Browse State-wise Bank Holidays 2026</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {INDIAN_STATES.map((state) => (
                            <Link
                                key={state}
                                href={`/${stateToSlug(state)}-bank-holiday-2026`}
                                className="text-sm text-[#e5e7eb] hover:text-[#2563eb] transition-colors py-1"
                            >
                                {state}
                            </Link>
                        ))}
                    </div>
                </section>
            ) : (
                <section className="w-full max-w-[1050px] mx-auto px-4 -mt-[13px] print:hidden">
                    <CompareStates currentState={stateName} />
                </section>
            )}

            {/* Linking Module: Learn Guides - Visible to all */}
            <section className="w-full max-w-[1050px] mx-auto px-4 -mt-2 print:hidden">
                <LearnGuides />
            </section>

            {/* D. Footer Content Stack - Hidden on Print */}
            <div className="w-full space-y-12 print:hidden">
                <UtilityGuideSection stateName={stateName} />
                <FaqSection />
                <SeoGuideSection stateName={stateName} />
                <BrandHeadline />
            </div>

            <Toast
                message={toast.message}
                isVisible={toast.show}
                onClose={closeToast}
            />

        </div >
    );
}
