"use client";

import { useState, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface CatalogueLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  caption: string;
  images: string[];
  initialIndex?: number;
}

export default function CatalogueLightbox({
  isOpen,
  onClose,
  title,
  caption,
  images,
  initialIndex = 0
}: CatalogueLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [prevProps, setPrevProps] = useState({ initialIndex, isOpen });
  const touchStartX = useRef(0);

  if (prevProps.initialIndex !== initialIndex || prevProps.isOpen !== isOpen) {
    setPrevProps({ initialIndex, isOpen });
    setCurrentIndex(initialIndex);
  }

  const handlePrev = useCallback(() => {
    if (!images.length) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNext = useCallback(() => {
    if (!images.length) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#12100e]/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in duration-200"
      onClick={onClose}
      onTouchStart={(e) => {
        touchStartX.current = e.changedTouches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 40) {
          if (delta < 0) handleNext();
          else handlePrev();
        }
      }}
    >
      <div
        className="w-full max-w-6xl flex items-center justify-between z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <span className="text-xs uppercase tracking-widest text-neutral-400">
            URU Visual Archive
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-white">{title}</h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close Gallery"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div
        className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-4 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-sm transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[currentIndex]}
          alt={`${title} view ${currentIndex + 1}`}
          className="max-h-[68vh] sm:max-h-[72vh] max-w-[92vw] sm:max-w-[85vw] object-contain rounded-2xl shadow-2xl transition-all duration-300"
        />

        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-sm transition-all"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      <div
        className="w-full max-w-4xl flex flex-col items-center gap-3 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs sm:text-sm text-neutral-300 text-center max-w-lg">
          {caption} · <span className="text-neutral-400 font-mono tabular-nums">{currentIndex + 1} of {images.length}</span>
        </p>

        {images.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto max-w-full px-2 py-1 scrollbar-none">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`relative w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden shrink-0 border transition-all ${
                  i === currentIndex
                    ? "border-white ring-2 ring-white/50 opacity-100 scale-105"
                    : "border-white/20 opacity-50 hover:opacity-80"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
