import type { Metadata } from "next";
import "./globals.css";
import PageTransition from "@/components/PageTransition";

// Example: Google Font (Inter)
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

// Optional: wrap global providers here
// import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Guideway",
  description: "Your personalized high school success plan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white text-black`}>
        {/* <Providers> */}
          <PageTransition>
            {children}
          </PageTransition>
        {/* </Providers> */}
      </body>
    </html>
  );
}