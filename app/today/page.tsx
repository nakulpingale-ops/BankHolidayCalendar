import { Metadata } from "next";
import { DayView } from "@/components/DayView";

export const metadata: Metadata = {
    title: "Are Banks Open Today? | Bank Holiday Calendar",
    description: "Check if banks are open or closed TODAY in your state. Real-time status based on official holiday lists, 2nd/4th Saturdays, and Sunday rules.",
    alternates: {
        canonical: "https://bankholidaycalendar.com/today",
    },
};

export default function TodayPage() {
    return <DayView mode="today" />;
}
