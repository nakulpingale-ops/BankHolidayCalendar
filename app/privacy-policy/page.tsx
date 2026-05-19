import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Bank Holiday Calendar 2026',
    description: 'Our commitment to protecting your privacy. Learn how we handle your data.',
    alternates: {
        canonical: 'https://bankholidaycalendar.com/privacy-policy',
    },
};

export default function PrivacyPolicyPage() {
    return (
        <main className="w-full max-w-[800px] mx-auto px-4 pt-[93px] pb-12 text-gray-300">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-8">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8">Last Updated: January 15, 2026</p>

            <section className="mb-8 space-y-4">
                <p>
                    At Bank Holiday Calendar, accessible from https://bankholidaycalendar.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Bank Holiday Calendar and how we use it.
                </p>
            </section>

            <section className="mb-8 space-y-4">
                <h2 className="text-xl font-bold text-[#2563eb]">Log Files</h2>
                <p>
                    Bank Holiday Calendar follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as a part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
                </p>
            </section>

            <section className="mb-8 space-y-4">
                <h2 className="text-xl font-bold text-[#2563eb]">Cookies and Web Beacons</h2>
                <p>
                    Like any other website, Bank Holiday Calendar uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
                </p>
            </section>

            <section className="mb-8 space-y-4">
                <h2 className="text-xl font-bold text-[#2563eb]">Google DoubleClick DART Cookie</h2>
                <p>
                    Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" className="text-[#2563eb] hover:underline" rel="nofollow noopener" target="_blank">https://policies.google.com/technologies/ads</a>
                </p>
            </section>

            <section className="mb-8 space-y-4">
                <h2 className="text-xl font-bold text-[#2563eb]">Privacy Policies of Third Party Advertisers</h2>
                <p>
                    You may consult this list to find the Privacy Policy for each of the advertising partners of Bank Holiday Calendar.
                </p>
                <p>
                    Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Bank Holiday Calendar, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
                </p>
                <p>
                    Note that Bank Holiday Calendar has no access to or control over these cookies that are used by third-party advertisers.
                </p>
            </section>

            <section className="mb-8 space-y-4">
                <h2 className="text-xl font-bold text-[#2563eb]">Consent</h2>
                <p>
                    By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
                </p>
            </section>
        </main>
    );
}
