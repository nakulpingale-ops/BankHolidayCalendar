"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, Smartphone, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { DownloadQRModal } from "./DownloadQRModal";

export function AppPromoSection() {
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    // Lightbox handlers
    const closeLightbox = useCallback(() => setSelectedImage(null), []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") setSelectedImage(prev => prev ? (prev === 6 ? 1 : prev + 1) : null);
            if (e.key === "ArrowLeft") setSelectedImage(prev => prev ? (prev === 1 ? 6 : prev - 1) : null);
        };
        if (selectedImage !== null) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
        } else {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [selectedImage, closeLightbox]);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedImage(prev => prev ? (prev === 6 ? 1 : prev + 1) : null);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedImage(prev => prev ? (prev === 1 ? 6 : prev - 1) : null);
    };

    return (
        <section className="w-full pb-12 md:pb-16 pt-4 md:pt-8 text-white relative z-50 print:hidden">
            <div className="w-full max-w-none px-4 sm:max-w-[1050px] sm:mx-auto">
                
                {/* 1. Header Styling Alignment */}
                <div className="flex items-center justify-between mb-[8px]">
                    <div className="flex items-start md:items-center gap-3">
                        <Smartphone className="w-6 h-6 text-[#7d3cff] stroke-[2]" />
                        <h2 className="text-2xl font-bold tracking-tight">Get the Full BANKODE Experience</h2>
                    </div>

                    <div className="flex items-center">
                        {/* Mobile: Link directly to Play Store */}
                        <Link
                            href="https://play.google.com/store/apps/details?id=com.holbank.bankholiday"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block md:hidden hover:opacity-80 transition-opacity"
                            aria-label="Download BANKODE app from Google Play Store"
                        >
                            <Image
                                src="/playstore_icon.png"
                                alt="Download BANKODE on Google Play"
                                width={24}
                                height={24}
                                className="w-[24px] h-auto"
                            />
                        </Link>

                        {/* Desktop: Text CTA that opens QR modal */}
                        <button
                            onClick={() => setIsQRModalOpen(true)}
                            className="hidden md:flex items-center gap-2 text-xs font-medium text-gray-300 hover:text-[#7d3cff] transition-colors group"
                            aria-label="Open download QR code modal"
                        >
                            <Download className="w-3.5 h-3.5 text-[#7d3cff]" />
                            <span className="whitespace-nowrap">Download App</span>
                        </button>
                    </div>
                </div>

                {/* 2. Bounding Width Fix & 5. Internal Padding Cleanup */}
                <div className="w-full bg-[#121212]/80 backdrop-blur-sm border-[0.25px] border-[#7d3cff]/45 rounded-xl p-6 md:p-10 shadow-xl flex flex-col items-center">
                    
                    <p className="text-gray-400 text-[14px] leading-relaxed mb-10 max-w-3xl text-center">
                        Track bank holidays, plan smart leaves, receive holiday notifications, explore long weekends, and access state-wise calendars — all in one beautifully designed app built for bank employees and everyday planners.
                    </p>

                    {/* 3. Screenshot Size and Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 w-full mb-12 max-w-5xl">
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                            <button 
                                key={num}
                                onClick={() => setSelectedImage(num)}
                                className="relative aspect-[9/19] w-full rounded-[20px] overflow-hidden border border-[#8b5cf6]/20 bg-black/40 shadow-xl group hover:-translate-y-1 hover:scale-[1.02] transition-all duration-250 ease-out focus:outline-none focus:ring-2 focus:ring-[#7d3cff]/50 cursor-pointer"
                                aria-label={`View enlarged app screenshot ${num}`}
                            >
                                <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-colors duration-250 z-10 pointer-events-none" />
                                <Image
                                    src={`/SS_1080x1920_${num}.png`}
                                    alt={`BANKODE App Screenshot ${num}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-200"
                    onClick={closeLightbox}
                >
                    <button 
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 z-50"
                        aria-label="Close screenshot preview"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    
                    <div className="flex items-center gap-2 sm:gap-[24px] max-w-full">
                        {/* Previous Button */}
                        <button 
                            onClick={handlePrev}
                            className="p-2 sm:p-3 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 z-50 shrink-0"
                            aria-label="Previous screenshot"
                        >
                            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                        </button>
                        
                        <div 
                            className="relative h-[85vh] max-h-[900px] w-auto aspect-[9/19] max-w-[calc(100vw-120px)] sm:max-w-[70vw] rounded-[16px] md:rounded-[24px] overflow-hidden shadow-[0_0_50px_rgba(125,60,255,0.15)] animate-in zoom-in-95 duration-200 shrink"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={`/SS_1080x1920_${selectedImage}.png`}
                                alt={`Enlarged BANKODE App Screenshot ${selectedImage}`}
                                fill
                                className="object-contain bg-[#0e0a18]"
                                sizes="(max-width: 768px) 90vw, 80vw"
                                priority
                            />
                        </div>

                        {/* Next Button */}
                        <button 
                            onClick={handleNext}
                            className="p-2 sm:p-3 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 z-50 shrink-0"
                            aria-label="Next screenshot"
                        >
                            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                        </button>
                    </div>
                </div>
            )}

            <DownloadQRModal 
                isOpen={isQRModalOpen} 
                onClose={() => setIsQRModalOpen(false)} 
            />
        </section>
    );
}
