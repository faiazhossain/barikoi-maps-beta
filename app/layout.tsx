import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#28C76F", // Barikoi's theme color
};

export const metadata: Metadata = {
  title: "Barikoi Maps",
  description: "Digital Address Made Easy - Navigate World with Barikoi Maps",
  keywords:
    "maps, navigation, bangladesh, barikoi, location, address, reverse geocoding, geocoding, barikoi maps, barikoi api, barikoi address, barikoi location, barikoi geocoding, barikoi reverse geocoding",
  authors: [{ name: "Barikoi" }],
  metadataBase: new URL("https://barikoi.com"),
  openGraph: {
    type: "website",
    title: "Barikoi Maps",
    description: "Digital Address Made Easy - Navigate World with Barikoi Maps",
    url: "https://barikoi.com",
    siteName: "Barikoi Maps",
    images: [
      {
        url: "/og-image.png", // Add your OpenGraph image in public folder
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barikoi Maps",
    description: "Digital Address Made Easy - Navigate World with Barikoi Maps",
  },
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>{children}</AntdRegistry>
        <SpeedInsights />
      </body>
    </html>
  );
}
