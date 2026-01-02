"use client";

import { CalendarPlus, Download, Share2 } from "lucide-react";

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
                    <div className="bg-[#0f1014] border border-[#7d3cff]/20 rounded-lg p-5 flex flex-col gap-3 hover:border-[#7d3cff]/40 transition-colors">
                        <div className="flex items-center gap-2 text-[#7d3cff]">
                            <Share2 className="w-5 h-5" />
                            <span className="font-bold text-sm uppercase tracking-wide">Share List</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Use the share icon to instantly send this verified holiday list to your friends or colleagues via WhatsApp, Email, or Social Media.
                        </p>
                    </div>

                    {/* Add to Calendar */}
                    <div className="bg-[#0f1014] border border-[#7d3cff]/20 rounded-lg p-5 flex flex-col gap-3 hover:border-[#7d3cff]/40 transition-colors">
                        <div className="flex items-center gap-2 text-[#7d3cff]">
                            <CalendarPlus className="w-5 h-5" />
                            <span className="font-bold text-sm uppercase tracking-wide">Add to Calendar</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Click the calendar icon to download an .ics file. Open this file on your phone or computer to automatically save this holiday to your Google, Apple, or Outlook calendar.
                        </p>
                    </div>

                    {/* Download List */}
                    <div className="bg-[#0f1014] border border-[#7d3cff]/20 rounded-lg p-5 flex flex-col gap-3 hover:border-[#7d3cff]/40 transition-colors">
                        <div className="flex items-center gap-2 text-[#7d3cff]">
                            <Download className="w-5 h-5" />
                            <span className="font-bold text-sm uppercase tracking-wide">Download List</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Click the download icon to save the complete 2026 holiday list for {stateName} as a .csv file. This file can be opened in Microsoft Excel or Google Sheets for your personal records.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
