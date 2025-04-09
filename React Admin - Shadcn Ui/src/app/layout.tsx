import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "React Admin - Shadcn Ui",
  description: "React Admin - Shadcn Ui, Tailwind CSS, TypeScript, Next.js",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`}>
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          <main className="flex">
            <Sidebar />
            <div className="flex-1">
              <Header />
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
