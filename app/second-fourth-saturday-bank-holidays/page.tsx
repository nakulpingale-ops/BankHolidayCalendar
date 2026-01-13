
export default function SaturdayRulesPage() {
    return (
        <div className="fixed inset-0 w-full h-full bg-[#01011c] z-40 overflow-y-auto">
            <div className="w-full min-h-screen pt-[120px] px-4 pb-20">
                <div className="max-w-[800px] mx-auto space-y-12">
                    <header className="space-y-4 text-center">
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white font-inter">
                            Second & Fourth Saturday Bank Holidays
                        </h1>
                        <div className="h-1 w-20 bg-[#7d3cff] mx-auto rounded-full"></div>
                    </header>

                    <div className="space-y-10 text-[14px] text-[#e5e7eb] leading-relaxed text-left font-inter">
                        <section className="space-y-4">
                            <h2 className="text-[16px] font-bold text-white uppercase tracking-widest pl-1">THE RBI RULE EXPLAINED</h2>
                            <p className="pl-1">
                                Since 2015, the Reserve Bank of India (RBI) has mandated that all public and private sector banks in India generally remain closed on the <strong>second</strong> and <strong>fourth</strong> Saturdays of every month. This rule applies uniformly across all States and Union Territories.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-[16px] font-bold text-white uppercase tracking-widest pl-1">WHICH SATURDAYS ARE WORKING?</h2>
                            <div className="space-y-4 pl-1">
                                <ul className="space-y-2 list-disc pl-5">
                                    <li><strong>1st Saturday:</strong> Working Day (Full Day)</li>
                                    <li><strong>2nd Saturday:</strong> HOLIDAY (Closed)</li>
                                    <li><strong>3rd Saturday:</strong> Working Day (Full Day)</li>
                                    <li><strong>4th Saturday:</strong> HOLIDAY (Closed)</li>
                                    <li><strong>5th Saturday:</strong> Working Day (if the month has 5 Saturdays)</li>
                                </ul>
                                <p>
                                    Note: If a 1st or 3rd Saturday coincides with a notified National or State holiday (e.g., Gandhi Jayanti), the bank will remain closed.
                                </p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-[16px] font-bold text-white uppercase tracking-widest pl-1">DIGITAL BANKING STATUS</h2>
                            <p className="pl-1">
                                Even on closed Saturdays, digital banking channels remain fully operational. You can continue to use:
                            </p>
                            <ul className="space-y-2 list-disc pl-5">
                                <li>UPI (Unified Payments Interface)</li>
                                <li>Net Banking (IMPS/NEFT/RTGS)</li>
                                <li>Mobile Banking Apps</li>
                                <li>ATMs and Cash Deposit Machines</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
