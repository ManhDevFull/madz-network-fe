import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/toaster";
import { PwaInstallButton } from "@/components/ui/pwa-install-button";
import "./globals.css";

export const metadata: Metadata = {
  title: "MADZ Network",
  description: "MADZ Network social platform for home, login, chat, profile, and settings.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MADZ Network",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f1016",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-background text-foreground antialiased">
        <Toaster />
        <PwaInstallButton />
        {children}
      </body>
    </html>
  );
}
