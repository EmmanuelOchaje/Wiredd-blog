"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import logoLight from "../../../public/assets/logo-light.png";
import logoDark from "../../../public/assets/logo-dark.png";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore" },
    { href: "/trending", label: "Trending" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border- border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={mounted && resolvedTheme === "dark" ? logoDark : logoLight}
            alt="wiredd"
            className="h-10 w-full"
            width={100}
            height={30}
          />
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative transition-colors ${
                pathname === href
                  ? "text-neutral-800 dark:text-white font-semibold after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-2 after:w-1 after:h-1 after:rounded-full after:bg-neutral-600 dark:after:bg-white after:content-['']"
                  : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-6">
          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            {resolvedTheme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zM2 13h2a1 1 0 0 0 0-2H2a1 1 0 0 0 0 2zm18 0h2a1 1 0 0 0 0-2h-2a1 1 0 0 0 0 2zM11 2v2a1 1 0 0 0 2 0V2a1 1 0 0 0-2 0zm0 18v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-2 0zM5.99 4.58a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41L5.99 4.58zm12.37 12.37a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41l-1.06-1.06zm1.06-12.37a1 1 0 0 0-1.41 0l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06a1 1 0 0 0 0-1.41zM7.05 18.36a1 1 0 0 0-1.41 0l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06a1 1 0 0 0 0-1.41z" />
              </svg>
            )}
          </button>
          {session ? (
            <>
              <Link
                href="/write"
                className="hidden md:block text-sm px-4 py-1.5 border border-neutral-300 dark:border-neutral-600 text-neutral-800 dark:text-neutral-300 hover:border-neutral-900 dark:hover:border-white rounded transition-all"
              >
                + Write
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-neutral-400 hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-neutral-400 font-medium hover:text-neutral-800 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm px-2 font-medium py-2 bg-gray-100 dark:bg-white text-neutral-500 dark:text-neutral-900 flex gap-2 justify-center items-center rounded-full hover:opacity-90 transition-all"
              >
                Sign Up
                <span className="p-2 w-5 h-5 rounded-full bg-neutral-600 flex justify-center items-center text-white text-xl">
                  ↗
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
