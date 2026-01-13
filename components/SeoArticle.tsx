import { cn } from "@/lib/utils";

export function SeoArticle() {
    return (
        <article className="w-full max-w-none px-4 sm:max-w-[1050px] sm:mx-auto pb-8 prose prose-invert break-words">
            <div className="prose prose-invert max-w-none 
                prose-p:text-[14px] prose-p:leading-relaxed prose-p:text-gray-400 
                prose-h2:text-[18px] prose-h2:font-bold prose-h2:text-transparent prose-h2:bg-clip-text prose-h2:bg-gradient-to-r prose-h2:from-white prose-h2:to-purple-200 prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-[16px] prose-h3:font-semibold prose-h3:text-white prose-h3:mt-6
                prose-a:text-[#7d3cff] prose-a:no-underline hover:prose-a:text-[#6c2ee0]
                prose-strong:text-white prose-li:text-gray-300 prose-li:text-[14px]
                prose-ul:my-4 prose-li:my-1">

                <h1 className="text-3xl font-bold mb-6 tracking-tight bg-gradient-to-r from-white via-purple-100 to-gray-400 bg-clip-text text-transparent">
                    Comprehensive Guide to Indian Bank Holidays & Service Availability
                </h1>

                <p>
                    Understanding bank holidays in India can be confusing due to the mix of national regulations and state-specific holidays.
                    Whether you are planning a financial transaction or need to visit a branch physically, knowing the rules governing bank operations is crucial.
                    This guide clarifies the regulations set by the <strong className="text-purple-200">Reserve Bank of India (RBI)</strong> and the Negotiable Instruments Act, 1881.
                </p>

                <h2 className="flex items-center gap-3">
                    <span className="w-1 h-6 bg-[#7d3cff] rounded-full"></span>
                    The Negotiable Instruments Act, 1881 (Section 25)
                </h2>
                <p>
                    Bank holidays in India are governed by the <strong>Negotiable Instruments Act, 1881</strong>.
                    Under Section 25 of this act, the government declares public holidays where banks must remain closed.
                    These include three national holidays: Republic Day (January 26), Independence Day (August 15), and Gandhi Jayanti (October 2).
                    Additionally, the act empowers state governments to declare holidays specific to their region, such as Maharashtra Day or Kannada Rajyotsava.
                </p>

                <h2 className="flex items-center gap-3">
                    <span className="w-1 h-6 bg-[#7d3cff] rounded-full"></span>
                    The "2nd and 4th Saturday" Rule
                </h2>
                <p>
                    In 2015, the Reserve Bank of India (RBI) and the Indian Banks' Association (IBA) reached a settlement regarding Saturday working hours.
                    Prior to this, banks worked half-days on all Saturdays. The new rule, effective from September 2015, states that:
                </p>
                <ul className="list-none pl-0 space-y-4 my-6">
                    <li className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
                        <span><strong>Banks are closed</strong> on the 2nd and 4th Saturdays of every month.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span>
                        <span><strong>Banks are OPEN</strong> on the 1st, 3rd, and 5th Saturdays (if a month has five Saturdays), provided it is not a notified public holiday.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
                        <span><strong>Sundays</strong> are mandatory weekly offs for all banking institutions.</span>
                    </li>
                </ul>
                <p>
                    It is important to note that if a 1st or 3rd Saturday coincides with a public holiday (e.g., Gandhi Jayanti falls on a 1st Saturday), the bank will remain closed.
                </p>

                <h2 className="flex items-center gap-3">
                    <span className="w-1 h-6 bg-[#7d3cff] rounded-full"></span>
                    Gazetted vs. State-Specific Holidays
                </h2>
                <p>
                    India's banking holidays are classified into different categories by the RBI:
                </p>
                <ul className="my-6 space-y-2">
                    <li><strong>Holiday under Negotiable Instruments Act:</strong> These are the holidays we check for daily availability.</li>
                    <li><strong>Holiday under Negotiable Instruments Act and Real Time Gross Settlement Holiday:</strong> Days when RTGS services might be suspended (rare, as digital is mostly 24/7 now).</li>
                    <li><strong>Banks' Closing of Accounts:</strong> Usually April 1st, where banks are open for internal work but closed for public dealing.</li>
                </ul>
                <p>
                    State holidays play a massive role. A bank might be open in Delhi but closed in Mumbai on the same day due to a local festival like Ganesh Chaturthi.
                    Always verify the state-specific calendar.
                </p>

                <h2 className="flex items-center gap-3">
                    <span className="w-1 h-6 bg-[#7d3cff] rounded-full"></span>
                    Digital Banking: 24/7 Availability
                </h2>
                <p>
                    Even when bank branches are physically closed, modern digital banking infrastructure ensures that your money is not locked up.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">
                    {['UPI', 'IMPS', 'RTGS', 'NEFT'].map(service => (
                        <div key={service} className="bg-white/5 border border-white/10 p-4 rounded-[4px] flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            <span className="font-bold text-white">{service}</span>
                            <span className="text-xs text-green-400 font-mono ml-auto">24/7 ACTIVE</span>
                        </div>
                    ))}
                </div>

                <div className="bg-gradient-to-r from-[#7d3cff]/10 to-blue-900/10 border-l-4 border-[#7d3cff] p-6 my-8 rounded-r-lg">
                    <p className="font-bold text-purple-200 mb-2 font-display uppercase tracking-widest text-sm">Pro Tip</p>
                    <p className="text-gray-300 m-0">Always schedule high-value clearing transactions before known holiday streaks to avoid delays.</p>
                </div>
            </div>
        </article>
    );
}
