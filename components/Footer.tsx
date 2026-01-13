"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function FooterContent() {
    const searchParams = useSearchParams();
    // Default to empty string if state param doesn't exist to avoid "null" string
    const stateParam = searchParams.get("state");

    // Construct dynamic hrefs
    // If state exists: /today?state=maharashtra
    // If no state: /today
    const todayHref = stateParam ? `/today?state=${encodeURIComponent(stateParam)}` : "/today";
    const tomorrowHref = stateParam ? `/tomorrow?state=${encodeURIComponent(stateParam)}` : "/tomorrow";

    return (
        <footer className="w-full py-16 mt-20 bg-[#050505] border-t border-white/5 print:hidden">
            <div className="w-full max-w-none px-4 sm:max-w-[1200px] sm:mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 items-start">

                    {/* Task 1: HOLBANK GLOBAL NETWORK */}
                    <div className="space-y-3">
                        <h3 className="text-[12px] font-bold text-[#7d3cff] uppercase tracking-widest">HOLBANK GLOBAL NETWORK</h3>
                        <div className="flex flex-col gap-3">
                            <Link href="https://saturdaytracker.com" target="_blank" className="text-[14px] text-[#e5e7eb] hover:text-[#7d3cff] transition-colors duration-300">Saturday Tracker</Link>
                            <Link href="/" className="text-[14px] text-[#e5e7eb] hover:text-[#7d3cff] transition-colors duration-300">Bank Holiday Calendar</Link>
                            {/* <span className="text-[13px] text-[#6b7280]">Coming Soon: Bank Holiday List</span> */}
                            <span className="text-[13px] text-[#6b7280]">Coming Soon: Plan Long Weekends</span>
                        </div>
                    </div>

                    {/* POPULAR PAGES */}
                    <div className="space-y-3">
                        <h3 className="text-[12px] font-bold text-[#7d3cff] uppercase tracking-widest">POPULAR PAGES</h3>
                        <div className="flex flex-col gap-3">
                            <Link href="/all-bank-holiday-2026" className="text-[14px] text-[#e5e7eb] hover:text-[#7d3cff] transition-colors duration-300">All Bank Holidays 2026</Link>
                            {/* Removed 2025 Link as per request */}
                            <Link href={todayHref} className="text-[14px] text-[#e5e7eb] hover:text-[#7d3cff] transition-colors duration-300">Bank Holiday Today</Link>
                            <Link href={tomorrowHref} className="text-[14px] text-[#e5e7eb] hover:text-[#7d3cff] transition-colors duration-300">Bank Holiday Tomorrow</Link>
                            <Link href="/maharashtra-bank-holiday-2026" className="text-[14px] text-[#e5e7eb] hover:text-[#7d3cff] transition-colors duration-300">Maharashtra Bank Holidays 2026</Link>
                            <Link href="/delhi-bank-holiday-2026" className="text-[14px] text-[#e5e7eb] hover:text-[#7d3cff] transition-colors duration-300">Delhi Bank Holidays 2026</Link>
                            <Link href="/karnataka-bank-holiday-2026" className="text-[14px] text-[#e5e7eb] hover:text-[#7d3cff] transition-colors duration-300">Karnataka Bank Holidays 2026</Link>
                            <Link href="/tamil-nadu-bank-holiday-2026" className="text-[14px] text-[#e5e7eb] hover:text-[#7d3cff] transition-colors duration-300">Tamil Nadu Bank Holidays 2026</Link>
                        </div>
                    </div>

                    {/* Task 2: RESOURCES */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-[12px] font-bold text-[#7d3cff] uppercase tracking-widest">RESOURCES</h3>
                        <div className="flex flex-col gap-3">
                            <Link href="/about" className="text-[14px] text-[#e5e7eb] hover:text-[#7d3cff] transition-colors duration-300">About Us</Link>
                            <Link href="/privacy-policy" className="text-[14px] text-[#e5e7eb] hover:text-[#7d3cff] transition-colors duration-300">Privacy Policy</Link>
                            <Link href="/terms" className="text-[14px] text-[#e5e7eb] hover:text-[#7d3cff] transition-colors duration-300">Terms of Service</Link>
                        </div>
                    </div>

                    {/* Task 3: BRANDING & COPYRIGHT */}
                    <div className="flex flex-col gap-4 md:items-end md:text-right">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-[#6b7280] uppercase tracking-widest leading-relaxed">
                                © 2026 HolBank IP. All rights reserved.
                            </span>
                            <span className="text-[10px] text-[#6b7280] uppercase tracking-widest font-bold">
                                Verified Financial Utility.
                            </span>
                        </div>
                        <div className="mt-4 pt-6 border-t border-white/5 w-full md:w-auto">
                            <p className="text-[10px] text-[#4b5563] leading-relaxed max-w-sm md:ml-auto">
                                Disclaimer: BankHolidayCalendar.com is a specialized product designed to track Indian banking schedules. While we verify data via RBI circulars and State Gazettes, institutional changes can occur.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}

export function Footer() {
    return (
        <Suspense fallback={<footer className="w-full py-16 mt-20 bg-[#050505] border-t border-white/5 print:hidden" />}>
            <FooterContent />
        </Suspense>
    );
}
