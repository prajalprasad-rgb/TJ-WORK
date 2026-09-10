import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { weddingData as d } from "./config";

const serif = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-serif", weight: ["400", "500", "600"] });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: `${d.bride.firstName} & ${d.groom.firstName} | Wedding Invitation`,
  description: `Together with our family, ${d.bride.firstName} & ${d.groom.firstName} invite you to celebrate our wedding.`,
  openGraph: {
    title: `${d.bride.firstName} & ${d.groom.firstName} | Wedding Invitation`,
    description: `Together with our family, ${d.bride.firstName} & ${d.groom.firstName} invite you to celebrate our wedding.`,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${d.bride.firstName} & ${d.groom.firstName} — Wedding Invitation` }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${d.bride.firstName} & ${d.groom.firstName} | Wedding Invitation`,
    description: `Join us on 7 November 2026 as ${d.bride.firstName} & ${d.groom.firstName} celebrate their wedding.`,
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#fbf7ef", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${serif.variable} ${sans.variable}`}><body>{children}</body></html>;
}
