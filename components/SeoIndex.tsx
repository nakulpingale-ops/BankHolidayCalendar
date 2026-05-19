"use client";

import React from "react";
import { INDIAN_STATES, stateToSlug } from "@/lib/constants";

export function SeoIndex() {
    return (
        <section className="w-full py-12 mt-10 border-t border-white/5 print:hidden">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-[12px] font-bold text-[#2563eb] uppercase tracking-widest mb-5">
                    REGIONAL BANK HOLIDAY CALENDARS 2026
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3">
                    {INDIAN_STATES.map((state) => (
                        <a
                            key={state}
                            href={`/${stateToSlug(state)}-bank-holiday-2026`}
                            title={`View the official 2026 Bank Holiday Calendar for ${state} - Verified Financial Data`}
                            className="text-[12px] text-[#e5e7eb] hover:text-[#2563eb] transition-colors duration-200 leading-[1.8] text-left"
                        >
                            Bank Holiday Calendar 2026 for {state}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
