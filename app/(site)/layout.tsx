import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { MediaProvider } from "@/components/media/MediaModal";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-pink focus:p-2 focus:text-night">
        Skip to content
      </a>
      <MediaProvider>
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </MediaProvider>
    </div>
  );
}
