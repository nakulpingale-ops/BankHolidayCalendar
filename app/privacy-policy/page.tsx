import { BrandHeadline } from "@/components/BrandHeadline";

export default function PrivacyPolicyPage() {
    return (
        <div className="fixed inset-0 w-full h-full bg-[#01011c] z-40 overflow-y-auto">
            <div className="w-full min-h-screen pt-[120px] px-4 pb-20">
                <div className="max-w-[800px] mx-auto space-y-8">
                    <header className="space-y-4 text-center">
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">Privacy Policy</h1>
                        <div className="h-1 w-20 bg-[#7d3cff] mx-auto rounded-full"></div>
                    </header>

                    <div className="prose prose-invert prose-lg mx-auto text-[#e5e7eb] leading-relaxed text-left">
                        <p>
                            At <a href="https://www.google.com/search?q=BankHolidayCalendar.com" className="text-[#7d3cff] hover:underline">BankHolidayCalendar.com</a>, we value your privacy. We do not require user registration or collect personal identifiable information (PII).
                        </p>
                        <p>
                            We use third-party advertising companies (like Google AdSense) to serve ads when you visit our website. These companies may use cookies to provide ads about goods and services of interest to you.
                        </p>
                        <p>
                            Our opt-in location detection happens locally on your device; HolBank does not store or share your location data.
                        </p>
                        <p>
                            By using our site, you consent to our use of these non-identifying cookies.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
