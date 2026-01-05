import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HolidayProvider } from "@/lib/HolidayContext";
import { SeoIndex } from "@/components/SeoIndex";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import { FeedbackPopup } from "@/components/FeedbackPopup";
import { Analytics } from "@/components/Analytics";
import { PagesDevGuard } from "@/components/PagesDevGuard";
import { CanonicalUrl } from "@/components/CanonicalUrl";



const interTight = Inter_Tight({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://bankholidaycalendar.com"),
  title: "Bank Holiday Calendar 2026 India - Official State-wise Holiday List",
  description: "Check whether banks are open or closed today and tomorrow in India (state-wise). Based on bank holiday schedules, Sundays, and 2nd & 4th Saturdays.",
  openGraph: {
    title: "Bank Holiday Calendar 2026 India - Official State-wise Holiday List",
    description: "Check whether banks are open or closed today and tomorrow in India (state-wise). Based on official bank holiday schedules, Sundays, and 2nd & 4th Saturdays.",
    type: "website",
    url: "https://bankholidaycalendar.com",
    siteName: "Bank Holiday Calendar",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://bankholidaycalendar.com/",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "google-adsense-account": "ca-pub-5019551171853082",
  },
};

import { ScrollToTop } from "@/components/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* SEO: Canonical URL Management */}
        <PagesDevGuard />
        <CanonicalUrl />
      </head>
      <body className={`${interTight.className} w-full min-h-screen overflow-x-hidden bg-[#0F172A] flex flex-col items-center text-white antialiased`} suppressHydrationWarning>
        {/* Google Analytics 4 */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-HQV7FT38DS"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HQV7FT38DS', { send_page_view: false });
          `}
        </Script>

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5019551171853082"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <Analytics />
        <ScrollToTop />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <HolidayProvider>
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
