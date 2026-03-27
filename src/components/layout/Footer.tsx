import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#f4f4f1] dark:bg-[#1a1c1b] w-full py-12 px-8 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="HCS Logo"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
          <div className="text-lg font-bold text-primary dark:text-accent">
            Holy Crescent School
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm">
          <Link
            href="/privacy"
            className="text-muted dark:text-gray-400 hover:text-accent transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-muted dark:text-gray-400 hover:text-accent transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/contact"
            className="text-muted dark:text-gray-400 hover:text-accent transition-colors"
          >
            Contact Us
          </Link>
          <Link
            href="/alumni"
            className="text-muted dark:text-gray-400 hover:text-accent transition-colors"
          >
            Alumni
          </Link>
        </div>

        <div className="text-muted dark:text-gray-400 text-sm">
          © 2026 Holy Crescent School.
        </div>
      </div>

      {/* Branding Section */}
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-xs font-bold uppercase tracking-widest text-muted/60 dark:text-gray-500">
          <p>
            A Project of{" "}
            <a 
              href="https://www.unleft.space" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary dark:text-accent hover:underline decoration-primary/30 underline-offset-4 transition-all"
            >
              UNLEFT
            </a>
          </p>
          <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <Link 
            href="https://www.unleft.space/about"
            target="_blank"
            className="hover:text-primary dark:hover:text-accent transition-colors underline decoration-gray-300 dark:decoration-gray-700 underline-offset-4"
          >
            Meet our developers
          </Link>
        </div>
      </div>
    </footer>
  );
}
