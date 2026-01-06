"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function DebugGlowContent() {
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

export function DebugGlow() {
    return (
        <Suspense fallback={null}>
            <DebugGlowContent />
        </Suspense>
    );
}
