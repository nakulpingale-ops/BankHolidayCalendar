"use client";

import Link from "next/link";
import { MarketStatus } from "./MarketStatus";

export function Header() {
    return (
        <header className="fixed top-0 left-0 z-50 w-full pt-4 pb-4 transition-all duration-300 bg-black/20 backdrop-blur-md border-b border-purple-500/20 print:hidden">
            <div className="flex items-center justify-between w-full max-w-[1050px] mx-auto px-4">
                <div className="flex flex-col -ml-0.5">
                    <Link href="/" className="text-base md:text-xl font-bold tracking-normal text-white hover:opacity-90 transition-opacity leading-none">
                        BankHolidayCalendar<span className="text-white/25">.com</span>
                    </Link>
                    <span className="text-xs text-gray-500 font-medium tracking-normal -mt-0.5 origin-left">
                        a <span className="text-[#7c3cfd] font-bold">HOLBANK</span> product
                    </span>
                </div>

                <div className="flex items-center gap-2 md:gap-6 min-w-0 flex-shrink">
                    <Link
                        href="#official-calendar-2026"
                        onClick={(e) => {
                            e.preventDefault();
                            e.preventDefault();

                            // Check for Inner Page Filters first
                            const innerFilters = document.getElementById('inner-page-filters');
                            if (innerFilters) {
                                innerFilters.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                return;
                            }

                            // Fallback to Homepage Section
                            const section = document.getElementById('official-calendar-2026');
                            const targetBox = document.getElementById('calendar-entry-box');

                            if (section) {
                                if (targetBox) {
                                    // Reset animation
                                    targetBox.classList.remove('animate-target-pulse');

                                    // Force reflow
                                    void targetBox.offsetWidth;

                                    // Add animation
                                    targetBox.classList.add('animate-target-pulse');
                                }

                                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }}
                        className="flex items-center gap-1 md:gap-2 text-xs font-medium text-gray-300 hover:text-white transition-colors group flex-shrink-0"
                    >
                        <div
                            className="w-4 h-4 bg-[#ffc61c] animate-icon-pulse flex-shrink-0"
                            style={{
                                maskImage: 'url(/lightning.png)',
                                maskSize: 'contain',
                                maskRepeat: 'no-repeat',
                                maskPosition: 'center',
                                WebkitMaskImage: 'url(/lightning.png)',
                                WebkitMaskSize: 'contain',
                                WebkitMaskRepeat: 'no-repeat',
                                WebkitMaskPosition: 'center'
                            }}
                        />
                        <span className="md:hidden text-[#ffc61c] text-xs font-bold">2026 Calendar</span>
                        <span className="hidden md:inline">Bank Holiday Calendar 2026</span>
                    </Link>
                    <MarketStatus />
                </div>
            </div>
        </header>
    );
}
