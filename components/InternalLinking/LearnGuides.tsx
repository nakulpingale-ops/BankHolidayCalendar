
import Link from "next/link";
import { BookOpen } from "lucide-react";

export function LearnGuides() {
    return (
        <section className="mb-12 bg-gradient-to-br from-[#7d3cff]/10 to-transparent border border-[#7d3cff]/20 rounded-xl p-6 print:hidden">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#7d3cff]" />
                Learn about Banking Closures
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/second-fourth-saturday-bank-holidays"
                    className="flex-1 bg-black/20 hover:bg-[#7d3cff]/20 border border-white/10 hover:border-[#7d3cff]/30 p-4 rounded-xl transition-all group"
                >
                    <h4 className="text-white font-bold text-sm mb-1 group-hover:text-[#7d3cff] transition-colors">2nd & 4th Saturday Rules</h4>
                    <p className="text-gray-400 text-xs">Why banks close on specific Saturdays and how it affects you.</p>
                </Link>
                <Link
                    href="/banking-services-on-holidays"
                    className="flex-1 bg-black/20 hover:bg-[#7d3cff]/20 border border-white/10 hover:border-[#7d3cff]/30 p-4 rounded-xl transition-all group"
                >
                    <h4 className="text-white font-bold text-sm mb-1 group-hover:text-[#7d3cff] transition-colors">Services on Holidays</h4>
                    <p className="text-gray-400 text-xs">What stays open during national and state holidays.</p>
                </Link>
                <Link
                    href="/neft-rtgs-imps-upi-on-bank-holidays"
                    className="flex-1 bg-black/20 hover:bg-[#7d3cff]/20 border border-white/10 hover:border-[#7d3cff]/30 p-4 rounded-xl transition-all group"
                >
                    <h4 className="text-white font-bold text-sm mb-1 group-hover:text-[#7d3cff] transition-colors">Online Transfers</h4>
                    <p className="text-gray-400 text-xs">NEFT, RTGS, IMPS & UPI availability guide.</p>
                </Link>
            </div>
        </section>
    );
}
