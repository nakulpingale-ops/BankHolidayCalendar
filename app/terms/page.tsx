import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Use | Bank Holiday Calendar 2026',
    description: 'Terms and conditions for using Bank Holiday Calendar.',
    alternates: {
        canonical: 'https://bankholidaycalendar.com/terms',
    },
};

export default function TermsPage() {
    return (
        <main className="w-full max-w-[800px] mx-auto px-4 pt-[93px] pb-12 text-gray-300">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-8">Terms of Use</h1>
            <p className="text-sm text-gray-500 mb-8">Last Updated: January 15, 2026</p>

            <section className="mb-8 space-y-4">
                <h2 className="text-xl font-bold text-[#2563eb]">1. Acceptance of Terms</h2>
                <p>
                    By accessing and using Bank Holiday Calendar, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
            </section>

            <section className="mb-8 space-y-4">
                <h2 className="text-xl font-bold text-[#2563eb]">2. Use License</h2>
                <p>
                    Permission is granted to temporarily download one copy of the materials (information or software) on Bank Holiday Calendar's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license, you may not:
                </p>
                <ul className="list-disc pl-5 space-y-1 marker:text-[#2563eb]">
                    <li>modify or copy the materials;</li>
                    <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                    <li>attempt to decompile or reverse engineer any software contained on Bank Holiday Calendar's website;</li>
                    <li>remove any copyright or other proprietary notations from the materials; or</li>
                    <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                </ul>
            </section>

            <section className="mb-8 space-y-4">
                <h2 className="text-xl font-bold text-[#2563eb]">3. Disclaimer</h2>
                <p>
                    The materials on Bank Holiday Calendar's website are provided on an 'as is' basis. Bank Holiday Calendar makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
            </section>

            <section className="mb-8 space-y-4">
                <h2 className="text-xl font-bold text-[#2563eb]">4. Accuracy of Materials</h2>
                <p>
                    The materials appearing on Bank Holiday Calendar's website could include technical, typographical, or photographic errors. Bank Holiday Calendar does not warrant that any of the materials on its website are accurate, complete, or current. Bank Holiday Calendar may make changes to the materials contained on its website at any time without notice. However, Bank Holiday Calendar does not make any commitment to update the materials.
                </p>
            </section>
        </main>
    );
}
