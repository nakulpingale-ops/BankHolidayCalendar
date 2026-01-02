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
}

export function StatusCard({ label, date, state, status }: StatusCardProps) {
    const isDigitalOpen = true;
    const isPhysicalOpen = status.isOpen;

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

    const services = [
        { name: "RTGS / NEFT", available: isDigitalOpen },
        { name: "UPI / IMPS", available: isDigitalOpen },
        { name: "Cheque Clearing", available: isPhysicalOpen },
        { name: "Forex Windows", available: isPhysicalOpen },
    ];

    // Determine tooltip text
    let tooltipText = "";
    if (status.isOpen) {
        tooltipText = "Normal working day";
    } else if (status.reason === 'Sunday') {
        tooltipText = "Reason: Weekly Holiday";
    } else {
        tooltipText = `Reason: ${status.reason}`;
    }

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
            className={`w-full flex flex-col h-full rounded-[4px] border pl-9 pr-6 py-5 relative overflow-hidden transition-all duration-300 group/card ${flash
                ? "border-[#7d3cff] bg-[#7d3cff]/10 shadow-[0_0_30px_rgba(125,60,255,0.3)]"
                : "border-white/5 bg-white/5 backdrop-blur-sm shadow-xl"
                }`}
        >
            {/* Date Top Right */}
            <div className="absolute top-5 right-6 text-gray-400 font-medium text-lg">
                {format(date, "d MMM yyyy")}
            </div>

            <div className="mt-4 mb-2">
                <h3 className="text-xl text-white font-medium tracking-normal">Are banks open</h3>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-normal uppercase leading-none -mt-[6px]">
                    {label}?
                </h2>
            </div>

            {/* Content Wrapper - Centered Vertically */}
            <div className="flex-1 flex flex-col justify-center gap-4">
                {/* Main Status Box */}
                <div
                    className={`w-full px-4 py-5 rounded-[4px] flex items-center justify-center shadow-inner min-h-[60px] h-auto relative transition-all duration-300 ease-out ${flash
                        ? flashTheme
                        : `${theme.boxBorder} ${theme.boxBg} ${theme.boxGlow}`
                        }`}
                >
                    {/* Text Container - 650px max on desktop, full width on mobile */}
                    <div className="w-full md:max-w-[650px] mx-auto text-center">
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
                    </div>

                    {/* Info Icon with Tooltip - Anchored to outer box */}
                    {!status.isOpen && status.reason !== 'Sunday' && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 group/info">
                            <Info className="w-4 h-4 text-white hover:text-white/80 cursor-pointer transition-colors" />
                            <div className="absolute bottom-full right-0 mb-3 w-max max-w-[200px] px-3 py-2 bg-[#1e293b] border border-white/10 rounded-[6px] shadow-2xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all duration-200 z-50 pointer-events-none transform translate-y-1 group-hover/info:translate-y-0">
                                <span className="text-[11px] text-white font-medium block text-center leading-tight">
                                    {tooltipText}
                                </span>
                                {/* Arrow */}
                                <div className="absolute -bottom-1 right-1.5 w-2 h-2 bg-[#1e293b] border-r border-b border-white/10 transform rotate-45"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Services Footer */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
                    {services.map((service) => (
                        <div key={service.name} className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${service.available ? 'bg-[#14a900] animate-status-live' : 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]'}`} />
                            <span className="text-gray-300 text-xs font-medium">{service.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
