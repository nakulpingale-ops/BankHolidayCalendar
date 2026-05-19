"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Check, AlertCircle, ArrowRight } from "lucide-react";
import { useHolidayData } from "@/lib/HolidayContext";

const STORAGE_KEY = "holbank_feedback_shown";
const SEARCH_COUNT_KEY = "holbank_search_count";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

interface FeedbackData {
    response: string;
    missingHoliday?: string;
    stateName: string;
    timestamp: string;
}

export function FeedbackPopup() {
    const { selectedState } = useHolidayData();
    const [isVisible, setIsVisible] = useState(false);
    const [showMissingInput, setShowMissingInput] = useState(false);
    const [missingHoliday, setMissingHoliday] = useState("");
    const [submitted, setSubmitted] = useState(false);

    // Check if popup should show (once per week)
    const shouldShowPopup = useCallback(() => {
        if (typeof window === "undefined") return false;

        const lastShown = localStorage.getItem(STORAGE_KEY);
        if (lastShown) {
            const lastShownTime = parseInt(lastShown, 10);
            if (Date.now() - lastShownTime < ONE_WEEK_MS) {
                return false;
            }
        }
        return true;
    }, []);

    // Initialize trigger logic
    useEffect(() => {
        if (!shouldShowPopup()) return;

        let timeoutId: NodeJS.Timeout;

        // Trigger 1: 30 second delay
        timeoutId = setTimeout(() => {
            if (shouldShowPopup()) {
                setIsVisible(true);
                localStorage.setItem(STORAGE_KEY, Date.now().toString());
            }
        }, 30000);

        // Trigger 2: Check search count
        const checkSearchCount = () => {
            const count = parseInt(localStorage.getItem(SEARCH_COUNT_KEY) || "0", 10);
            if (count >= 2 && shouldShowPopup()) {
                clearTimeout(timeoutId);
                setIsVisible(true);
                localStorage.setItem(STORAGE_KEY, Date.now().toString());
            }
        };

        // Check on mount
        checkSearchCount();

        // Listen for state changes (searches)
        const handleStorageChange = () => {
            checkSearchCount();
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [shouldShowPopup]);

    // Track state changes as searches
    useEffect(() => {
        if (typeof window === "undefined") return;

        const currentCount = parseInt(localStorage.getItem(SEARCH_COUNT_KEY) || "0", 10);
        localStorage.setItem(SEARCH_COUNT_KEY, (currentCount + 1).toString());
    }, [selectedState]);

    const sendFeedback = async (data: FeedbackData) => {
        // Log to console for now (can be replaced with actual API/Google Sheets integration)
        console.log("Feedback submitted:", data);

        // Example: Send to a webhook or API endpoint
        // try {
        //     await fetch('/api/feedback', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(data),
        //     });
        // } catch (error) {
        //     console.error('Failed to submit feedback:', error);
        // }
    };

    const handleYesPerfect = () => {
        sendFeedback({
            response: "yes_perfect",
            stateName: selectedState,
            timestamp: new Date().toISOString(),
        });
        setSubmitted(true);
        setTimeout(() => setIsVisible(false), 2000);
    };

    const handleMissingHoliday = () => {
        setShowMissingInput(true);
    };

    const submitMissingHoliday = () => {
        if (missingHoliday.trim()) {
            sendFeedback({
                response: "missing_holiday",
                missingHoliday: missingHoliday.trim(),
                stateName: selectedState,
                timestamp: new Date().toISOString(),
            });
            setSubmitted(true);
            setTimeout(() => setIsVisible(false), 2000);
        }
    };

    const handleCheckAnotherState = () => {
        setIsVisible(false);
        // Highlight the dropdown by scrolling to it
        const dropdown = document.querySelector('[id="official-calendar-2026"]');
        if (dropdown) {
            dropdown.scrollIntoView({ behavior: "smooth", block: "center" });
            // Add a brief highlight animation
            const box = document.getElementById("calendar-entry-box");
            if (box) {
                box.classList.remove("animate-target-pulse");
                void box.offsetWidth;
                box.classList.add("animate-target-pulse");
            }
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300 print:hidden">
            <div className="w-[320px] bg-[#0a0a0f] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                {/* Green Top Border */}
                <div className="h-[3px] bg-[#14A900]" />

                {/* Content */}
                <div className="p-5">
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
                        aria-label="Close feedback popup"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {submitted ? (
                        <div className="flex flex-col items-center justify-center py-4 gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#14A900]/20 flex items-center justify-center">
                                <Check className="w-5 h-5 text-[#14A900]" />
                            </div>
                            <p className="text-[14px] text-white font-medium">Thank you for your feedback!</p>
                        </div>
                    ) : (
                        <>
                            {/* Question */}
                            <p className="text-[14px] text-white font-medium mb-1 pr-6">
                                Is our 2026 data accurate for your state?
                            </p>
                            <p className="text-[12px] text-gray-400 mb-5">
                                Currently viewing: <span className="text-[#2563eb]">{selectedState}</span>
                            </p>

                            {showMissingInput ? (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={missingHoliday}
                                        onChange={(e) => setMissingHoliday(e.target.value)}
                                        placeholder="Which holiday is missing?"
                                        className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#14A900] transition-colors"
                                        autoFocus
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowMissingInput(false)}
                                            className="flex-1 h-9 text-[12px] text-gray-400 hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={submitMissingHoliday}
                                            disabled={!missingHoliday.trim()}
                                            className="flex-1 h-9 bg-[#14A900] hover:bg-[#12970a] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[12px] font-medium rounded transition-colors"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={handleYesPerfect}
                                        className="w-full h-10 flex items-center justify-center gap-2 bg-white/5 hover:bg-[#14A900] border border-white/10 hover:border-[#14A900] text-white text-[13px] font-medium rounded transition-all duration-200"
                                    >
                                        <Check className="w-4 h-4" />
                                        Yes, perfect!
                                    </button>
                                    <button
                                        onClick={handleMissingHoliday}
                                        className="w-full h-10 flex items-center justify-center gap-2 bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/50 text-white text-[13px] font-medium rounded transition-all duration-200"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        Missing a holiday
                                    </button>
                                    <button
                                        onClick={handleCheckAnotherState}
                                        className="w-full h-10 flex items-center justify-center gap-2 bg-white/5 hover:bg-[#2563eb]/20 border border-white/10 hover:border-[#2563eb]/50 text-white text-[13px] font-medium rounded transition-all duration-200"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                        Check another state
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper function to increment search count (call this when user changes state)
export function incrementSearchCount() {
    if (typeof window === "undefined") return;
    const currentCount = parseInt(localStorage.getItem(SEARCH_COUNT_KEY) || "0", 10);
    localStorage.setItem(SEARCH_COUNT_KEY, (currentCount + 1).toString());
}
