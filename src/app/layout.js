import { DM_Sans } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./components/sessionWrapper";
import Header from "./components/header";
import Footer from "./components/footer";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata = {
  title: "Wiredd — for techies, by techies",
  description: "A space for techies to rant, share stories and experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} text-white antialiased`}>
        <SessionWrapper>
          <Header />
          <main className="min-h-screen max-w-6xl mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
