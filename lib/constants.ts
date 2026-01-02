export const INDIAN_STATES = [
    "Andaman and Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
];

export const HOLIDAYS_2025: Record<string, Record<string, string>> = {
    ALL: {
        "2025-01-26": "Republic Day",
        "2025-08-15": "Independence Day",
        "2025-10-02": "Gandhi Jayanti",
        "2025-12-25": "Christmas",
    },
    Maharashtra: {
        "2025-02-19": "Chhatrapati Shivaji Maharaj Jayanti",
        "2025-05-01": "Maharashtra Day",
        "2025-08-27": "Ganesh Chaturthi",
    },
    Delhi: {
        // Add specific Delhi holidays if needed
    },
    Karnataka: {
        "2025-11-01": "Kannada Rajyotsava",
    },
};

/**
 * Standardized slug generation for state names.
 * Rules:
 * 1. Convert to lowercase
 * 2. Replace '&' with 'and'
 * 3. Replace spaces with hyphens
 * 4. Remove non-alphanumeric characters (except hyphens)
 * 5. Collapse multiple hyphens
 * 6. Trim leading/trailing hyphens
 * 
 * Example: "Dadra and Nagar Haveli and Daman and Diu" -> "dadra-and-nagar-haveli-and-daman-and-diu"
 */
export function stateToSlug(state: string): string {
    return state
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

/**
 * Reverse lookup: Convert URL slug back to state name.
 * Returns undefined if no matching state is found.
 */
export function slugToState(slug: string): string | undefined {
    return INDIAN_STATES.find(s => stateToSlug(s) === slug);
}
