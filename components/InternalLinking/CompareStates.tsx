
import Link from "next/link";
import { stateToSlug } from "@/lib/constants";

const COMPARE_STATES = [
    "Maharashtra",
    "Delhi",
    "Karnataka",
    "Tamil Nadu",
    "Uttar Pradesh",
    "West Bengal",
    "Gujarat",
    "Telangana"
];

export function CompareStates({ currentState }: { currentState: string }) {
    // Filter out the current state so we don't link to self
    const statesToShow = COMPARE_STATES.filter(s => s !== currentState);

    return (
        <section className="mb-3 bg-[#0e0a18]/50 border border-white/5 rounded-xl p-6 print:hidden">
            <h3 className="text-lg font-bold text-white mb-4">Compare with other states</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {statesToShow.map(state => (
                    <Link
                        key={state}
                        href={`/${stateToSlug(state)}-bank-holiday-2026`}
                        className="text-sm text-gray-400 hover:text-[#2563eb] transition-colors"
                    >
                        {state} Holidays 2026
                    </Link>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 text-center">
                <Link href="/all-bank-holiday-2026" className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-wider font-bold">
                    View All States
                </Link>
            </div>
        </section>
    );
}
