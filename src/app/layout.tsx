import type { Metadata } from "next";
import { Space_Grotesk, Poppins } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aayush Bhardwaj | Full-Stack Developer",
  description: "I'm Aayush Bhardwaj, a Full-Stack Developer engineering scalable, high-performance digital experiences and interactive 3D web applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${poppins.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full bg-[#000107] text-[#E3F6FF] font-sans overflow-x-hidden selection:bg-[#FAB7C9] selection:text-[#000107]">
        <div className="ui-foreground">{children}</div>
      </body>
    </html>
  );
}
