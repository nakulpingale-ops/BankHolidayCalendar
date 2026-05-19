import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Disclaimer | Bank Holiday Calendar 2026',
    description: 'Disclaimer regarding the accuracy of bank holiday data provided on this website.',
    alternates: {
        canonical: 'https://bankholidaycalendar.com/disclaimer',
    },
};

export default function DisclaimerPage() {
    return (
        <main className="w-full max-w-[800px] mx-auto px-4 pt-[93px] pb-12 text-gray-300">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-8">Disclaimer</h1>
            <p className="text-sm text-gray-500 mb-8">Last Updated: January 15, 2026</p>

            <section className="mb-8 space-y-4">
                <h2 className="text-xl font-bold text-[#2563eb]">General Information</h2>
                <p>
                    The information provided by Bank Holiday Calendar ("we," "us," or "our") on https://bankholidaycalendar.com (the "Site") is for general informational purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
                </p>
            </section>

            <section className="mb-8 space-y-4">
                <h2 className="text-xl font-bold text-[#2563eb]">Not Professional Advice</h2>
                <p>
                    The site cannot and does not contain financial or legal advice. The bank holiday information is provided for general educational and planning purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals or your local bank branch. We do not provide any kind of financial advice.
                </p>
            </section>

            <section className="mb-8 space-y-4">
                <h2 className="text-xl font-bold text-[#2563eb]">Government Data Changes</h2>
                <p>
                    Bank holiday dates are subject to change by the Reserve Bank of India (RBI) or respective State Governments at any time due to unforeseen circumstances, emergency announcements, or changes in the lunar calendar for festivals. While we strive to keep our data updated, we cannot guarantee that the information on this website will visually reflect real-time government notifications immediately.
                </p>
            </section>

            <section className="mb-8 space-y-4">
                <h2 className="text-xl font-bold text-[#2563eb]">Limitation of Liability</h2>
                <p>
                    Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
                </p>
            </section>

        </main>
    );
}
