"use client"

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    // Reset window scroll
    window.scrollTo({ top: 0, behavior: "instant" });

    // Reset any custom scroll containers (targeted specifically at our layout pattern)
    const scrollContainers = document.querySelectorAll('.overflow-y-auto');
    scrollContainers.forEach(container => {
      container.scrollTo({ top: 0, behavior: 'instant' });
    });
  }, [pathname]);

  return null;
}
