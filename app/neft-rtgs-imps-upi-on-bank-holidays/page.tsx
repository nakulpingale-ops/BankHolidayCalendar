
export default function PaymentSystemsPage() {
    return (
        <div className="fixed inset-0 w-full h-full bg-[#01011c] z-40 overflow-y-auto">
            <div className="w-full min-h-screen pt-[120px] px-4 pb-20">
                <div className="max-w-[800px] mx-auto space-y-12">
                    <header className="space-y-4 text-center">
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white font-inter">
                            NEFT, RTGS, IMPS & UPI on Bank Holidays
                        </h1>
                        <div className="h-1 w-20 bg-[#7d3cff] mx-auto rounded-full"></div>
                    </header>

                    <div className="space-y-10 text-[14px] text-[#e5e7eb] leading-relaxed text-left font-inter">
                        <section className="space-y-4">
                            <h2 className="text-[16px] font-bold text-white uppercase tracking-widest pl-1">ARE ONLINE TRANSFERS AFFECTED?</h2>
                            <p className="pl-1">
                                No. Since December 2020, the Reserve Bank of India (RBI) has made RTGS (Real Time Gross Settlement) available 24x7x365. This means you can transfer large value funds even on Sundays, National Holidays, and Bank Strikes.
                            </p>
                            <p className="pl-1">
                                Similarly, NEFT (National Electronic Funds Transfer), IMPS (Immediate Payment Service), and UPI (Unified Payments Interface) are available round-the-clock.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-[16px] font-bold text-white uppercase tracking-widest pl-1">QUICK REFERENCE TABLE</h2>
                            <div className="overflow-x-auto border border-white/10 rounded-xl">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-white/5 text-white uppercase font-bold text-xs tracking-wider">
                                        <tr>
                                            <th className="px-4 py-3 border-b border-white/10">Mode</th>
                                            <th className="px-4 py-3 border-b border-white/10">Working Days</th>
                                            <th className="px-4 py-3 border-b border-white/10">Holidays/Sun</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        <tr>
                                            <td className="px-4 py-3 text-white font-medium">UPI</td>
                                            <td className="px-4 py-3 text-[#14A900]">Available</td>
                                            <td className="px-4 py-3 text-[#14A900]">Available</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-white font-medium">IMPS</td>
                                            <td className="px-4 py-3 text-[#14A900]">Available</td>
                                            <td className="px-4 py-3 text-[#14A900]">Available</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-white font-medium">NEFT</td>
                                            <td className="px-4 py-3 text-[#14A900]">Available</td>
                                            <td className="px-4 py-3 text-[#14A900]">Available*</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-white font-medium">RTGS</td>
                                            <td className="px-4 py-3 text-[#14A900]">Available</td>
                                            <td className="px-4 py-3 text-[#14A900]">Available*</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-white font-medium">Cheque Clearing</td>
                                            <td className="px-4 py-3 text-[#14A900]">Available</td>
                                            <td className="px-4 py-3 text-red-500">Closed</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="pl-1 text-xs text-gray-500 italic">
                                *Note: While the central systems (RBI) are open, individual bank IT maintenance schedules may occasionally cause downtimes, usually at night.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
