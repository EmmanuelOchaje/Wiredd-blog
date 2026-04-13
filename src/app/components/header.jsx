"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import favicon from "../../../public/assets/logo-light.png";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center border justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={favicon}
            alt="wiredd"
            className="w-full 10 h-10 mt-2 rounded"
          />
          {/*  <span className="font-mono font-bold text-lg tracking-widest text-black">
            Wiredd
          </span> */}
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-600">
          <Link href="/" className="hover:text-gray-600 transition-colors">
            Home
          </Link>
          <Link
            href="/explore"
            className="hover:text-gray-600  transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/trending"
            className="hover:text-gray-600 transition-colors"
          >
            Trending
          </Link>
          <button className="flex items-center gap-1 hover:text-gray-600  transition-colors">
            More
          </button>
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Link
                href="/write"
                className="hidden md:block text-sm px-4 py-1.5 border border-neutral-600 text-neutral-300 hover:border-white hover:text-gray-600 rounded transition-all"
              >
                + Write
              </Link>
              <Link href="/dashboard">
                <Image
                  src={session.user.image || "/default-avatar.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border border-neutral-700"
                />
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-black hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-neutral-600 hover:text-gray-600  transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm px-4 py-1.5 bg-white text-neutral-600 hover:text-gray-600 transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
