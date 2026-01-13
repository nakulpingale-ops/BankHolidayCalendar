"use client";

interface PrintHeaderProps {
    title?: string;
    stateName?: string;
}

export function PrintHeader({
    title = "ANNUAL BANKING CALENDAR 2026",
    stateName
}: PrintHeaderProps) {
    return (
        <div className="hidden print:block print-header">
            <p className="print-header-brand">HOLBANK</p>
            <p className="print-header-title">{title}</p>
            {stateName && (
                <p className="print-header-state">
                    {stateName === "All States/UTs" ? "All India" : stateName}
                </p>
            )}
        </div>
    );
}
