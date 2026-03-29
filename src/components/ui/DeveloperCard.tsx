"use client"

import Image from "next/image"

export default function DeveloperCard() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 max-w-sm">
      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/5 shrink-0">
        <Image 
          src="/images/eashan.webp" 
          alt="Golam Morshed Eashan" 
          fill
          className="object-cover"
        />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted">Developed By:</p>
        <h4 className="text-xl font-black text-primary leading-tight">Golam Morshed Eashan</h4>
        <p className="text-sm font-medium text-muted">Developer at <span className="text-primary font-bold">UNLEFT</span></p>
        <a 
          href="https://www.instagram.com/golammorshedeashan/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#E1306C] hover:opacity-80 transition-opacity mt-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <span>Contact on Instagram</span>
        </a>
      </div>
    </div>
  )
}
