import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { defaultSettings } from "@/lib/defaults";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: defaultSettings.seo.defaultTitle,
    template: defaultSettings.seo.titleTemplate,
  },
  description: defaultSettings.seo.defaultDescription,
  keywords: defaultSettings.keywords,
  authors: [{ name: defaultSettings.siteName }],
  creator: defaultSettings.siteName,
  openGraph: {
    type: "website",
    locale: "en_US",
    title: defaultSettings.seo.defaultTitle,
    description: defaultSettings.seo.defaultDescription,
    siteName: defaultSettings.siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSettings.seo.defaultTitle,
    description: defaultSettings.seo.defaultDescription,
    creator: defaultSettings.seo.twitterHandle,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0714",
  colorScheme: "dark light",
};

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('portfolio-theme');
    var theme = stored || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain">{children}</body>
    </html>
  );
}
