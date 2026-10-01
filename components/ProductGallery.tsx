"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import CatalogueLightbox from "./CatalogueLightbox";

interface ProductGalleryProps {
  productId: string;
  productName: string;
  defaultImages: string[];
}

export default function ProductGallery({
  productId: _productId,
  productName,
  defaultImages
}: ProductGalleryProps) {
  const [images, setImages] = useState<string[]>(defaultImages);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef(0);

  useEffect(() => {
    if (defaultImages && defaultImages.length > 0) {
      setImages(defaultImages);
      setSelectedIndex(0);
    }
  }, [defaultImages]);

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="space-y-4">
      <div
        className="relative group aspect-[4/3] sm:aspect-[16/11] bg-[#ece7dd] rounded-3xl overflow-hidden cursor-zoom-in border border-[#ded9d0] shadow-sm select-none"
        onClick={() => setIsLightboxOpen(true)}
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[selectedIndex] || defaultImages[0]}
          alt={`${productName} lifestyle angle ${selectedIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />

        <div className="absolute bottom-4 left-4 z-10 px-3 py-1 bg-[#171614]/75 text-white rounded-full text-xs font-mono backdrop-blur-sm tabular-nums">
          {selectedIndex + 1} / {images.length}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-[#171614]/75 hover:bg-[#171614] text-white backdrop-blur-sm transition-transform active:scale-95"
          aria-label="View fullscreen gallery"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 hover:bg-white text-[#171614] shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 hover:bg-white text-[#171614] shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-6 gap-2 sm:gap-3">
          {images.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                idx === selectedIndex
                  ? "border-[#171614] ring-2 ring-[#171614]/30 scale-[1.03]"
                  : "border-transparent opacity-65 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <CatalogueLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        title={productName}
        caption="Multiple angle and close-up detail shots of the Cloud Sofa."
        images={images}
        initialIndex={selectedIndex}
      />
    </div>
  );
}
