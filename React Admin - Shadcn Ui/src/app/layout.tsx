import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

import Sidebar from "@/components/sections/Sidebar";
import Header from "@/components/sections/Header";

import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
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
