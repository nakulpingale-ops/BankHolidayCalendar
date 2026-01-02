"use client";

import React, { useEffect } from "react";
import { Check } from "lucide-react";

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

export function Toast({ message, isVisible, onClose }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 bg-[#0a0a0a]/90 backdrop-blur-md border border-[#7d3cff]/50 rounded-full shadow-[0_0_15px_rgba(125,60,255,0.3)] animate-toast-enter">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/20 border border-green-500/50">
                <Check className="w-3 h-3 text-green-400" strokeWidth={3} />
            </div>
            <span className="text-white text-sm font-medium tracking-wide">
                {message}
            </span>
        </div>
    );
}
