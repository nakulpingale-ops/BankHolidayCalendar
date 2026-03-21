import Link from "next/link";
import { Footer } from "@/components/Footer";
import { SeoIndex } from "@/components/SeoIndex";

export const metadata = {
    robots: "noindex, nofollow",
};

export default function NotFound() {
    return (
        <div className="flex flex-col min-h-screen bg-[#050508]">
            {/* Header Branding */}
            <header className="w-full pt-6 px-6">
                <div className="w-full max-w-[1050px] mx-auto">
                    <Link href="/" className="inline-flex flex-col">
                        <span className="text-base md:text-xl font-bold tracking-normal text-white hover:opacity-90 transition-opacity leading-none">
                            BankHolidayCalendar<span className="text-white/25">.com</span>
                        </span>
                        <span className="text-xs text-gray-500 font-medium tracking-normal -mt-0.5">
                            a <span className="text-[#7c3cfd] font-bold">HOLBANK</span> product
                        </span>
                    </Link>
                </div>
            </header>

            {/* Main 404 Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
                <div className="text-center space-y-8 max-w-2xl mx-auto">
                    {/* 404 Hero Text */}
                    <h1 className="text-[96px] md:text-[144px] font-black text-white leading-none tracking-tighter">
                        404
                    </h1>

                    {/* Messaging */}
                    <p className="text-[18px] md:text-[20px] text-white/90 leading-relaxed">
                        Looking for a holiday? This page doesn&apos;t exist, but the bank schedule does.
                    </p>

                    {/* CTA Button */}
                    <div className="pt-4">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-4 bg-[#14A900] hover:bg-[#12970a] text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Go Back to 2026 Calendar
                        </Link>
                    </div>
                </div>
            </main>

            {/* Regional SEO Index */}
            <SeoIndex />

            {/* Footer */}
            <Footer />
        </div>
    );
}
