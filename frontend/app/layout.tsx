import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "M.A.A.N. | Legal Metrology",
  description: "Metrological Assurance, Authentication & Network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}