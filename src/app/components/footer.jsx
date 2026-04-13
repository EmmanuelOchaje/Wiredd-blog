import Link from "next/link";
import facebook from "../../../public/assets/facebook.png";
import instagram from "../../../public/assets/instagram.png";
import linkedin from "../../../public/assets/linkedin.png";
import twitter from "../../../public/assets/twitter.png";
import Image from "next/image";
// import facebook from '../../../public/assets/facebook.png'

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] mt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Left - Logo + Socials */}
          <div className="flex flex-col gap-4">
            <Link href="/">
              {/* <img src="" alt="wiredd" className="h-8" /> */}
            </Link>
            <div className="flex items-center gap-4 text-neutral-600">
              <Link
                href="https://instagram.com"
                target="_blank"
                className="hover:text-white transition-colors"
              >
                <Image src={instagram} alt="" className="w-5 h-5" />
              </Link>

              <Link
                href="https://x.com"
                target="_blank"
                className="hover:text-white transition-colors"
              >
                <Image src={twitter} alt="" className="w-5 h-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                className="hover:text-white transition-colors"
              >
                <Image src={linkedin} alt="" className="w-5 h-5" />
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                className="hover:text-white transition-colors"
              >
                <Image src={facebook} alt="" className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Right - Links */}
          <div className="flex flex-col md:flex-row gap-10 text-sm">
            <div>
              <p className="text-neutral-500 font-semibold mb-2">Explore</p>
              <div className="flex flex-col gap-1 text-neutral-600">
                <Link
                  href="/trending"
                  className="hover:text-neutral-800 transition-colors"
                >
                  Trending
                </Link>
                <Link
                  href="/tags"
                  className="hover:text-neutral-800 transition-colors"
                >
                  Tags
                </Link>
                <Link
                  href="/explore"
                  className="hover:text-neutral-800 transition-colors"
                >
                  All Posts
                </Link>
              </div>
            </div>
            <div>
              <p className="text-neutral-500 font-semibold mb-2">Company</p>
              <div className="flex flex-col gap-1 text-neutral-600">
                <Link
                  href="/about"
                  className="hover:text-neutral-800 transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/write"
                  className="hover:text-neutral-800 transition-colors"
                >
                  Write for us
                </Link>
              </div>
            </div>
            <div>
              <p className="text-neutral-500 font-semibold mb-2">Contact</p>
              <div className="flex flex-col gap-1 text-neutral-600">
                <p>wiredd@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} wiredd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-neutral-800 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-neutral-800 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="hover:text-neutral-800 transition-colors"
            >
              Cookies Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
