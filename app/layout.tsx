import type { Metadata } from "next";
import { Caveat, Courier_Prime, Gochi_Hand } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { MediaProvider } from "@/components/media/MediaModal";
import "./globals.css";

const gochi = Gochi_Hand({ variable: "--font-gochi", subsets: ["latin"], weight: "400" });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });
const courier = Courier_Prime({ variable: "--font-courier", subsets: ["latin"], weight: ["400", "700"] });

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${gochi.variable} ${caveat.variable} ${courier.variable} antialiased`}>
      <body className="bg-desk paper-grain">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-paper focus:p-2">
          Skip to content
        </a>
        <div className="flex min-h-dvh flex-col overflow-x-clip">
        <MediaProvider>
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </MediaProvider>
        </div>
      </body>
    </html>
  );
}
