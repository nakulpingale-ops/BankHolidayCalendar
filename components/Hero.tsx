"use client";

import { useState, useEffect } from "react";
import { addDays, format } from "date-fns";
import { Calendar, MapPin, AlertCircle, CheckCircle } from "lucide-react";
import { StatusCard } from "./StatusCard";
import { useHolidayData } from "@/lib/HolidayContext";
import { INDIAN_STATES, stateToSlug } from "@/lib/constants";

export function Hero() {
    const [mounted, setMounted] = useState(false);
    const [today, setToday] = useState<Date>(new Date());
    const { isBankOpen, selectedState } = useHolidayData();

    useEffect(() => {
        setMounted(true);
        setToday(new Date());
    }, []);

    if (!mounted) return <div className="h-[400px] w-full animate-pulse bg-gray-900/20 rounded-lg"></div>;

    const tomorrow = addDays(today, 1);
    const statusToday = isBankOpen(today, selectedState);
    const statusTomorrow = isBankOpen(tomorrow, selectedState);

    return (
        <section id="quick-status" className="w-full text-white mt-[-22px] print:hidden">
            <div className="w-full max-w-none px-4 sm:max-w-[1050px] sm:mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-0">
                    <div className="flex flex-col">
                        <StatusCard
                            label="TODAY"
                            date={today}
                            state={selectedState}
                            status={statusToday}
                        />
                    </div>
                    <div className="flex flex-col">
                        <StatusCard
                            label="TOMORROW"
                            date={tomorrow}
                            state={selectedState}
                            status={statusTomorrow}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
