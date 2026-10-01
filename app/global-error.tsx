"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fcfbf9] text-[#1c1917] flex flex-col justify-center items-center px-6 py-24 text-center font-sans">
        <div className="max-w-md space-y-6">
          <span className="font-serif text-3xl tracking-[0.16em]">URU</span>
          <div className="space-y-2">
            <h1 className="font-serif text-3xl text-[#1c1917]">System Notice</h1>
            <p className="text-sm text-[#57534e]">
              A critical layout error occurred. Please refresh or return to the main showroom.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-3 rounded-full bg-[#1c1917] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Reload
            </button>
            <Link
              href="/"
              className="px-6 py-3 rounded-full border border-[#d6d3d1] text-[#1c1917] text-xs font-semibold uppercase tracking-wider"
            >
              Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
