import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talk2DB - Natural Language to SQL Converter",
  description: "Transform your natural language into powerful SQL queries with AI-powered intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
