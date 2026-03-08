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

    // Determine tooltip text
    const getTooltipText = () => {
        if (status.isOpen) return "Normal working day";
        switch (status.reason) {
            case 'Sunday':
                return "Weekly Holiday: All banks in India remain closed on Sundays as per RBI guidelines.";
            case 'Second Saturday':
                return "Weekend Holiday: Banks are closed on the 2nd Saturday of every month.";
            case 'Fourth Saturday':
                return "Weekend Holiday: Banks are closed on the 4th Saturday of every month.";
            default:
                return `Holiday: ${status.reason}`;
        }
    };

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
            className={`w-full flex flex-col h-full rounded-[4px] border-[0.5px] px-4 sm:px-6 pt-3 pb-5 sm:py-5 relative overflow-hidden transition-colors duration-150 group/card ${flash
                ? "border-[#7d3cff] bg-[#7d3cff]/10 shadow-[0_0_30px_rgba(125,60,255,0.3)]"
                : `${status.isOpen ? "border-[#14a900]" : "border-[#850000]"} bg-[#1A1A1A] backdrop-blur-sm shadow-xl`
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
                    className={`w-full px-4 py-5 rounded-[4px] flex items-center justify-center gap-2 shadow-inner min-h-[60px] h-auto relative transition-all duration-300 ease-out ${flash
                        ? flashTheme
                        : `${theme.boxBorder} ${theme.boxBg} ${theme.boxGlow}`
                        }`}
                >
                    {/* Text Container - 650px max on desktop, full width on mobile */}
                    <div className="md:max-w-[650px] text-center">
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
                                    <span className="font-bold">YES.</span> Banks are open {label.toLowerCase()} in <span className="block sm:inline">{state}</span>
                                </>
                            ) : (
                                <>
                                    <span className="font-bold">NO.</span> Banks are closed {label.toLowerCase()} in <span className="block sm:inline">{state}</span>
                                </>
                            )}
                        </span>
                    </div>

                    {/* Info Icon with Tooltip - Inline */}
                    {!status.isOpen && (
                        <div className="relative group/info shrink-0">
                            <Info className="w-4 h-4 text-white hover:text-white/80 cursor-pointer transition-colors" />
                            <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:absolute md:inset-auto md:bottom-full md:left-1/2 md:-translate-x-1/2 mb-0 md:mb-3 w-auto md:w-max max-w-[calc(100vw-32px)] md:max-w-[200px] px-3 py-2 bg-[#1e293b] border border-white/10 rounded-[4px] shadow-2xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all duration-200 z-50 pointer-events-none transform md:translate-y-1 group-hover/info:translate-y-0 text-center md:text-left">
                                <span className="text-[11px] text-white font-medium block leading-tight whitespace-normal">
                                    {getTooltipText()}
                                </span>
                                {/* Arrow */}
                                <div className="hidden md:block absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1e293b] border-r border-b border-white/10 transform rotate-45"></div>
                            </div>
                        </div>
                    )}
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
