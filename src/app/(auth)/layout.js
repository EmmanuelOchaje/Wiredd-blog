import Link from "next/link";
import { DM_Sans } from "next/font/google";
import "../globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export default function AuthLayout({ children }) {
  return (
    <div
      className={`${dmSans.variable} font-sans bg-white dark:bg-[#18181b] text-neutral-900 dark:text-white antialiased min-h-screen`}
    >
      <header className="w-full px-6 py-4 flex items-center"></header>
      <main>{children}</main>
    </div>
  );
}
