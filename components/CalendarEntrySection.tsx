"use client";

import { useState } from "react";
import { CalendarDays, ArrowRight } from "lucide-react";
import { INDIAN_STATES, stateToSlug } from "@/lib/constants";
import { CustomSelect } from "@/components/CustomSelect";

export function CalendarEntrySection() {
    const [entrySectionState, setEntrySectionState] = useState<string>("all");

    const handleNavigate = () => {
        // Master route for "All States"
        if (entrySectionState === "all" || entrySectionState === "All States/UTs") {
            window.location.href = "/all-bank-holiday-2026";
            return;
        }
        const slug = stateToSlug(entrySectionState);
        window.location.href = `/${slug}-bank-holiday-2026`;
    };

    const dropdownOptions = [
        { value: "all", label: "All States/UTs" },
        ...INDIAN_STATES.map(s => ({ value: s, label: s }))
    ];

    return (
        <section id="official-calendar-2026" className="w-full py-8 text-white relative z-[60] -mt-[85px] md:-mt-[97px] mb-0 scroll-mt-[400px]">
            <div className="w-full max-w-none px-4 sm:max-w-[1050px] sm:mx-auto">
                <div className="flex items-start md:items-center gap-3 mb-[8px]">
                    <div
                        className="w-6 h-6 bg-[#ffc61c] animate-pulse"
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
                    <h2 className="text-2xl font-bold tracking-tight">Complete State/UT-wise Bank Holiday Calendar 2026</h2>
                </div>

                <div id="calendar-entry-box" className="w-full bg-[#121212]/80 backdrop-blur-sm border-[0.25px] border-[#2563eb]/45 rounded-xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-2 items-end gap-6">
                    {/* Region Selector - 50% Width */}
                    <div className="w-full">
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest pl-1">State/UT</label>
                        <CustomSelect
                            value={entrySectionState}
                            onChange={setEntrySectionState}
                            options={dropdownOptions}
                            className="h-14 bg-[#0a0a0a] text-white text-sm font-medium rounded-xl"
                        />
                    </div>

                    {/* CTA Button - 50% Width */}
                    <button
                        onClick={handleNavigate}
                        className="w-full h-14 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-medium px-8 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-lg shadow-blue-500/10"
                    >
                        {entrySectionState === "all" ? <>View All States/UTs 2026<br className="sm:hidden" /> Holiday List</> : <>View {entrySectionState} 2026<br className="sm:hidden" /> Holiday List</>}
                        <ArrowRight className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>
        </section>
    );
}
