import { MetadataRoute } from "next";
import { INDIAN_STATES, stateToSlug } from "@/lib/constants";

const BASE_URL = "https://bankholidaycalendar.com";
const CURRENT_YEAR = 2026;

export default function sitemap(): MetadataRoute.Sitemap {
    const currentDate = new Date().toISOString();

    // Homepage - highest priority
    const homePage = {
        url: BASE_URL,
        lastModified: currentDate,
        changeFrequency: "daily" as const,
        priority: 1.0,
    };

    // All States/UTs page
    const allStatesPage = {
        url: `${BASE_URL}/all-bank-holiday-${CURRENT_YEAR}`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    };

    // State-specific pages - dynamically generated from INDIAN_STATES
    const statePages = INDIAN_STATES.map((state) => ({
        url: `${BASE_URL}/${stateToSlug(state)}-bank-holiday-${CURRENT_YEAR}`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    // Static pages
    const staticPages = [
        {
            url: `${BASE_URL}/privacy`,
            lastModified: currentDate,
            changeFrequency: "monthly" as const,
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/terms`,
            lastModified: currentDate,
            changeFrequency: "monthly" as const,
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: currentDate,
            changeFrequency: "monthly" as const,
            priority: 0.3,
        },
    ];

    return [homePage, allStatesPage, ...statePages, ...staticPages];
}
