"use client";

import { Bell, CalendarRange, Share2 } from "lucide-react";

interface UtilityGuideSectionProps {
    stateName: string;
}

export function UtilityGuideSection({ stateName }: UtilityGuideSectionProps) {
    return (
        <section className="w-full py-8 mt-8 border-t border-white/5">
            <div className="w-full max-w-[1050px] mx-auto px-4">
                <h3 className="text-xl font-bold text-white mb-6">How to Use the HolBank Utility Tools</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Share List */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-[#2563eb]">
                            <Share2 className="w-5 h-5" />
                            <span className="font-bold text-sm uppercase tracking-wide">Share List</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Use the share icon to instantly send this verified holiday list to your friends or colleagues via WhatsApp, Email, or Social Media.
                        </p>
                    </div>

                    {/* Smart Reminders */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-[#2563eb]">
                            <Bell className="w-5 h-5" />
                            <span className="font-bold text-sm uppercase tracking-wide">Smart Reminders</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Get the BANKODE app to receive intelligent, automatic notifications before upcoming bank holidays. Never miss a bank closure again.
                        </p>
                    </div>

                    {/* Plan Long Weekends */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-[#2563eb]">
                            <CalendarRange className="w-5 h-5" />
                            <span className="font-bold text-sm uppercase tracking-wide">Plan Long Weekends</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Use BANKODE's Smart Leaves feature to maximize your time off by planning your holidays around long weekends.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
