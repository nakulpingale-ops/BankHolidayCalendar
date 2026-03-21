"use client";
import React from 'react';
import { format, parse } from 'date-fns';
import { useHolidayData } from "@/lib/HolidayContext";

const HolidayTable = () => {
    const { holidays } = useHolidayData();

    if (!holidays.length) return <div className="p-4 text-red-500 text-center">No data found.</div>;

    // Sort chronologically
    const sortedHolidays = [...holidays].sort((a, b) => {
        const dateA = new Date(a.Date);
        const dateB = new Date(b.Date);
        return dateA.getTime() - dateB.getTime();
    });

    return (
        <div className="w-full max-w-[1050px] mx-auto px-4 mt-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Official Holiday List 2026</h2>
            <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-xs uppercase text-gray-400 font-bold tracking-wider">
                        <tr>
                            <th className="p-4 border-b border-white/10">Date</th>
                            <th className="p-4 border-b border-white/10">Holiday</th>
                            <th className="p-4 border-b border-white/10">State</th>
                            <th className="p-4 border-b border-white/10">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        {sortedHolidays.map((h, index) => (
                            <tr key={index} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 text-gray-300">
                                    {h.Date}
                                </td>
                                <td className="p-4 text-gray-300">
                                    {h.Holiday}
                                </td>
                                <td className="p-4 text-gray-300">
                                    {h.State}
                                </td>
                                <td className="p-4 text-gray-300">
                                    {h.Status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HolidayTable;