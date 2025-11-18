import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "AI Gradient Generator - Beautiful, Accessible Gradients for Hero Sections",
  description: "Generate stunning, WCAG-compliant gradients using AI. Perfect for hero sections, landing pages, and modern web design.",
  keywords: ["gradient generator", "AI gradients", "CSS gradients", "web design", "accessibility", "WCAG"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
