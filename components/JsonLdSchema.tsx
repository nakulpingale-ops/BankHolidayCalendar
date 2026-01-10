"use client";

import { useEffect } from "react";

export function JsonLdSchema() {
  useEffect(() => {
    // Keep only site-wide schema. Do NOT output schema.org/Event for bank holidays
    // to avoid triggering Google Search Console "Events" enhancement warnings.
    const organizationSchema = {
      "@type": "Organization",
      "name": "HolBank",
      "url": "https://bankholidaycalendar.com",
      "logo": "https://bankholidaycalendar.com/favicon.svg",
      "sameAs": ["https://saturdaytracker.com"],
    };

    const websiteSchema = {
      "@type": "WebSite",
      "name": "Bank Holiday Calendar",
      "url": "https://bankholidaycalendar.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://bankholidaycalendar.com/?state={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    };

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [organizationSchema, websiteSchema],
    };

    let scriptTag = document.getElementById("json-ld-schema") as HTMLScriptElement | null;

    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "json-ld-schema";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }

    scriptTag.textContent = JSON.stringify(jsonLd, null, 2);

    return () => {
      const existingTag = document.getElementById("json-ld-schema");
      if (existingTag) existingTag.remove();
    };
  }, []);

  return null;
}
