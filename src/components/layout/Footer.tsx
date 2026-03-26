import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#f4f4f1] dark:bg-[#1a1c1b] w-full py-12 px-8 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
        <div className="text-lg font-bold text-primary dark:text-accent">
          Holy Crescent School
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 text-sm">
          <Link href="/privacy" className="text-muted dark:text-gray-400 hover:text-accent transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-muted dark:text-gray-400 hover:text-accent transition-colors">Terms of Service</Link>
          <Link href="/contact" className="text-muted dark:text-gray-400 hover:text-accent transition-colors">Contact Us</Link>
          <Link href="/alumni" className="text-muted dark:text-gray-400 hover:text-accent transition-colors">Alumni</Link>
        </div>

        <div className="text-muted dark:text-gray-400 text-sm">
          © 2024 Holy Crescent School. Silver Jubilee Excellence.
        </div>
      </div>
    </footer>
  )
}
