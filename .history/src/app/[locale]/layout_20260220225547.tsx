import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { GlobalNavbar } from "@/components/storefront/GlobalNavbar";
import { Footer } from "@/components/storefront/Footer";
import { createClient } from '@/lib/supabase/server';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: settingsData } = await supabase.from('settings').select('*');

  const settings = (settingsData || []).reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  const siteTitle = settings.site_title || "Kreslo Ofis - Premium Office Furniture in Baku";
  const shortTitle = settings.site_title ? settings.site_title.split('-')[0].trim() : "Kreslo Ofis";

  return {
    title: {
      template: `%s | ${shortTitle}`,
      default: siteTitle,
    },
    description: "Baku's premium office chair and desk store. Elevate your workspace with ergonomic designs.",
    keywords: ["office chairs baku", "ergonomic chairs azerbaijan", "office furniture", "standing desks"],
    openGraph: {
      title: siteTitle,
      description: "Baku's premium office chair and desk store. Elevate your workspace with ergonomic designs.",
      url: "https://kreslo-ofis.az",
      siteName: shortTitle,
      locale: "az_AZ",
      type: "website",
    },
    icons: settings.favicon_url ? {
      icon: settings.favicon_url,
      shortcut: settings.favicon_url,
      apple: settings.favicon_url,
    } : undefined,
    robots: {
      index: true,
      follow: true,
    },
  };
}

const locales = ['az', 'ru', 'en'];

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  // Provide all messages to the client side
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <main>
            <GlobalNavbar locale={locale} />
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
