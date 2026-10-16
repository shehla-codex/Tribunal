import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tribunal — Your code. Put on trial.",
  description: "An adversarial, owl-themed AI courtroom where your code is judged by three AI characters: Prosecutor, Defense Attorney, and Judge.",
  icons: {
    icon: "/assets/tribunal-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-cream-100 text-charcoal antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
