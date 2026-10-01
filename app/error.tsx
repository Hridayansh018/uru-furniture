"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, ArrowLeft } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1c1917] flex flex-col justify-center items-center px-6 py-24 text-center font-sans">
      <div className="max-w-md space-y-6">
        <span className="font-serif text-3xl tracking-[0.16em] text-[#1c1917]">
          URU
        </span>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#78716c] font-semibold">
            Temporary Notice
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1c1917]">
            Something went wrong
          </h1>
          <p className="text-sm text-[#57534e] leading-relaxed">
            An unexpected error occurred while loading this view. You can reload or return to the main showroom.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1c1917] hover:bg-black text-white text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#d6d3d1] hover:border-[#1c1917] text-[#1c1917] text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Showroom Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
