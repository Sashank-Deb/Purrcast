import "./globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SITE, SITE_URL } from "@/lib/site";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE.title, template: "%s | PurrCast" },
  description: SITE.description,
  keywords: SITE.keywords,
  applicationName: BRAND.name,
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  alternates: { canonical: "/" },
  category: "technology",
  openGraph: {
    type: "website", url: "/", siteName: BRAND.name, locale: "en_US",
    title: "PurrCast — Read with your ears", description: SITE.description,
  },
  twitter: { card: "summary_large_image", title: "PurrCast — Read with your ears", description: SITE.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  icons: { icon: [{ url: "/icon-v3.svg", type: "image/svg+xml" }, { url: "/favicon.ico?v=3", sizes: "any" }], apple: "/apple-icon?v=3" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = { themeColor: "#EA580C", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  const ld = [
    { "@context": "https://schema.org", "@type": "WebSite", name: BRAND.name, url: SITE_URL, description: SITE.description },
    {
      "@context": "https://schema.org", "@type": "SoftwareApplication", name: BRAND.name, url: SITE_URL,
      applicationCategory: "MultimediaApplication", operatingSystem: "Web, Chrome",
      description: SITE.description, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ];
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </body>
    </html>
  );
}
