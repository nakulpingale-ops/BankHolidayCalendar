"use client";

import { useState, use, useEffect } from "react";
import { format, parse, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns";
import Papa from "papaparse";
import { useHolidayData } from "@/lib/HolidayContext";
import { INDIAN_STATES, stateToSlug, slugToState } from "@/lib/constants";
import { CustomSelect } from "@/components/CustomSelect";
import { FaqSection } from "@/components/FaqSection";
import { SeoGuideSection } from "@/components/SeoGuideSection";
import { UtilityGuideSection } from "@/components/UtilityGuideSection";
import { BrandHeadline } from "@/components/BrandHeadline";
import { Toast } from "@/components/Toast";
import { Share2, CalendarPlus, Download, Printer } from "lucide-react";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";

// This tells Cloudflare which specific pages to create
export async function generateStaticParams() {
    // Add the names of your main holiday pages here
    // For example: bankholidaycalendar.com/india or /pune
    return [
        { slug: 'india' },
        { slug: 'pune' },
        { slug: '2026' }
    ];
}

// This ensures only the pages listed above are built
export const dynamicParams = false;

export default function StateCalendarPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const { getHolidays, holidays, selectedState } = useHolidayData();
    const [stateName, setStateName] = useState("Maharashtra");
    const [selectedMonth, setSelectedMonth] = useState<number | "all">("all");
    const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

    // Sync local state when global selectedState changes
    useEffect(() => {
        setStateName(selectedState);
    }, [selectedState]);

    const showSuccessToast = (message: string) => {
        setToast({ show: true, message });
    };

    const closeToast = () => {
        setToast((prev) => ({ ...prev, show: false }));
    };

    useEffect(() => {
        const slugParam = resolvedParams.slug;
        // Expected format: [state-slug]-bank-holiday-2026
        // Example: maharashtra-bank-holiday-2026

        // Validation check
        if (!slugParam.endsWith("-bank-holiday-2026")) {
            notFound();
            return;
        }

        const stateSlug = slugParam.replace("-bank-holiday-2026", "");

        if (stateSlug === "all") {
            setStateName("All States/UTs");
        } else {
            // Use standardized slugToState function for consistent matching
            const potentialName = slugToState(stateSlug);

            if (potentialName) {
                setStateName(potentialName);
            } else {
                notFound();
            }
        }
    }, [resolvedParams]);



    // Logic: If "All States/UTs", show global list. Else show specific state list.
    let displayedHolidays = [];

    if (stateName === "All States/UTs") {
        displayedHolidays = holidays.filter(h => {
            // Month filter
            if (selectedMonth !== "all") {
                const d = parse(h.Date, "yyyy/MM/dd", new Date());
                return d.getMonth() === selectedMonth;
            }
            return true;
        });
    } else {
        displayedHolidays = getHolidays(stateName, selectedMonth === "all" ? undefined : selectedMonth);
    }

    // Sort chronologically
    displayedHolidays.sort((a, b) => {
        const dateA = new Date(a.Date);
        const dateB = new Date(b.Date);
        return dateA.getTime() - dateB.getTime();
    });

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // ... (unused native handler, using CustomSelect below)
    };

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
        if (displayedHolidays.length === 0) return;
        const shareData = {
            title: `Bank Holiday Calendar 2026 - ${stateName}`,
            text: `Check out the official Bank Holiday Calendar 2026 for ${stateName}`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                // Note: navigator.share might not resolve if user cancels, 
                // but usually considered "successful" invocation if no error.
                // Some browsers return promise on successful share.
                // We'll show toast for consistency if it doesn't throw.
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
        if (displayedHolidays.length === 0) return;

        const csv = Papa.unparse(displayedHolidays);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        // Format: [State]-Bank-Holidays-2026-HolBank.csv
        const filename = `${stateName.replace(/ /g, "-")}-Bank-Holidays-2026-HolBank.csv`;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showSuccessToast("Success! Action completed.");
    };

    const handleAddToCalendar = () => {
        if (displayedHolidays.length === 0) return;

        let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//BankHolidayCalendar//EN\n";

        displayedHolidays.forEach((h) => {
            const dateStr = h.Date.replace(/[\/-]/g, ""); // YYYYMMDD
            const uid = `${dateStr}-${h.Holiday.replace(/\s+/g, "")}@bankholidaycalendar.com`;

            icsContent += "BEGIN:VEVENT\n";
            icsContent += `UID:${uid}\n`;
            icsContent += `DTSTART;VALUE=DATE:${dateStr}\n`;
            icsContent += `SUMMARY:${h.Holiday} (${h.Status})\n`;
            icsContent += `DESCRIPTION:Bank Holiday in ${h.State}. Status: ${h.Status}\n`;
            icsContent += "END:VEVENT\n";
        });

        icsContent += "END:VCALENDAR";

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `bank-holidays-${stateName.toLowerCase().replace(/ /g, "-")}-2026.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showSuccessToast("Success! Action completed.");
    };

    const handlePrint = () => {
        window.print();
    };

    const isActionDisabled = displayedHolidays.length === 0;
    const actionButtonClass = `p-2 border border-[#7d3cff]/20 rounded-[4px] text-[#7d3cff] hover:border-[#7d3cff] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#7d3cff]/20`;

    return (
        <div className="flex flex-col gap-12 pt-[92px] pb-8 w-full">

            {/* Breadcrumb Navigation */}
            <Breadcrumb
                stateName={stateName}
                stateSlug={stateName === "All States/UTs" ? "all" : stateToSlug(stateName)}
            />

            {/* A. High Impact Header */}
            <header className="w-full max-w-[1100px] mx-auto text-center space-y-1.5 px-4 -mt-7">
                <h1 className="font-black text-white uppercase tracking-tighter leading-none">
                    <span className="block text-[32px] md:text-[56px] whitespace-nowrap">ANNUAL BANKING CALENDAR 2026</span>
                    <span className="block -mt-1 text-[#7d3cff] text-[24px] md:text-[42px]">{stateName === "All States/UTs" ? "ALL INDIA" : stateName}</span>
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-[12px] uppercase tracking-widest font-medium">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                        <span className="text-white">RTGS / NEFT</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                        <span className="text-white">UPI / IMPS</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-600/50 animate-pulse"></div>
                        <span className="text-white/40">Cheque Clearing</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-600/50 animate-pulse"></div>
                        <span className="text-white/40">Forex Windows</span>
                    </div>
                </div>
            </header>

            {/* AdSense Slot */}
            {/* AdSense Slot - Responsive: Mobile 300x250, Desktop 970x250 */}
            <div className="w-[300px] lg:w-[970px] h-[250px] mx-auto -mt-[11px] mb-1 bg-[#0f0f12] flex items-center justify-center overflow-hidden">
                {/* Mobile Label */}
                <span className="block lg:hidden text-gray-500 text-sm font-bold uppercase tracking-widest">Advertisement (300x250)</span>
                {/* Desktop Label */}
                <span className="hidden lg:block text-gray-500 text-sm font-bold uppercase tracking-widest">Advertisement (970x250)</span>
            </div>

            {/* B. Control Bar (Filters & Actions) & C. Holiday List Wrapper */}
            <div className="flex flex-col gap-[5px] w-full max-w-[1050px] mx-auto px-4">
                {/* B. Control Bar (Filters & Actions) */}
                <div className="w-full">
                    <div id="inner-page-filters" className="w-full relative z-20 bg-white/5 backdrop-blur-sm border border-[#7d3cff]/50 rounded-[4px] p-4 flex flex-col md:flex-row gap-4 items-center md:items-end justify-between shadow-2xl scroll-mt-[100px]">
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            {/* Region Selector */}
                            <div className="w-full">
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest pl-1">STATE/UT</label>
                                <CustomSelect
                                    value={stateName}
                                    onChange={(val) => {
                                        if (val === "All States/UTs") {
                                            // Navigation Update for SEO URL
                                            window.location.href = "/all-bank-holiday-2026";
                                        } else {
                                            const slug = stateToSlug(val);
                                            window.location.href = `/${slug}-bank-holiday-2026`;
                                        }
                                    }}
                                    options={innerStateOptions}
                                    className="h-[38px] w-full min-w-[300px] px-3 py-2 hover:border-[#7d3cff] transition-colors"
                                />
                            </div>

                            {/* Month Filter */}
                            <div className="w-full">
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
                                    className="h-[38px] w-full min-w-[200px] px-3 py-2 hover:border-[#7d3cff] transition-colors"
                                />
                            </div>

                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
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
                </div>

                {/* C. Holiday List (Data Table) - Wrapped in print-container for print visibility */}
                <section className="w-full max-w-[1050px] mx-auto px-4 print-container">
                    {/* Print-Only Header - Inside print-container for visibility */}
                    <div className="print-only print-header">
                        <p className="print-header-brand">HOLBANK</p>
                        <p className="print-header-title">ANNUAL BANKING CALENDAR 2026</p>
                        <p className="print-header-state">{stateName === "All States/UTs" ? "All India" : stateName}</p>
                    </div>

                    <div className="overflow-x-auto rounded-[4px] border border-white/10">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white/5 text-xs uppercase text-gray-400 font-bold tracking-wider">
                                <tr>
                                    <th className="p-4 border-b border-white/10">Date</th>
                                    <th className="p-4 border-b border-white/10">Day</th>
                                    <th className="p-4 border-b border-white/10 w-1/3">Holiday Name</th>
                                    {stateName === "All States/UTs" && (
                                        <th className="p-4 border-b border-white/10">State</th>
                                    )}
                                    <th className="p-4 border-b border-white/10">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {displayedHolidays.length > 0 ? (
                                    displayedHolidays.map((h, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-white font-medium whitespace-nowrap">
                                                {format(parse(h.Date, "yyyy/MM/dd", new Date()), "dd MMM yyyy")}
                                            </td>
                                            <td className="p-4 text-gray-400">
                                                {format(parse(h.Date, "yyyy/MM/dd", new Date()), "EEEE")}
                                            </td>
                                            <td className="p-4 text-white font-medium">
                                                {h["Holiday"]}
                                            </td>
                                            {stateName === "All States/UTs" && (
                                                <td className="p-4 text-gray-400 text-xs">
                                                    {h["State"]}
                                                </td>
                                            )}
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${h.Status === "Closed"
                                                    ? "bg-red-900/40 text-red-200 border border-red-500/20"
                                                    : "bg-green-900/40 text-green-200 border border-green-500/20"
                                                    }`}>
                                                    {h.Status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={stateName === "All States/UTs" ? 5 : 4} className="p-8 text-center text-gray-500">
                                            No holidays found for this selection.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-4">
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
                    </div>


                </section>

            </div>

            {/* D. Footer Content Stack */}
            <div className="w-full space-y-12">
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
