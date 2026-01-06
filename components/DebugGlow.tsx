"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function DebugGlow() {
    const searchParams = useSearchParams();
    const isDebug = searchParams.get("glowDebug") === "1";

    useEffect(() => {
        if (isDebug) {
            document.body.classList.add("debug-glow-mode");
        } else {
            document.body.classList.remove("debug-glow-mode");
        }
    }, [isDebug]);

    return null;
}
