import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HolidayProvider, Holiday } from "@/lib/HolidayContext";
import { SeoIndex } from "@/components/SeoIndex";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import { FeedbackPopup } from "@/components/FeedbackPopup";



const interTight = Inter_Tight({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://bankholidaycalendar.com"),
  title: "Bank Holiday Calendar 2026 - Check Live Status & State-wise List",
  description: "Verify if banks are open today or tomorrow with the ultimate Bank Holiday Calendar 2026. Get state-wise holiday data, download 2026 banking schedules, and check future dates for all Indian States & UTs. Verified via RBI circulars.",
  openGraph: {
    title: "Bank Holiday Calendar 2026 - Check Live Status & State-wise List",
    description: "Verify if banks are open today or tomorrow with the ultimate Bank Holiday Calendar 2026. Get state-wise holiday data, download 2026 banking schedules, and check future dates for all Indian States & UTs. Verified via RBI circulars.",
    type: "website",
    url: "https://bankholidaycalendar.com",
    siteName: "Bank Holiday Calendar",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "./",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

import { ScrollToTop } from "@/components/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read and parse CSV file (Server Side)
  const csvPath = path.join(process.cwd(), "public", "bankholidays2026.csv");
  const csvFile = fs.readFileSync(csvPath, "utf8");
  const { data } = Papa.parse<Holiday>(csvFile, {
    header: true,
    skipEmptyLines: true,
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${interTight.className} w-full min-h-screen overflow-x-hidden bg-[#0F172A] flex flex-col items-center text-white antialiased`} suppressHydrationWarning>
        <ScrollToTop />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <HolidayProvider initialHolidays={data}>
            <JsonLdSchema />
            {/* Header Wrapper */}
            <div className="w-full">
              <Header />
            </div>

            {/* Main Content Wrapper */}
            <main className="w-full max-w-[1300px] mx-auto px-4 md:px-6 flex flex-col items-center justify-center pt-[20px] -mt-[30px] relative z-10">
              {children}
            </main>


            <SeoIndex />
            <Footer />
            <FeedbackPopup />
          </HolidayProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
