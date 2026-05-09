"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";

export function Header() {
    return (
        <header className="fixed top-0 left-0 z-50 w-full pt-4 pb-4 transition-all duration-300 bg-black/20 backdrop-blur-md border-b border-purple-500/20 print:hidden">
            <div className="flex items-center justify-between w-full max-w-none px-4 sm:max-w-[1050px] sm:mx-auto">
                <div className="flex flex-col -ml-4">
                    <Link href="/" className="hover:opacity-90 transition-opacity flex items-center">
                        <Image
                            src="/bankode_combo.svg"
                            alt="Bankode"
                            width={144}
                            height={35}
                            priority
                            className="h-[27px] md:h-[38px] w-auto"
                        />
                    </Link>
                    <span className="hidden md:block text-[10px] text-white pl-[34px] leading-none mt-[-4px] tracking-wide">
                        a <span className="text-[#7d3cff] font-semibold">HOLBANK</span> product
                    </span>
                </div>

                <div className="flex items-center gap-4 md:gap-8 min-w-0 flex-shrink">
                    <Link
                        href="/all-bank-holiday-2026"
                        className="flex items-center gap-1 md:gap-2 text-xs font-medium text-gray-300 hover:text-[#7d3cff] transition-colors group flex-shrink-0"
                        onClick={(e) => {
                            // Scroll to top when clicking, especially for same-page navigation
                            setTimeout(() => {
                                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                            }, 100);
                        }}
                    >
                        <div
                            className="w-4 h-4 bg-[#ffc61c] animate-icon-pulse flex-shrink-0"
                            style={{
                                maskImage: 'url(/lightning.png)',
                                maskSize: 'contain',
                                maskRepeat: 'no-repeat',
                                maskPosition: 'center',
                                WebkitMaskImage: 'url(/lightning.png)',
                                WebkitMaskSize: 'contain',
                                WebkitMaskRepeat: 'no-repeat',
                                WebkitMaskPosition: 'center'
                            }}
                        />
                        <span className="md:hidden text-[#ffc61c] text-xs font-bold whitespace-nowrap">2026 List</span>
                        <span className="hidden md:inline whitespace-nowrap">Complete Bank Holiday List 2026</span>
                    </Link>
                    <Link
                        href="/bank-helplines"
                        className="flex items-center gap-1 md:gap-2 text-xs font-medium text-gray-300 hover:text-[#7d3cff] transition-colors group flex-shrink-0 border-l border-white/10 pl-4"
                        onClick={() => {
                            setTimeout(() => {
                                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                            }, 100);
                        }}
                    >
                        <Phone className="w-3.5 h-3.5 text-[#7d3cff] flex-shrink-0" />
                        <span className="md:hidden text-xs font-bold whitespace-nowrap">Helplines</span>
                        <span className="hidden md:inline whitespace-nowrap">Bank Helplines</span>
                    </Link>
                    <Link
                        href="https://play.google.com/store/apps/details?id=com.holbank.bankholiday"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0 border-l border-white/10 pl-3 md:pl-4"
                        aria-label="Download BANKODE app from Google Play Store"
                    >
                        {/* Mobile Icon */}
                        <Image
                            src="/playstore_icon.png"
                            alt="Download BANKODE on Google Play"
                            width={24}
                            height={24}
                            className="w-[23px] h-auto block md:hidden"
                        />
                        {/* Desktop Badge */}
                        <Image
                            src="/playstore.png"
                            alt="Download BANKODE on Google Play"
                            width={135}
                            height={40}
                            className="hidden md:block w-[135px] h-auto"
                        />
                    </Link>
                </div>
            </div>
        </header>
    );
}
