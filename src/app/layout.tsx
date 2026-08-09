import type { Metadata, Viewport } from "next";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";

const siteUrl = "https://vault.entrepreneursjantaparty.com";
const siteDescription =
  "Founder Vault by Entrepreneurs Janta Party provides verified data on 1,000+ investors, 300+ pitch decks, business planning templates, financial projections, legal documents and founder resources to help you raise capital.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Founder Vault | Entrepreneurs Janta Party",
    template: "%s | Entrepreneurs Janta Party",
  },
  description: siteDescription,
  keywords: [
    "founder toolkit",
    "investor data",
    "pitch decks",
    "financial projections",
    "business plan templates",
    "fundraising resources",
    "startup resources",
    "raise capital",
    "Entrepreneurs Janta Party",
    "EJP",
  ],
  authors: [{ name: "Entrepreneurs Janta Party" }],
  creator: "Entrepreneurs Janta Party",
  publisher: "Entrepreneurs Janta Party",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Founder Vault by Entrepreneurs Janta Party",
    title: "Founder Vault | Entrepreneurs Janta Party",
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Founder Vault | Entrepreneurs Janta Party",
    description: siteDescription,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f8f7",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Founder Vault",
  description:
    "Founder Vault by Entrepreneurs Janta Party provides verified data on 1,000+ investors, 300+ pitch decks, business planning templates, financial projections, legal documents and founder resources to help you raise capital.",
  brand: { "@type": "Brand", name: "Founder Vault" },
  isAccessoryOrSparePartFor: {
    "@type": "Organization",
    name: "Entrepreneurs Janta Party",
    url: "https://entrepreneursjantaparty.com",
  },
  offers: {
    "@type": "Offer",
    price: "149",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
