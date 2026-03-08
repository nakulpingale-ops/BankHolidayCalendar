"use client";

import Link from "next/link";
import Image from "next/image";

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
                            className="h-[32px] md:h-[38px] w-auto"
                        />
                    </Link>
                </div>

                <div className="flex items-center gap-2 md:gap-6 min-w-0 flex-shrink">
                    <Link
                        href="/all-bank-holiday-2026"
                        className="flex items-center gap-1 md:gap-2 text-xs font-medium text-gray-300 hover:text-white transition-colors group flex-shrink-0"
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
                        <span className="md:hidden text-[#ffc61c] text-xs font-bold">2026 List</span>
                        <span className="hidden md:inline">Complete Bank Holiday List 2026</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
