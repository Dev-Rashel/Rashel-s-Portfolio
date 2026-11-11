import type { Metadata } from "next";
import { getProfile, getSiteSettings } from "@/lib/data";
import { PreloaderProvider } from "@/components/site/preloader-provider";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { PageTransition } from "@/components/site/page-transition";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ThemeDefaults } from "@/components/site/theme-defaults";
import { defaultSettings } from "@/lib/defaults";
import { absoluteUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSiteSettings();
    return {
      metadataBase: new URL(absoluteUrl()),
      title: {
        default: settings.seo.defaultTitle,
        template: settings.seo.titleTemplate,
      },
      description: settings.seo.defaultDescription,
      keywords: settings.keywords,
      alternates: { canonical: "/" },
      openGraph: {
        type: "website",
        locale: "en_US",
        url: absoluteUrl(),
        title: settings.seo.defaultTitle,
        description: settings.seo.defaultDescription,
        siteName: settings.siteName,
        images: settings.seo.ogImage ? [{ url: settings.seo.ogImage }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: settings.seo.defaultTitle,
        description: settings.seo.defaultDescription,
        creator: settings.seo.twitterHandle,
      },
      robots: settings.seo.robots,
      icons: {
        icon: settings.favicon || "/favicon.svg",
        shortcut: settings.favicon || "/favicon.svg",
        apple: settings.favicon || "/favicon.svg",
      },
    };
  } catch {
    return {
      title: defaultSettings.seo.defaultTitle,
      description: defaultSettings.seo.defaultDescription,
    };
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [profile, settings] = await Promise.all([getProfile(), getSiteSettings()]);

  const cssVars = {
    "--accent": settings.colors.accent,
    "--accent-soft": settings.colors.accentSoft,
    "--accent-rgb": hexToRgb(settings.colors.accent),
    "--background": settings.colors.background,
    "--surface": settings.colors.surface,
    "--foreground": settings.colors.foreground,
  } as React.CSSProperties;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    jobTitle: profile.designation,
    description: profile.shortBio,
    url: absoluteUrl(),
    image: profile.profileImage,
    email: `mailto:${profile.email}`,
    address: { "@type": "PostalAddress", addressLocality: profile.location },
    sameAs: profile.socials.map((social) => social.url).filter(Boolean),
  };

  return (
    <div style={cssVars} className="relative min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <ThemeDefaults defaultTheme={settings.defaultTheme} />
      <PreloaderProvider siteName={settings.siteName} logoMark={settings.logoMark}>
        <div className="ambient-mesh" aria-hidden />
        <SmoothScroll />
        <SiteHeader
          navItems={settings.navItems}
          siteName={settings.siteName}
          logoMark={settings.logoMark}
          available={profile.available}
        />
        <main className="relative z-10">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter
          siteName={settings.siteName}
          footer={settings.footer}
          socials={profile.socials}
          email={settings.contact.email || profile.email}
          available={profile.available}
          availability={profile.availability}
        />
      </PreloaderProvider>
    </div>
  );
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  if (value.length !== 6) return "255, 122, 107";
  const [r, g, b] = [value.slice(0, 2), value.slice(2, 4), value.slice(4, 6)].map((part) => parseInt(part, 16));
  return `${r}, ${g}, ${b}`;
}
