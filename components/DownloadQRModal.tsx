"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface DownloadQRModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DownloadQRModal({ isOpen, onClose }: DownloadQRModalProps) {
    // Handle Escape key press
    const handleEsc = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            // Prevent scrolling on body when modal is open
            document.body.style.overflow = "hidden";
        } else {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        }
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, handleEsc]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 pt-[170px]"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="relative bg-white rounded-2xl shadow-2xl max-w-[520px] w-full overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Close Button */}
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full bg-gray-100 text-gray-500 hover:text-black hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#7d3cff]/50"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Download App</h3>
                    <p className="text-gray-500 text-sm mb-6 text-center">
                        Scan the QR code with your phone's camera to download the BANKODE app instantly.
                    </p>
                    
                    <div className="relative w-full aspect-square max-w-[400px] bg-white rounded-xl border border-gray-100 p-2 shadow-inner">
                        <Image
                            src="/QRLogo.png"
                            alt="Download App QR Code"
                            fill
                            className="object-contain p-2"
                            priority
                        />
                    </div>
                    
                    <div className="mt-8 flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[13px] font-medium text-gray-600">Available on Google Play</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
