import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { GlobalNavbar } from "@/components/storefront/GlobalNavbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Kreslo Ofis",
    default: "Kreslo Ofis - Premium Office Furniture in Baku",
  },
  description: "Baku's premium office chair and desk store. Elevate your workspace with ergonomic designs.",
  keywords: ["office chairs baku", "ergonomic chairs azerbaijan", "office furniture", "standing desks"],
  openGraph: {
    title: "Kreslo Ofis - Premium Office Furniture",
    description: "Baku's premium office chair and desk store. Elevate your workspace with ergonomic designs.",
    url: "https://kreslo-ofis.az", // Assuming standard URL pattern for the brand
    siteName: "Kreslo Ofis",
    locale: "az_AZ",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
          <GlobalNavbar locale={locale} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
