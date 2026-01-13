
export default function BankingServicesPage() {
    return (
        <div className="fixed inset-0 w-full h-full bg-[#01011c] z-40 overflow-y-auto">
            <div className="w-full min-h-screen pt-[120px] px-4 pb-20">
                <div className="max-w-[800px] mx-auto space-y-12">
                    <header className="space-y-4 text-center">
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white font-inter">
                            Banking Services on Holidays
                        </h1>
                        <div className="h-1 w-20 bg-[#7d3cff] mx-auto rounded-full"></div>
                    </header>

                    <div className="space-y-10 text-[14px] text-[#e5e7eb] leading-relaxed text-left font-inter">
                        <section className="space-y-4">
                            <h2 className="text-[16px] font-bold text-white uppercase tracking-widest pl-1">WHAT STAYS OPEN?</h2>
                            <p className="pl-1">
                                When banks are closed for national holidays, state festivals, or Sundays, “brick-and-mortar” branch services are unavailable. However, modern banking infrastructure ensures that you are never cut off from your funds.
                            </p>
                            <ul className="space-y-2 list-disc pl-5">
                                <li><strong>ATMs:</strong> Fully functional for cash withdrawals and balance enquiries.</li>
                                <li><strong>Cash Deposit Machines (CDMs):</strong> Available 24/7 in e-lobbies.</li>
                                <li><strong>Online Banking:</strong> Full access to dashboard, statements, and transfers.</li>
                                <li><strong>Mobile Apps:</strong> All app-based features remain active.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-[16px] font-bold text-white uppercase tracking-widest pl-1">WHAT IS CLOSED?</h2>
                            <ul className="space-y-2 list-disc pl-5">
                                <li><strong>Branch Counters:</strong> No teller services (cash deposit/withdrawal in person).</li>
                                <li><strong>Cheque Clearing:</strong> The Cheque Truncation System (CTS) does not process batches on holidays.</li>
                                <li><strong>Forex Desks:</strong> Foreign exchange rates and physical currency exchange are typically unavailable.</li>
                                <li><strong>Lockers:</strong> Access to safe deposit lockers is restricted as strong rooms are locked.</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
