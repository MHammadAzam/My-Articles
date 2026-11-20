import type { Metadata } from "next";
import { Newsreader, Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hammad's Journal — Thoughts, Ideas & Perspectives",
    template: "%s | Hammad's Journal",
  },
  description:
    "A personal space for exploring ideas, questioning perspectives, and sharing observations about the world around us.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://hammadsjournal.com"
  ),
  keywords: [
    "Hammad Azam",
    "Hammad's Journal",
    "Essays",
    "Perspectives",
    "Philosophy",
    "Computer Science",
    "Ideas",
    "Observations",
  ],
  authors: [{ name: "Hammad Azam" }],
  creator: "Hammad Azam",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hammadsjournal.com",
    siteName: "Hammad's Journal",
    title: "Hammad's Journal — Thoughts, Ideas & Perspectives",
    description:
      "A personal space for exploring ideas, questioning perspectives, and sharing observations about the world around us.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hammad's Journal — Thoughts, Ideas & Perspectives",
    description:
      "A personal space for exploring ideas, questioning perspectives, and sharing observations about the world around us.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${sourceSerif.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-[#FAF8F5] text-[#1F1E1B] font-sans antialiased selection:bg-[#E8DFD1] selection:text-[#1F1E1B]">
        {children}
      </body>
    </html>
  );
}
