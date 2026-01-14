import { useState, useEffect } from "react";

export function useSaturdayToggle() {
    const [includeSaturdayClosures, setIncludeSaturdayClosures] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedSatToggle = localStorage.getItem("includeSaturdayClosures");
            if (savedSatToggle !== null) {
                setIncludeSaturdayClosures(savedSatToggle === "true");
            }
        }
    }, []);

    const handleSatToggleChange = (value: boolean) => {
        setIncludeSaturdayClosures(value);
        if (typeof window !== 'undefined') {
            localStorage.setItem("includeSaturdayClosures", value.toString());
        }
    };

    return { includeSaturdayClosures, setIncludeSaturdayClosures: handleSatToggleChange };
}
