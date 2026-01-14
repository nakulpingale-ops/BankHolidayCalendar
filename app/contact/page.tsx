import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | Bank Holiday Calendar 2026',
    description: 'Get in touch with the Bank Holiday Calendar team for corrections, suggestions, or advertising inquiries.',
    alternates: {
        canonical: 'https://bankholidaycalendar.com/contact',
    },
};

export default function ContactPage() {
    return (
        <main className="w-full max-w-[800px] mx-auto px-4 py-12 text-gray-300">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-8">Contact Us</h1>

            <section className="mb-10 space-y-4">
                <p>
                    We value your feedback. Whether you have found a discrepancy in our data, have a suggestion for a new feature, or want to discuss advertising opportunities, we are here to listen.
                </p>
            </section>

            <section className="mb-10 space-y-4">
                <h2 className="text-xl font-bold text-[#7d3cff]">How to Reach Us</h2>
                <p>
                    For all inquiries, please email us at:
                </p>
                <div className="bg-[#1c1c21] border border-white/10 p-6 rounded-lg inline-block">
                    <a href="mailto:support@bankholidaycalendar.com" className="text-xl font-bold text-white hover:text-[#7d3cff] transition-colors">
                        support@bankholidaycalendar.com
                    </a>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                    We aim to respond to all valid queries within 48 hours.
                </p>
            </section>

            <section className="mb-10 space-y-4">
                <h2 className="text-xl font-bold text-[#7d3cff]">Report an Error</h2>
                <p>
                    If you believe a specific holiday date for your state is incorrect, please include the following in your email:
                </p>
                <ul className="list-disc pl-5 space-y-2 marker:text-[#7d3cff]">
                    <li>The State/UT involved.</li>
                    <li>The Date and Name of the holiday.</li>
                    <li>A link to an official government notification or news source verifying the change.</li>
                </ul>
            </section>
        </main>
    );
}
