import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoltSpot — Next-Gen EV Charging Network & Telemetry",
  description: "Real-time electric vehicle charger discovery, live session monitoring, host management, and global fleet telemetry.",
  keywords: ["EV Charging", "VoltSpot", "Electric Vehicle", "CCS2", "Fast Charger", "Telemetry", "OCPP 2.0.1"],
  authors: [{ name: "VoltSpot Mobility" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#003525",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F5F7F4] text-[#121E1A] antialiased selection:bg-[#C8F169] selection:text-[#151F00]">
        {children}
      </body>
    </html>
  );
}
