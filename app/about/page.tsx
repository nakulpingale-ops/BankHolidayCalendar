import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | Bank Holiday Calendar 2026',
    description: 'Helping millions of Indians plan their financial year with accurate, state-wise bank holiday data.',
    alternates: {
        canonical: 'https://bankholidaycalendar.com/about',
    },
};

export default function AboutPage() {
    return (
        <main className="w-full max-w-[800px] mx-auto px-4 pt-[93px] pb-12 text-gray-300">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-8">About Us</h1>

            <section className="mb-10 space-y-4">
                <p>
                    Welcome to <strong className="text-white">BankHolidayCalendar.com</strong>, your most trusted resource for tracking banking holidays in India.
                </p>
                <p>
                    In a country as diverse as India, bank holidays vary significantly from state to state. What is a working day in Mumbai might be a bank closure in Kolkata. Keeping track of these variations, along with the standard 2nd and 4th Saturday closures, can be confusing for businesses and individuals alike.
                </p>
                <p>
                    We built this platform to solve that specific problem.
                </p>
            </section>

            <section className="mb-10 space-y-4">
                <h2 className="text-xl font-bold text-[#2563eb]">Our Mission</h2>
                <p>
                    Our mission is to simplify financial planning for every Indian. By providing a clean, accurate, and easy-to-use calendar of bank holidays, we help you avoid wasted trips to the bank and plan your transactions, EMIs, and investments better.
                </p>
            </section>

            <section className="mb-10 space-y-4">
                <h2 className="text-xl font-bold text-[#2563eb]">Why Trust Us?</h2>
                <ul className="list-disc pl-5 space-y-2 marker:text-[#2563eb]">
                    <li>
                        <strong className="text-white">State-Specific Accuracy:</strong> We don't just show a generic national list. We drill down to state-level specific holidays.
                    </li>
                    <li>
                        <strong className="text-white">Up-to-Date 2026 Data:</strong> Our calendars are updated to reflect the latest official notifications for 2026.
                    </li>
                    <li>
                        <strong className="text-white">User-Centric Design:</strong> We prioritize speed, readability, and ease of use on both mobile and desktop.
                    </li>
                </ul>
            </section>
        </main>
    );
}
