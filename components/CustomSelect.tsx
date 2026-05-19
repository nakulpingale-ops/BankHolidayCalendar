"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomSelectProps {
    value: string | number | "all";
    onChange: (value: string) => void;
    options: { value: string | number | "all"; label: string }[];
    placeholder?: string;
    className?: string;
}

export function CustomSelect({ value, onChange, options, placeholder, className }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Reset scroll when opened
    useEffect(() => {
        if (isOpen && listRef.current) {
            listRef.current.scrollTop = 0;
        }
    }, [isOpen]);

    const selectedOption = options.find(opt => String(opt.value) === String(value));

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-between w-full text-left outline-none appearance-none cursor-pointer",
                    "bg-[#0e0a18] border-[0.25px] border-[#2563eb]/65 text-white text-sm rounded-xl hover:border-[#2563eb] focus:border-[#2563eb] focus:ring-[0.5px] focus:ring-[#2563eb] shadow-lg transition-all",
                    // Base padding that can be overridden by className, but className usually wins for collision
                    // We rely on className to pass in specific padding if needed, or defaults here
                    "px-3 py-2",
                    className
                )}
                type="button"
            >
                <span className="truncate block">
                    {selectedOption ? selectedOption.label : placeholder || "Select..."}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 z-50 bg-[#0F172A] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                    <ul
                        ref={listRef}
                        className="max-h-[240px] overflow-y-auto py-1"
                    >
                        {options.map((option) => (
                            <li
                                key={String(option.value)}
                                onClick={() => {
                                    onChange(String(option.value));
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer transition-colors",
                                    String(option.value) === String(value) ? "bg-[#2563eb]/20 text-[#bfdbfe]" : ""
                                )}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
