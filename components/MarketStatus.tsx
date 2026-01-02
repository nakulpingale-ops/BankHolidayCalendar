"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useHolidayData } from "@/lib/HolidayContext";
import { format } from "date-fns";

export function MarketStatus() {
    // 1. Get holiday status
    const { isBankOpen } = useHolidayData();
    const [isOpen, setIsOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // 2. Simulated Market Data
    // Static Previous Close for Daily Sentiment Logic
    const PREV_NIFTY = 24100.00;

    // Current Prices (Initialized slightly higher to show green start)
    const [nifty, setNifty] = useState(24210.50);

    // Update time and open status every minute
    useEffect(() => {
        const checkStatus = () => {
            const now = new Date();
            setCurrentTime(now);

            // Check Date (Mon-Fri)
            const day = now.getDay();
            const isWeekday = day >= 1 && day <= 5;

            // Check Holiday (Maharashtra - NSE/BSE location)
            const bankStatus = isBankOpen(now, "Maharashtra");
            const isNotHoliday = bankStatus.isOpen;

            // Check Time (09:15 - 15:30 IST)
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const totalMinutes = hours * 60 + minutes;
            const marketOpen = 9 * 60 + 15; // 09:15
            const marketClose = 15 * 60 + 30; // 15:30

            const isMarketTime = totalMinutes >= marketOpen && totalMinutes < marketClose;

            setIsOpen(isWeekday && isNotHoliday && isMarketTime);
        };

        checkStatus();
        const timer = setInterval(checkStatus, 60000); // Check every minute
        return () => clearInterval(timer);
    }, [isBankOpen]);

    // Simulate Live Data Ticker (Price moves, but trend depends on Prev Close)
    useEffect(() => {
        const interval = setInterval(() => {
            // Add random fluctuation: -10 to +10 points
            const fluctuation = (Math.random() - 0.5) * 20;

            setNifty(prev => +(prev + fluctuation * 0.3).toFixed(2));

        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);

    // Helper to format currency
    const fmt = (val: number) => val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Helper Component for consistency
    const TickerItem = ({ label, price, prev }: { label: string, price: number, prev: number }) => {
        const diff = price - prev;
        const percent = (diff / prev) * 100;
        const isUp = diff >= 0;
        const colorClass = isUp ? 'text-green-600' : 'text-red-400';
        const ArrowIcon = isUp ? ArrowUp : ArrowDown;

        return (
            <div className="flex flex-col items-start leading-none gap-0.5">
                <div className="flex items-center gap-1">
                    <div className="w-[10.5px] flex justify-center items-center">
                        <div className="relative flex h-1 w-1">
                            {isOpen && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span>}
                            <span className={`relative inline-flex rounded-full h-1 w-1 ${isOpen ? 'bg-green-600' : 'bg-red-500'}`}></span>
                        </div>
                    </div>
                    <span className="text-[10.5px] text-gray-400 font-light hidden md:inline-block tracking-normal">{label}</span>
                </div>
                <div className={`flex items-center gap-1 ${colorClass} transition-colors duration-500`}>
                    <ArrowIcon className="w-[10.5px] h-[10.5px] stroke-[2.5]" />
                    <span className="text-[10.5px] font-light tabular-nums">{fmt(price)}</span>
                    <span className="text-[10.5px] font-light tabular-nums">({percent > 0 ? '+' : ''}{percent.toFixed(2)}%)</span>
                </div>
            </div>
        );
    };

    return (
        <div className="hidden sm:flex items-center">
            {/* Disclaimer / Status Indicator */}
            {/* On mobile we hide the labels but keep the dots/values. */}

            {/* NSE */}
            <div className="flex items-center">
                <TickerItem label="NIFTY 50" price={nifty} prev={PREV_NIFTY} />
            </div>

        </div>
    );
}
