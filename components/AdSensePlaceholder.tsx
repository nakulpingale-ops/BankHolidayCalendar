"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const AD_HIDDEN_KEY = "holbank_ad_hidden";

export function AdSensePlaceholder() {
    const [isHidden, setIsHidden] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Check sessionStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const hidden = sessionStorage.getItem(AD_HIDDEN_KEY);
            if (hidden === "true") {
                setIsHidden(true);
            }
        }
    }, []);

    const handleClose = () => {
        setIsHidden(true);
        if (typeof window !== "undefined") {
            sessionStorage.setItem(AD_HIDDEN_KEY, "true");
        }
    };

    if (isHidden) {
        return null;
    }

    return (
        <div
            className="w-full max-w-[1200px] mx-auto mt-[-34px] mb-[-4px] md:mb-3 md:-mt-[98px] flex flex-col items-center px-4 transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Label */}
            <div className="w-[300px] md:w-[728px] flex justify-start mb-1">
                <span className="text-[10px] font-medium tracking-widest text-slate-400 dark:text-slate-500">ADVERTISEMENT</span>
            </div>

            {/* Mobile Slot (300x250) - Visible on small screens, hidden on md+ */}
            <div className="md:hidden w-[300px] h-[250px] bg-[#0f0f12] rounded-md relative overflow-hidden flex flex-col items-center justify-center group">
                <span className="text-gray-500 text-sm font-bold uppercase tracking-widest">Advertisement</span>
                <span className="text-gray-600 text-xs mt-2">Mobile (300x250)</span>

                {/* Close Button - Mobile */}
                <button
                    onClick={handleClose}
                    className={`absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-gray-400 hover:text-white hover:bg-black/70 transition-all duration-200 ${isHovered ? "opacity-100" : "opacity-0"} group-hover:opacity-100`}
                    title="Hide Ad"
                    aria-label="Hide advertisement"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>

            {/* Desktop Slot (728x90) - Hidden on small screens, visible on md+ */}
            <div className="hidden md:flex w-[728px] max-w-full h-[90px] bg-[#0f0f12] relative overflow-hidden flex-col items-center justify-center rounded-md group">
                <span className="text-gray-500 text-sm font-bold uppercase tracking-widest">Advertisement</span>
                <span className="text-gray-600 text-xs mt-2">Leaderboard (728x90)</span>

                {/* Close Button - Desktop */}
                <button
                    onClick={handleClose}
                    className={`absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-gray-400 hover:text-white hover:bg-black/70 transition-all duration-200 ${isHovered ? "opacity-100" : "opacity-0"} group-hover:opacity-100`}
                    title="Hide Ad"
                    aria-label="Hide advertisement"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}
