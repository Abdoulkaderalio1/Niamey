import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ShieldCheck } from 'lucide-react';

interface MobilePhotoViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: [string, string] | string[];
  candidateName: string;
  candidateCity: string;
  initialIndex?: number;
}

export const MobilePhotoViewerModal: React.FC<MobilePhotoViewerModalProps> = ({
  isOpen,
  onClose,
  photos,
  candidateName,
  candidateCity,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photos.length]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !photos || photos.length === 0) return null;

  const validPhotos = photos.filter(p => !!p);
  const currentPhoto = validPhotos[currentIndex] || validPhotos[0];

  const handleNext = () => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev + 1) % validPhotos.length);
  };

  const handlePrev = () => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev - 1 + validPhotos.length) % validPhotos.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || isZoomed) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      handleNext(); // Swiped left -> show next
    } else if (diff < -50) {
      handlePrev(); // Swiped right -> show prev
    }
    setTouchStartX(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photos de ${candidateName}`}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-stone-950/95 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Top Bar with Thumb-friendly Close and Candidate Info */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-stone-950 to-stone-950/50 text-white z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            aria-label="Fermer la vue photo"
            className="flex items-center justify-center w-11 h-11 rounded-full bg-stone-800/80 text-white hover:bg-stone-700 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <X className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-base font-semibold leading-tight text-white tracking-wide">
              {candidateName}
            </h2>
            <p className="text-xs text-stone-300">
              {candidateCity} · Photo {currentIndex + 1} sur {validPhotos.length}
            </p>
          </div>
        </div>

        {/* Zoom and Privacy indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            aria-label={isZoomed ? "Réduire l'image" : "Agrandir l'image"}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-800/80 text-white hover:bg-stone-700 transition-colors"
          >
            {isZoomed ? <ZoomOut className="w-5 h-5 text-emerald-400" /> : <ZoomIn className="w-5 h-5" />}
          </button>
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pudeur & Respect</span>
          </div>
        </div>
      </div>

      {/* Main Touch Photo Area */}
      <div
        className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation arrow Left (Mobile & Desktop) */}
        {validPhotos.length > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Photo précédente"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 rounded-full bg-stone-900/70 text-white hover:bg-stone-800 active:scale-95 transition-transform backdrop-blur-sm shadow-md"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        {/* Image Container with Double-tap / Zoom support */}
        <div
          className={`relative max-w-full max-h-[75vh] flex items-center justify-center transition-transform duration-200 ${
            isZoomed ? 'scale-135 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img
            src={currentPhoto}
            alt={`Photo de ${candidateName}`}
            referrerPolicy="no-referrer"
            className="max-h-[72vh] w-auto max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300 border border-stone-800"
          />

          {/* Watermark Protection overlay (Respect for Nigerien families and modesty) */}
          <div className="absolute bottom-3 left-3 right-3 text-center pointer-events-none">
            <span className="inline-block px-3 py-1 rounded-md bg-stone-950/70 text-[11px] font-medium text-stone-300 backdrop-blur-xs tracking-wider border border-stone-800/60">
              Le Chemin pour le Nikah · Usage matrimonial exclusif
            </span>
          </div>
        </div>

        {/* Navigation arrow Right (Mobile & Desktop) */}
        {validPhotos.length > 1 && (
          <button
            onClick={handleNext}
            aria-label="Photo suivante"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 rounded-full bg-stone-900/70 text-white hover:bg-stone-800 active:scale-95 transition-transform backdrop-blur-sm shadow-md"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}
      </div>

      {/* Bottom Bar: Thumbnails & Mobile Controls */}
      <div className="px-4 py-3 bg-gradient-to-t from-stone-950 via-stone-950/90 to-transparent flex flex-col items-center gap-2">
        {/* Thumbnail Selector */}
        {validPhotos.length > 1 && (
          <div className="flex items-center gap-3">
            {validPhotos.map((photoUrl, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsZoomed(false);
                  setCurrentIndex(idx);
                }}
                className={`relative w-14 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  currentIndex === idx
                    ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-900/30'
                    : 'border-stone-700 opacity-60 hover:opacity-100'
                }`}
                aria-label={`Afficher la photo ${idx + 1}`}
              >
                <img
                  src={photoUrl}
                  alt={`Vignette ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-stone-900/80 text-[10px] text-center text-stone-200 py-0.5">
                  {idx === 0 ? 'Photo 1' : 'Photo 2'}
                </span>
              </button>
            ))}
          </div>
        )}

        <p className="text-[11px] text-stone-400 text-center">
          Glissez vers la gauche ou la droite sur votre téléphone pour faire défiler les photos
        </p>
      </div>
    </div>
  );
};
