import { DM_Sans } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./components/sessionWrapper";
import ThemeProvider from "./components/themeProvider";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata = {
  title: "Wiredd — for techies, by techies",
  description: "A space for techies to rant, share stories and experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} font-sans bg-white dark:bg-[#18181b] text-neutral-900 dark:text-white antialiased`}
      >
        <ThemeProvider>
          <SessionWrapper>{children}</SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
