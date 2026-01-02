"use client";

import { useEffect } from "react";
import { useHolidayData } from "@/lib/HolidayContext";
import { parse, format } from "date-fns";

export function JsonLdSchema() {
    const { selectedState, getHolidays } = useHolidayData();

    useEffect(() => {
        // Get holidays for the selected state
        const holidays = getHolidays(selectedState);

        // Generate Event schema for each holiday
        const eventSchemas = holidays.map((holiday) => {
            const holidayDate = parse(holiday.Date, "yyyy/MM/dd", new Date());
            const isoDate = format(holidayDate, "yyyy-MM-dd");

            return {
                "@type": "Event",
                "name": holiday.Holiday,
                "startDate": isoDate,
                "endDate": isoDate,
                "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
                "eventStatus": "https://schema.org/EventScheduled",
                "location": {
                    "@type": "Place",
                    "name": selectedState,
                    "address": {
                        "@type": "PostalAddress",
                        "addressRegion": selectedState,
                        "addressCountry": "IN"
                    }
                },
                "description": `Official Bank Holiday in ${selectedState}, India. Banking services including RTGS/NEFT may be restricted.`,
                "organizer": {
                    "@type": "Organization",
                    "name": "Reserve Bank of India",
                    "url": "https://www.rbi.org.in"
                }
            };
        });

        // Organization Schema
        const organizationSchema = {
            "@type": "Organization",
            "name": "HolBank",
            "url": "https://bankholidaycalendar.com",
            "logo": "https://bankholidaycalendar.com/favicon.svg",
            "sameAs": [
                "https://saturdaytracker.com"
            ]
        };

        // WebSite Schema with SearchAction
        const websiteSchema = {
            "@type": "WebSite",
            "name": "Bank Holiday Calendar",
            "url": "https://bankholidaycalendar.com",
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://bankholidaycalendar.com/?state={search_term_string}"
                },
                "query-input": "required name=search_term_string"
            }
        };

        // Combine all schemas
        const jsonLd = {
            "@context": "https://schema.org",
            "@graph": [
                organizationSchema,
                websiteSchema,
                ...eventSchemas
            ]
        };

        // Find or create the script tag
        let scriptTag = document.getElementById("json-ld-schema") as HTMLScriptElement | null;

        if (!scriptTag) {
            scriptTag = document.createElement("script");
            scriptTag.id = "json-ld-schema";
            scriptTag.type = "application/ld+json";
            document.head.appendChild(scriptTag);
        }

        scriptTag.textContent = JSON.stringify(jsonLd, null, 2);

        // Cleanup on unmount
        return () => {
            const existingTag = document.getElementById("json-ld-schema");
            if (existingTag) {
                existingTag.remove();
            }
        };
    }, [selectedState, getHolidays]);

    return null; // This component doesn't render anything visible
}
