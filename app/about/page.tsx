
export default function AboutPage() {
    return (
        <div className="fixed inset-0 w-full h-full bg-[#01011c] z-40 overflow-y-auto">
            <div className="w-full min-h-screen pt-[120px] px-4 pb-20">
                <div className="max-w-[800px] mx-auto space-y-12">
                    {/* Page Header */}
                    <header className="space-y-4 text-center">
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white font-inter">About HolBank</h1>
                        <div className="h-1 w-20 bg-[#7d3cff] mx-auto rounded-full"></div>
                    </header>

                    {/* Content Sections */}
                    <div className="space-y-10 text-[14px] text-[#e5e7eb] leading-relaxed text-left font-inter">

                        {/* Task 1: The Mission Statement */}
                        <section className="space-y-4">
                            <h2 className="text-[16px] font-bold text-white uppercase tracking-widest pl-1">ABOUT HOLBANK</h2>
                            <p className="pl-1">
                                HolBank is a dedicated financial utility network designed to simplify the complexities of the Indian banking calendar. We provide split-second, verified data for bank holidays, regional closures, and market statuses across all States and Union Territories.
                            </p>
                        </section>

                        {/* Task 2: The Project Ecosystem (IP Authority) */}
                        <section className="space-y-4">
                            <h2 className="text-[16px] font-bold text-white uppercase tracking-widest pl-1">OUR ECOSYSTEM</h2>
                            <div className="space-y-4 pl-1">
                                <p>
                                    We specialize in niche financial tracking utilities. Our network includes <a href="https://saturdaytracker.com" target="_blank" rel="noopener noreferrer" className="text-[#7d3cff] hover:underline font-bold">SaturdayTracker.com</a>, a dedicated tool for identifying bank working Saturdays (2nd and 4th Saturday rules), helping users plan their branch visits with 100% certainty.
                                </p>
                                <p>
                                    In the future, we are expanding our intellectual property to include specialized tools like <span className="text-[#14A900] font-bold">BankHolidayList.com</span> and <span className="text-[#14A900] font-bold">PlanLongWeekends.com</span> to further empower Indian banking customers.
                                </p>
                            </div>
                        </section>

                        {/* Task 3: Data Integrity & Transparency */}
                        <section className="space-y-4">
                            <h2 className="text-[16px] font-bold text-white uppercase tracking-widest pl-1">VERIFIED DATA</h2>
                            <div className="space-y-5 pl-1">
                                <p>
                                    Our data is processed locally for maximum speed and privacy. We synthesize information from the Reserve Bank of India (RBI) circulars, state gazettes, and official bank notices. Every entry in our 2026 calendar is verified to ensure the highest level of accuracy for RTGS, NEFT, and clearing house operations.
                                </p>

                                {/* Typography & Bullet Points */}
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-4">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#14A900] mt-[5px] flex-shrink-0 shadow-[0_0_8px_rgba(20,169,0,0.4)]"></div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[#14A900] font-black uppercase text-[12px] tracking-widest leading-none">ACTIVE STATUS</span>
                                            <p>Data integrity verified via RBI circulars and Official Gazettes.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#14A900] mt-[5px] flex-shrink-0 shadow-[0_0_8px_rgba(20,169,0,0.4)]"></div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[#14A900] font-black uppercase text-[12px] tracking-widest leading-none">REAL-TIME ACCURACY</span>
                                            <p>Processed locally for maximum user privacy and speed.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
