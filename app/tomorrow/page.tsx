import { Metadata } from "next";
import { DayView } from "@/components/DayView";

export const metadata: Metadata = {
    title: "Are Banks Open Tomorrow? | Bank Holiday Calendar",
    description: "Check if banks are open or closed TOMORROW in your state. Official status check based on bank holidays and weekend schedules.",
    alternates: {
        canonical: "https://bankholidaycalendar.com/tomorrow",
    },
};

export default function TomorrowPage() {
    return (
        <div className="pt-[96px] md:pt-[112px]">
            <DayView mode="tomorrow" />
        </div>
    );
}
