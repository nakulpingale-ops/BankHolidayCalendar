import { useState, useEffect } from "react";
import { BankStatus } from "@/lib/logic";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface StatusCardProps {
    label: string; // "TODAY" or "TOMORROW"
    date: Date;
    state: string;
    status: BankStatus;
    headingLevel?: "h1" | "h2";
}

export function StatusCard({ label, date, state, status, headingLevel = "h2" }: StatusCardProps) {
    const isDigitalOpen = true;
    const isPhysicalOpen = status.isOpen;

    // ... existing status logic ...

    const HeadingTag = headingLevel;

    // Theme configuration based on status
    const theme = status.isOpen
        ? {
            boxBg: "bg-[#14a900]",
            boxBorder: "",
            boxGlow: "shadow-[0_0_20px_rgba(20,169,0,0.1)]"
        }
        : {
            boxBg: "bg-[#850000]",
            boxBorder: "",
            boxGlow: "shadow-[0_0_20px_rgba(133,0,0,0.1)]"
        };

    // ... (rest of the component logic until return statement)

    const services = [
        { name: "RTGS / NEFT", available: isDigitalOpen },
        { name: "UPI / IMPS", available: isDigitalOpen },
        { name: "Cheque Clearing", available: isPhysicalOpen },
        { name: "Forex Windows", available: isPhysicalOpen },
    ];

    // Tooltip logic removed natively inline.

    const [flash, setFlash] = useState(false);

    // Trigger pulse animation on state change
    useEffect(() => {
        setFlash(true);
        const timer = setTimeout(() => setFlash(false), 250);
        return () => clearTimeout(timer);
    }, [state]);

    // Flash theme configuration
    const flashTheme = status.isOpen
        ? "shadow-[0_0_30px_rgba(20,169,0,0.25)] bg-[#14a900]"
        : "shadow-[0_0_30px_rgba(133,0,0,0.5)] bg-[#850000]";

    return (
        <div
            className={`w-full flex flex-col h-full rounded-xl border-[0.5px] px-4 sm:px-6 pt-3 pb-5 sm:py-5 relative overflow-hidden transition-colors duration-150 group/card ${flash
                ? "border-[#7d3cff] bg-[#7d3cff]/10 shadow-[0_0_30px_rgba(125,60,255,0.3)]"
                : `${status.isOpen ? "border-[#14a900]" : "border-[#850000]"} bg-[#0E0B18] backdrop-blur-sm shadow-xl`
                } min-h-[220px] md:min-h-0`}
        >
            {/* Header Area - Refactored for Mobile 2-Row Layout */}
            <HeadingTag className="flex flex-col gap-0.5 mt-4 mb-[3px] w-full md:block relative">
                {/* Mobile Row 1: Label + Date */}
                <span className="flex justify-between items-start md:contents w-full">
                    <span className="text-xl text-white font-medium tracking-normal whitespace-nowrap md:whitespace-normal md:text-left md:block md:w-full order-1 md:order-none">Are banks open</span>

                    {/* Date - Relative on Mobile, Absolute on Desktop */}
                    <span className="text-gray-400 font-medium text-lg whitespace-nowrap order-2 md:order-none md:absolute md:top-[-26px] md:right-[-0rem]">
                        {format(date, "d MMM yyyy")}
                    </span>
                </span>

                {/* Mobile Row 2 / Desktop Line 2: Big Word */}
                <span
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-normal uppercase leading-none text-white block md:text-left md:mt-[-6px]"
                >
                    {label}?
                </span>
            </HeadingTag>

            {/* Content Wrapper - Centered Vertically */}
            <div className="flex-1 flex flex-col justify-center gap-4">
                {/* Main Status Box */}
                <div
                    className={`w-full px-4 py-5 rounded-xl flex items-center justify-center gap-2 shadow-inner min-h-[60px] h-auto relative transition-all duration-300 ease-out ${flash
                        ? flashTheme
                        : `${theme.boxBorder} ${theme.boxBg} ${theme.boxGlow}`
                        }`}
                >
                    {/* Text Container - 650px max on desktop, full width on mobile */}
                    <div className="md:max-w-[650px] text-center flex flex-col gap-1 items-center">
                        <span className="text-white text-[14px] font-normal relative z-10 break-words text-center max-w-full inline" style={{ overflowWrap: 'break-word', wordWrap: 'break-word', lineHeight: '1.4' }}>
                            {state === "Dadra and Nagar Haveli and Daman and Diu" ? (
                                // Special two-line layout for longest UT name
                                <span className="flex flex-col items-center">
                                    <span>
                                        <span className="font-bold">{status.isOpen ? "YES." : "NO."}</span> Banks are {status.isOpen ? "open" : "closed"} {label.toLowerCase()} in
                                    </span>
                                    <span>{state}</span>
                                </span>
                            ) : status.isOpen ? (
                                <>
                                    <span className="font-bold">YES.</span> Banks are open {label.toLowerCase()} in {state}
                                </>
                            ) : (
                                <>
                                    <span className="font-bold">NO.</span> Banks are closed {label.toLowerCase()} in {state}
                                </>
                            )}
                        </span>
                        
                        <span className="flex items-center gap-1.5 text-[13px] text-white/90 font-medium mt-0.5">
                            <Info className="w-4 h-4 opacity-80" />
                            {status.isOpen ? "Regular Working Day" : status.reason}
                        </span>
                    </div>
                </div>

                {/* Services Footer */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 justify-start md:justify-center">
                    {services.map((service) => (
                        <div key={service.name} className="flex items-center gap-2">
                            <div
                                className="w-2.5 h-2.5 rounded-full liveGlow transition-colors duration-300"
                                data-status={service.available ? "open" : "closed"}
                                style={{
                                    backgroundColor: service.available ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"
                                }}
                            />
                            <span className="text-gray-300 text-xs font-medium">{service.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
