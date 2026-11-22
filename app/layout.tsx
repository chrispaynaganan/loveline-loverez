import type { Metadata, Viewport } from "next";
import { Caveat, Courier_Prime, DM_Sans, Gochi_Hand } from "next/font/google";
import "./globals.css";

const gochi = Gochi_Hand({ variable: "--font-gochi", subsets: ["latin"], weight: "400" });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });
const courier = Courier_Prime({ variable: "--font-courier", subsets: ["latin"], weight: ["400", "700"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });

const description =
  "Meet Loveline Loverez aka Boses Filipina, a Philippine-based voice-over artist for commercials, explainer videos and digital content. Listen to her demo reels, watch her work and see her voice rate card.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lovelineloverez.com"),
  title: { default: "Boses Filipina · Loveline Loverez, voice-over artist", template: "%s · Boses Filipina" },
  description,
  openGraph: {
    title: "Boses Filipina",
    description,
    siteName: "Boses Filipina",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Boses Filipina" }],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#1c1917", colorScheme: "dark" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${gochi.variable} ${caveat.variable} ${courier.variable} ${dmSans.variable} antialiased`}>
      <body className="bg-desk desk-grain">{children}</body>
    </html>
  );
}
