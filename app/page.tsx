import { Hero } from "@/components/Hero";
import { HolidayList } from "@/components/HolidayList";
import Link from "next/link";


import { CalendarEntrySection } from "@/components/CalendarEntrySection";
import { AdSensePlaceholder } from "@/components/AdSensePlaceholder";
import { SeoArticle } from "@/components/SeoArticle";
import { FaqSection } from "@/components/FaqSection";
import { BrandHeadline } from "@/components/BrandHeadline";


import { AlertCircle, CheckCircle, PhoneCall, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import { HomeVerificationLines } from "@/components/HomeVerificationLines";

export const metadata: Metadata = {
    title: "Official Bank Holiday Calendar 2026 - India State/UT Wise",
    description: "Official Bank Holiday Calendar 2026 for all Indian States/UTs. Check bank open/closed status, RBI 2nd/4th Saturday closures, and festival holidays.",
    alternates: {
        canonical: "https://bankholidaycalendar.com",
    },
    openGraph: {
        title: "Official Bank Holiday Calendar 2026 - India",
        description: "Official Bank Holiday Calendar 2026 for all Indian States/UTs. Check bank open/closed status, RBI 2nd/4th Saturday closures, and festival holidays.",
        url: "https://bankholidaycalendar.com",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Official Bank Holiday Calendar 2026 - India",
        description: "Official Bank Holiday Calendar 2026 for all Indian States/UTs. Check bank open/closed status, RBI 2nd/4th Saturday closures, and festival holidays.",
    }
};

export default function Home() {
    return (
        <main className="flex flex-col gap-8 sm:gap-10 w-full py-8 mt-[10px]">
            {/* Page Header */}
            <header className="w-full max-w-none px-4 sm:max-w-[1100px] sm:mx-auto text-center mt-4 sm:mt-8">
                <h1 className="font-black text-white uppercase tracking-tighter leading-none">
                    <span className="block text-3xl sm:text-5xl text-white break-words text-balance">INDIA BANK HOLIDAY CALENDAR 2026</span>
                </h1>


                {/* Disclaimers - Dynamic Component */}
                <HomeVerificationLines />
            </header>

            {/* Hero Section: Today / Tomorrow */}
            <Hero />

            {/* Complete Holiday List */}
            <HolidayList />




            <div className="print:hidden">
                <AdSensePlaceholder />
            </div>

            {/* Calendar Entry Section */}
            <div className="print:hidden">
                <CalendarEntrySection />
            </div>

            {/* Bank Helplines CTA */}
            <section className="w-full py-8 text-white relative z-50 -mt-[25px] mb-0 print:hidden">
                <div className="w-full max-w-none px-4 sm:max-w-[1050px] sm:mx-auto">
                    <div className="flex items-start md:items-center gap-3 mb-[8px]">
                        <PhoneCall className="w-6 h-6 text-[#7d3cff]" />
                        <h2 className="text-2xl font-bold tracking-tight">Need to Contact Your Bank?</h2>
                    </div>

                    <div className="w-full bg-[#121212]/80 backdrop-blur-sm border-[0.25px] border-[#7d3cff]/45 rounded-xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                        <div className="w-full">
                            <p className="text-gray-400 text-[14px] leading-relaxed mt-2">
                                Access verified customer care helplines for major banks in India. <br />
                                Quickly report fraud, block your card, or get immediate support from authorized bank representatives.
                            </p>
                        </div>

                        <Link
                            href="/bank-helplines"
                            className="w-full h-14 bg-[#7d3cff] hover:bg-[#8b52ff] text-white text-sm font-medium px-8 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-lg shadow-purple-500/10"
                        >
                            View Bank Helplines
                            <ArrowRight className="w-5 h-5 text-white" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <div className="print:hidden">
                <FaqSection />
            </div>

            {/* SEO Article */}
            <div className="print:hidden">
                <SeoArticle />
            </div>

            {/* Brand Headline */}
            <div className="print:hidden">
                <BrandHeadline />
            </div>
        </main>
    );
}
