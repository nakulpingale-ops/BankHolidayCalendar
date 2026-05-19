import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sources & Methodology | Bank Holiday Calendar 2026',
    description: 'Learn how we verify and compile official bank holiday data from RBI and State Government notifications to ensure accuracy.',
    alternates: {
        canonical: 'https://bankholidaycalendar.com/sources-methodology',
    },
};

export default function SourcesMethodologyPage() {
    const lastUpdated = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <main className="w-full max-w-[800px] mx-auto px-4 pt-[93px] pb-12 text-gray-300">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Sources & Methodology</h1>
            <p className="text-sm text-gray-500 mb-8">Last verified: {lastUpdated}</p>

            <section className="mb-10 space-y-4">
                <h2 className="text-xl font-bold text-[#2563eb]">What is a Bank Holiday?</h2>
                <p>
                    On our platform, a "Bank Holiday" refers to a day when physical banking branches are closed to the public. This includes:
                </p>
                <ul className="list-disc pl-5 space-y-2 marker:text-[#2563eb]">
                    <li><strong className="text-white">Negotiable Instruments Act Holidays:</strong> State-specific festivals and national events declared by the respective State Governments.</li>
                    <li><strong className="text-white">Weekend Closures:</strong> All Sundays and the 2nd & 4th Saturdays of every month, as mandated by the RBI/IBA.</li>
                </ul>
            </section>

            <section className="mb-10 space-y-4">
                <h2 className="text-xl font-bold text-[#2563eb]">Data Sources</h2>
                <p>
                    Accuracy is our top priority. Our holiday data is not crowd-sourced; it is meticulously compiled from official government and banking regulatory notifications. Our primary sources include:
                </p>
                <ul className="list-disc pl-5 space-y-2 marker:text-[#2563eb]">
                    <li>
                        <strong className="text-white">Reserve Bank of India (RBI):</strong> We refer to the official holiday lists published under the Negotiable Instruments Act, 1881.
                    </li>
                    <li>
                        <strong className="text-white">State Government Gazettes:</strong> Each State and Union Territory in India releases an official annual holiday notification. We cross-reference these gazettes to identify state-specific holidays.
                    </li>
                    <li>
                        <strong className="text-white">Indian Banks' Association (IBA):</strong> We follow IBA guidelines regarding the standard closures on 2nd and 4th Saturdays of every month.
                    </li>
                </ul>
            </section>

            <section className="mb-10 space-y-4">
                <h2 className="text-xl font-bold text-[#2563eb]">Verification Process</h2>
                <p>
                    To ensure reliable planning for our users, we employ a multi-step verification process:
                </p>
                <ol className="list-decimal pl-5 space-y-2 marker:text-[#2563eb]">
                    <li>
                        <strong className="text-white">Initial Collection:</strong> At the end of each year, our team gathers the official holiday notifications released by the RBI and respective State Governments for the upcoming year.
                    </li>
                    <li>
                        <strong className="text-white">Normalization:</strong> We normalize the data to account for different naming conventions of festivals across states (e.g., "Makar Sankranti" vs "Pongal").
                    </li>
                    <li>
                        <strong className="text-white">Banking Rule Application:</strong> We algorithmically apply the 2nd and 4th Saturday closure rules to generate the complete calendar.
                    </li>
                    <li>
                        <strong className="text-white">Periodic Audits:</strong> We periodically check for any mid-year government announcements that might declare a new holiday or modify an existing one.
                    </li>
                </ol>
            </section>

            <section className="mb-10 space-y-4">
                <h2 className="text-xl font-bold text-[#2563eb]">Disclaimer</h2>
                <p>
                    While we strive for 100% accuracy, bank holiday dates can occasionally change due to last-minute government directives (e.g., changes in election dates, passing of a dignitary, or natural calamities). We recommend cross-checking with your local bank branch for critical financial transactions.
                </p>
            </section>
        </main>
    );
}
