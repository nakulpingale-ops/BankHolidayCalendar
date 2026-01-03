"use client";

export const runtime = "edge";

import { useState, use, useEffect } from "react";
import { format, parse, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns";
import { useHolidayData } from "@/lib/HolidayContext";
import { INDIAN_STATES } from "@/lib/constants";
import { Hero } from "@/components/Hero";
import { TrackerInsight } from "@/components/TrackerInsight";
import { FaqSection } from "@/components/FaqSection";
import { BrandHeadline } from "@/components/BrandHeadline";
import { ChevronLeft, ChevronRight, Share2, CalendarPlus, Download, Filter } from "lucide-react";

export default function StateCalendarPage({ params }: { params: Promise<{ state: string }> }) {
    const resolvedParams = use(params);
    const { getHolidays, loading } = useHolidayData();
    const [stateName, setStateName] = useState("Maharashtra");
    const [selectedMonth, setSelectedMonth] = useState<number | "all">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        // Convert slug to Title Case (e.g., "new-delhi" -> "New Delhi")
        // Simple implementation: replace hyphens with spaces and capitalize words
        // For accurate matching, we might need a slug map or finding from INDIAN_STATES
        const slug = resolvedParams.state;
        const potentialName = INDIAN_STATES.find(s => s.toLowerCase().replace(/ /g, "-") === slug) || "Maharashtra";
        setStateName(potentialName);
    }, [resolvedParams]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading Calendar...</div>;
    }

    const allHolidays = getHolidays(stateName, selectedMonth === "all" ? undefined : selectedMonth);

    // Pagination
    const totalPages = Math.ceil(allHolidays.length / rowsPerPage);
    const displayedHolidays = allHolidays.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSelectedMonth(val === "all" ? "all" : parseInt(val));
        setCurrentPage(1);
    };

    const months = eachMonthOfInterval({
        start: new Date(2026, 0, 1),
        end: new Date(2026, 11, 31)
    });

    return (
        <div className="flex flex-col gap-12 py-8 w-full">
            {/* A. High Impact Header */}
            <header className="w-full text-center space-y-4">
                <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none break-words">
                    ANNUAL BANKING CALENDAR 2026: {stateName}
                </h1>
                <p className="text-[12px] text-white/70 uppercase tracking-widest font-medium">
                    RTGS / NEFT • UPI / IMPS • Cheque Clearing • Forex Windows
                </p>
            </header>

            {/* B. Control Bar (Filters & Actions) */}
            <div className="w-full max-w-[1050px] mx-auto sticky top-[80px] z-30 bg-[#0F172A]/95 backdrop-blur-md border border-white/10 rounded-[4px] p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xl">
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Region Selector */}
                    <div className="relative min-w-[200px]">
                        <select
                            value={stateName}
                            // Logic to switch URL would go here, for now just update state to show interactivity
                            // In a real app, use router.push(`/calendar/${value}`)
                            onChange={(e) => {
                                setStateName(e.target.value);
                                // Ideally redirect: router.push(...) 
                            }}
                            className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-[4px] px-3 py-2 outline-none focus:border-[#7d3cff]"
                        >
                            {INDIAN_STATES.map(s => <option key={s} value={s} className="bg-black">{s}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <Filter className="w-4 h-4 text-gray-500" />
                        </div>
                    </div>

                    {/* Month Filter */}
                    <div className="relative min-w-[200px]">
                        <select
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-[4px] px-3 py-2 outline-none focus:border-[#7d3cff]"
                        >
                            <option value="all" className="bg-black">All Months</option>
                            {months.map((m, idx) => (
                                <option key={idx} value={idx} className="bg-black">{format(m, "MMMM")}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button className="p-2 border border-white/10 rounded-[4px] hover:bg-white/10 text-gray-300 transition-colors" title="Share">
                        <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 border border-white/10 rounded-[4px] hover:bg-white/10 text-gray-300 transition-colors" title="Add to Calendar">
                        <CalendarPlus className="w-4 h-4" />
                    </button>
                    <button className="p-2 border border-white/10 rounded-[4px] hover:bg-white/10 text-gray-300 transition-colors" title="Download">
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* C. Holiday List (Data Table) */}
            <section className="w-full max-w-[1050px] mx-auto px-4">
                <div className="overflow-x-auto rounded-[4px] border border-white/10">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 text-xs uppercase text-gray-400 font-bold tracking-wider">
                            <tr>
                                <th className="p-4 border-b border-white/10">Date</th>
                                <th className="p-4 border-b border-white/10">Day</th>
                                <th className="p-4 border-b border-white/10 w-1/2">Holiday Name</th>
                                <th className="p-4 border-b border-white/10">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {displayedHolidays.length > 0 ? (
                                displayedHolidays.map((h, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-white font-medium whitespace-nowrap">
                                            {format(parse(h.Date, "yyyy-MM-dd", new Date()), "dd MMMM yyyy")}
                                        </td>
                                        <td className="p-4 text-gray-400">
                                            {format(parse(h.Date, "yyyy-MM-dd", new Date()), "EEEE")}
                                        </td>
                                        <td className="p-4 text-white font-medium">
                                            {h["Holiday"]}
                                        </td>
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
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        No holidays found for this selection.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination & Footer */}
                <div className="flex items-center justify-between mt-4 text-xs text-gray-500 px-1">
                    <span>Showing {displayedHolidays.length} of {allHolidays.length} Holidays</span>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="p-2 border border-white/10 rounded-[4px] hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className="p-2 border border-white/10 rounded-[4px] hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>

            {/* D. Footer Content Stack */}
            <div className="w-full space-y-12">
                {/* Context-aware Hero */}
                {/* Note: Hero inherently uses today's date, but we could pass props to override if needed. 
                    For now, it shows "Today/Tomorrow" context which is useful even on 2026 page. */}
                <Hero />
                <TrackerInsight />
                <FaqSection />
                <BrandHeadline />
            </div>
        </div>
    );
}
