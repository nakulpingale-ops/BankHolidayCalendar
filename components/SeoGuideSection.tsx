import React from 'react';

interface SeoGuideSectionProps {
    stateName: string;
}

export function SeoGuideSection({ stateName }: SeoGuideSectionProps) {
    const displayState = stateName === "All States/UTs" ? "India" : stateName;

    return (
        <section className="w-full max-w-[1050px] mx-auto px-4 mt-12 mb-8">
            <div className="w-full">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                    The Ultimate Bank Holiday Calendar 2026: A Comprehensive Guide to Indian Banking Services
                </h2>

                <div className="prose prose-invert max-w-none 
                    prose-p:text-[14px] prose-p:leading-relaxed prose-p:text-gray-400 
                    prose-h2:text-[18px] prose-h2:font-bold prose-h2:text-transparent prose-h2:bg-clip-text prose-h2:bg-gradient-to-r prose-h2:from-white prose-h2:to-blue-200 prose-h2:mt-8 prose-h2:mb-4
                    prose-h3:text-[16px] prose-h3:font-semibold prose-h3:text-white prose-h3:mt-6
                    prose-a:text-[#2563eb] prose-a:no-underline hover:prose-a:text-[#6c2ee0]
                    prose-strong:text-white prose-li:text-gray-300 prose-li:text-[14px]
                    prose-ul:my-4 prose-li:my-1">

                    <p>
                        Searching for the most accurate <strong>Bank Holiday Calendar 2026</strong> for {displayState}? You are in the right place.
                        Navigating through the various national and state-specific holidays can be complex, but our <strong>Bank Holiday Calendar 2026</strong> simplifies this by aggregating data directly from verified <strong className="text-blue-200">RBI circulars</strong> and official State Government gazettes.
                        Whether you need to plan a high-value RTGS transfer or visit a branch for locker operations, checking the <strong>Bank Holiday Calendar 2026</strong> first ensures you never face a closed door.
                    </p>

                    <h2 className="flex items-center gap-3">
                        <span className="w-1 h-6 bg-[#2563eb] rounded-full"></span>
                        How the Bank Holiday Calendar 2026 Works
                    </h2>
                    <p>
                        The <strong>Bank Holiday Calendar 2026</strong> is governed principally by the <strong>Negotiable Instruments Act, 1881</strong>.
                        Under Section 25 of this act, the central and state governments declare specific days as public holidays.
                        Our <strong>Bank Holiday Calendar 2026</strong> tracks these announcements based on official schedules to provide you with the most up-to-date calendar for {displayState}.
                    </p>

                    <h2 className="flex items-center gap-3">
                        <span className="w-1 h-6 bg-[#2563eb] rounded-full"></span>
                        The "2nd and 4th Saturday" Rule in 2026
                    </h2>
                    <p>
                        A key feature of the <strong>Bank Holiday Calendar 2026</strong> is the Saturday working rule, which remains unchanged from the 2015 RBI settlement:
                    </p>
                    <ul className="list-none pl-0 space-y-4 my-6">
                        <li className="flex items-start gap-3">
                            <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
                            <span><strong>Banks are closed</strong> on the 2nd and 4th Saturdays of every month in the <strong>Bank Holiday Calendar 2026</strong>.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-1.5 w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span>
                            <span><strong>Banks are OPEN</strong> on the 1st, 3rd, and 5th Saturdays, unless the <strong>Bank Holiday Calendar 2026</strong> marks a specific festival holiday.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
                            <span><strong>Sundays</strong> are always listed as holidays in the <strong>Bank Holiday Calendar 2026</strong>.</span>
                        </li>
                    </ul>

                    <h2 className="flex items-center gap-3">
                        <span className="w-1 h-6 bg-[#2563eb] rounded-full"></span>
                        Digital Services During Holidays
                    </h2>
                    <p>
                        Even when standard branches are closed according to the <strong>Bank Holiday Calendar 2026</strong>, validated digital channels remain open.
                        Your financial planning shouldn't stop just because it's a red day on the <strong>Bank Holiday Calendar 2026</strong>.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">
                        {['UPI', 'IMPS', 'RTGS', 'NEFT'].map(service => (
                            <div key={service} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                <span className="font-bold text-white">{service}</span>
                                <span className="text-xs text-green-400 font-mono ml-auto">24/7 ACTIVE</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-[#2563eb]/10 to-blue-900/10 border-l-4 border-[#2563eb] p-6 my-8 rounded-xl">
                        <p className="font-bold text-blue-200 mb-2 font-display uppercase tracking-widest text-sm">Pro Tip</p>
                        <p className="text-gray-300 m-0">Always confirm high-value dates with the <strong>Bank Holiday Calendar 2026</strong> to avoid clearing delays.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
