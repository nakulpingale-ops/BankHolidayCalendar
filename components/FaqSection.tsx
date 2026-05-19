"use client";

import { useState } from "react";
import { MessageCircleQuestion, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
    question: string;
    answer: string;
}

export const FAQ_DATA: FaqItem[] = [
    {
        question: "Does the Bank Holiday Calendar 2026 include second and fourth Saturdays?",
        answer: "Yes. Banks are closed on the 2nd and 4th Saturdays of every month. Banks are fully operational on the 1st, 3rd, and 5th Saturdays, provided no other statutory holiday falls on that day. \n\nQuick Reference:\n• 1st Saturday: OPEN\n• 2nd Saturday: CLOSED\n• 3rd Saturday: OPEN\n• 4th Saturday: CLOSED\n• 5th Saturday: OPEN (if applicable)"
    },
    {
        question: "Do UPI, NEFT, and RTGS work on bank holidays?",
        answer: "Yes. Digital payment channels like UPI, IMPS, NEFT, and RTGS are available 24/7, 365 days a year, even on Sundays and National Holidays. However, transactions requiring manual intervention at the branch will not be processed."
    },
    {
        question: "Will my cheque clear if the bank is closed today?",
        answer: "No. Cheque Clearing is a physical settlement process (CTS) that only operates on working days. If you deposit a cheque on a holiday or non-working Saturday, it will be processed on the next working day."
    },
    {
        question: "How do I check state-specific dates in the Bank Holiday Calendar 2026?",
        answer: "Use the dropdown selector at the top of the page. While some holidays (like Republic Day or Independence Day) are national, most are state-specific. For example, banks in Maharashtra may be closed for Gudi Padwa, while banks in Delhi remain open."
    },
    {
        question: "How many holidays are listed in the Bank Holiday Calendar 2026?",
        answer: "The number varies by state, but typically includes 3 National Holidays, state-specific festivals, and all Sundays and 2nd/4th Saturdays."
    },
    {
        question: "Are Forex (Foreign Exchange) windows open on holidays?",
        answer: "Generally, no. Forex services are linked to currency market hours. If the interbank forex market is closed due to a holiday, branch-based forex transactions and rates may not be available until the next working day."
    },
    {
        question: "Can I access my bank locker on a holiday?",
        answer: "No. Bank lockers are located inside the branch strong room. Since the physical branch is locked on public holidays and Sundays, you cannot access safe deposit lockers until the branch reopens."
    }
];

export function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-12 border-t border-white/5 w-full">
            <div className="w-full max-w-none px-4 sm:max-w-[1050px] sm:mx-auto">
                <div className="flex items-center gap-3 mb-[14px]">
                    <MessageCircleQuestion className="w-6 h-6 text-[#2563eb]" />
                    <h3 className="text-2xl font-bold text-white tracking-tight">FAQs</h3>
                </div>

                <div className="flex flex-col gap-[11px]">
                    {FAQ_DATA.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className={cn(
                                    "group rounded-xl bg-[#121212]/80 backdrop-blur-sm border border-[#2563eb]/45 overflow-hidden transition-all duration-300",
                                    "hover:shadow-[0_0_15px_rgba(125,60,255,0.15)] hover:border-[#2563eb]",
                                    isOpen ? "border-[#2563eb] bg-[#121212]" : ""
                                )}
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-center justify-between pl-9 pr-6 py-5 text-left transition-colors"
                                    aria-expanded={isOpen}
                                >
                                    <span className={cn(
                                        "text-[14px] font-medium transition-colors",
                                        isOpen ? "text-white" : "text-gray-200 group-hover:text-blue-200"
                                    )}>
                                        {faq.question}
                                    </span>
                                    <span className="ml-4 flex-shrink-0 text-gray-400 group-hover:text-white transition-colors">
                                        {isOpen ? <ChevronUp className="w-5 h-5 text-[#2563eb]" /> : <ChevronDown className="w-5 h-5" />}
                                    </span>
                                </button>

                                <div
                                    className={cn(
                                        "grid transition-all duration-300 ease-in-out",
                                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                    )}
                                >
                                    <div className="overflow-hidden pl-9 pr-6">
                                        <div className="pb-5 pt-0">
                                            <p className="text-gray-400 leading-relaxed text-[14px]">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
