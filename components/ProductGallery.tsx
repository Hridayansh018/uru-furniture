"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Eye,
  SlidersHorizontal,
  Compass
} from "lucide-react";
import CatalogueLightbox from "./CatalogueLightbox";

interface ProductGalleryProps {
  productId: string;
  productName: string;
  defaultImages: string[];
}

const PHOTO_ANGLES = [
  "Front Architectural View",
  "Relaxed Lounge Profile",
  "Tactile Fabric Weave & Stitching",
  "Living Room Ambient Setting",
  "Modular Proportions & Deep Cushioning",
  "Artisanal Detail & Contour",
];

export default function ProductGallery({
  productId: _productId,
  productName,
  defaultImages
}: ProductGalleryProps) {
  const [images, setImages] = useState<string[]>(defaultImages);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Touch and drag tracking
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Sync images when product or variants change
  useEffect(() => {
    if (defaultImages && defaultImages.length > 0) {
      setImages(defaultImages);
      setSelectedIndex(0);
    }
  }, [defaultImages]);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // Keyboard navigation when hovering gallery
  useEffect(() => {
    if (!isHovered) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHovered, handlePrev, handleNext]);

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null) return;
    if (touchDeltaX.current > 45) {
      handlePrev();
    } else if (touchDeltaX.current < -45) {
      handleNext();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  const currentAngleLabel = PHOTO_ANGLES[selectedIndex % PHOTO_ANGLES.length];

  return (
    <div
      className="space-y-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Carousel Viewport */}
      <div
        className="relative group aspect-[4/3] sm:aspect-[16/11] bg-[#ece7dd] rounded-3xl overflow-hidden cursor-zoom-in border border-[#ded9d0] shadow-md select-none"
        onClick={() => setIsLightboxOpen(true)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Animated Slide Track */}
        <div
          ref={trackRef}
          className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          style={{ transform: `translate3d(-${selectedIndex * 100}%, 0, 0)` }}
        >
          {images.map((img, idx) => (
            <div
              key={`${img}-${idx}`}
              className="relative w-full h-full shrink-0 flex items-center justify-center bg-[#ece7dd] overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`${productName} — ${PHOTO_ANGLES[idx % PHOTO_ANGLES.length] || `angle ${idx + 1}`}`}
                className="w-full h-full object-cover select-none transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                draggable={false}
                loading={idx === 0 ? "eager" : "lazy"}
              />

              {/* Subtle top and bottom gradient vignettes for pill contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/25 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Top Floating Badge: Angle / Perspective Tag */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15 text-[11px] font-medium tracking-wide shadow-sm">
          <Compass className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>{currentAngleLabel}</span>
        </div>

        {/* Top Right: Fullscreen Lightbox Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/15 transition-all shadow-sm active:scale-95 group/btn"
          aria-label="View fullscreen gallery"
          title="Open Fullscreen Lightbox"
        >
          <Maximize2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
        </button>

        {/* Bottom Left: Counter & Progress */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15 text-xs font-mono tabular-nums shadow-sm">
          <span className="font-semibold text-amber-200">{selectedIndex + 1}</span>
          <span className="text-white/40">/</span>
          <span>{images.length}</span>
        </div>

        {/* Bottom Center: Pill Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/10">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === selectedIndex
                  ? "w-6 bg-white shadow-sm"
                  : "w-1.5 bg-white/45 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Carousel Arrow Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#171614] shadow-lg flex items-center justify-center transition-all duration-200 opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 -translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#171614] shadow-lg flex items-center justify-center transition-all duration-200 opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 translate-x-0.5" />
            </button>
          </>
        )}
      </div>

      {/* Interactive Thumbnail Filmstrip */}
      {images.length > 1 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#78716c] px-1 font-medium">
            <span>Click thumbnail or swipe to inspect</span>
            <span className="hidden sm:inline text-stone-400">Use ← → arrow keys to navigate</span>
          </div>

          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {images.map((img, idx) => {
              const isActive = idx === selectedIndex;
              return (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden transition-all duration-200 group ${
                    isActive
                      ? "ring-2 ring-[#171614] ring-offset-2 ring-offset-[#fcfbf9] shadow-md scale-[1.03]"
                      : "opacity-60 hover:opacity-100 hover:scale-[1.01] border border-[#ded9d0]"
                  }`}
                  aria-label={`Select angle ${idx + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${productName} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-[#171614]/10 pointer-events-none" />
                  )}
                  <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 rounded bg-black/60 text-white backdrop-blur-xs">
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <CatalogueLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        title={productName}
        caption="High-resolution lifestyle and tactile detail photography of the Cloud Sofa."
        images={images}
        initialIndex={selectedIndex}
      />
    </div>
  );
}
