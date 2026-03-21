"use client";

import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

export default function BankHolidays2025Page() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 pt-[120px]">
            <div className="bg-white/5 border border-[#7d3cff]/30 rounded-xl p-8 max-w-md w-full">
                <Calendar className="w-16 h-16 text-[#7d3cff] mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-white mb-4">
                    Bank Holidays 2025
                </h1>
                <p className="text-gray-400 mb-6 leading-relaxed">
                    Our comprehensive 2025 bank holiday data is being archived.
                    Please check out our <span className="text-white font-medium">2026 calendar</span> for
                    the latest verified banking schedules.
                </p>
                <Link
                    href="/all-bank-holiday-2026"
                    className="inline-flex items-center gap-2 bg-[#7d3cff] hover:bg-[#6b2fff] text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    View 2026 Calendar
                </Link>
            </div>
        </div>
    );
}
