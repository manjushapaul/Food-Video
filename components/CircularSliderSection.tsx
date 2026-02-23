'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsTabletUp } from '@/hooks/useIsTabletUp';


export interface SignatureDishProps {
  image?: { url: string } | null;
  subtitle?: string;
  name?: string;
  description?: string;
}

export interface CircularSliderSectionProps {
  title?: string;
  subtitle?: string;
  dishes?: SignatureDishProps[] | null;
}

export default function CircularSliderSection({ title, subtitle, dishes }: CircularSliderSectionProps) {
  const SLIDES = (dishes ?? []).map((d) => ({
    src: d.image?.url ?? '',
    title: d.name ?? '',
    alt: d.name ?? 'Dish',
    subtitle: d.subtitle ?? '',
    description: d.description ?? '',
  })).filter((s) => s.src);
  const TOTAL = SLIDES.length;

  if (TOTAL === 0) return null;
  const STEP_DEG = TOTAL > 0 ? 360 / TOTAL : 360;
  const isTabletUp = useIsTabletUp();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isBelowXl, setIsBelowXl] = useState(false);
  const [isBelow768, setIsBelow768] = useState(false);
  const [isBelow1200, setIsBelow1200] = useState(false);
  const [isBelow1024, setIsBelow1024] = useState(false);
  const [isBelow800, setIsBelow800] = useState(false);
  const [direction, setDirection] = useState(0);

  const ORBIT_RADIUS = isBelow1024 ? 600 : isBelow1200 ? 850 : 980;
  const ACTIVE_SLIDE_EXTRA_PX = isBelow1024 ? 380 : isBelow1200 ? 330 : 400;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 1279px)');
    const handleChange = () => setIsBelowXl(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = () => setIsBelow768(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 1199px)');
    const handleChange = () => setIsBelow1200(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const handleChange = () => setIsBelow1024(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 799px)');
    const handleChange = () => setIsBelow800(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, TOTAL - 1)));
  }, []);

  const next = useCallback(() => {
    if (activeIndex < TOTAL - 1) {
      setDirection(1);
      goTo(activeIndex + 1);
    }
  }, [activeIndex, goTo]);
  const prev = useCallback(() => {
    if (activeIndex > 0) {
      setDirection(-1);
      goTo(activeIndex - 1);
    }
  }, [activeIndex, goTo]);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [isPaused, activeIndex, next]);

  const orbitRotation = -activeIndex * STEP_DEG - 90;

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 320 : -320, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -320 : 320, opacity: 0 }),
  };

  return (
    <section
      id="circular-slider"
      className="relative overflow-hidden min-h-[600px] lg:min-h-[800px] flex items-center bg-[#F8F8F8]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute left-0 right-0 top-10 sm:top-12 lg:top-14 text-center z-50 pointer-events-none px-4 sm:px-6">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[40px] lg:leading-[40px] font-medium 2xl:leading-[60px] leading-tight text-gray-900">
          {title}
        </h2>
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>
      {/* Subtle vegbanner texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] z-0 bg-contain bg-left bg-no-repeat"
        style={{ backgroundImage: 'url(/images/vegbanner.png)' }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 max-[799px]:pt-44 max-[799px]:pb-12">
        <div className="grid grid-cols-1 min-[800px]:grid-cols-[50%_50%] xl:grid-cols-[32%_68%] gap-10 lg:gap-14 xl:gap-16 xl:items-center justify-items-center min-[800px]:justify-items-stretch">
          {/* Left: empty (hidden below 800px so section stays centered) */}
          <motion.div
            className="hidden min-[800px]:flex order-1 flex-col justify-center xl:justify-center py-8 sm:py-10 lg:py-12 xl:py-16 px-4 sm:px-6 lg:px-0"
            initial={isTabletUp ? { opacity: 0, x: -24 } : false}
            whileInView={isTabletUp ? { opacity: 1, x: 0 } : undefined}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          />

          {/* Right: circular slider (≥800px) or linear slider + content + arrows stacked (<800px) */}
          <motion.div
            className="order-2 relative flex justify-center min-[800px]:justify-end w-full max-w-full max-[799px]:pt-20"
            initial={isTabletUp ? { opacity: 0, scale: 0.96 } : false}
            whileInView={isTabletUp ? { opacity: 1, scale: 1 } : undefined}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {isBelow800 ? (
              /* Below 800px: slider centered, content block below, arrows below */
              <div className="flex flex-col items-center w-full gap-6 sm:gap-8">
                <div
                  className="relative w-full max-w-[min(75vw,260px)] aspect-square rounded-full overflow-hidden bg-white/60 backdrop-blur-xl flex items-center justify-center mx-auto"
                  style={{
                    boxShadow:
                      'rgba(166, 43, 58, 0.4) 0px 20px 40px -10px, rgba(166, 43, 58, 0.35) 0px 0px 0px 3px',
                  }}
                >
                  <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.div
                      key={activeIndex}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="absolute inset-3 rounded-full overflow-hidden shadow-lg border-2 border-white"
                    >
                      <Image
                        src={SLIDES[activeIndex].src}
                        alt={SLIDES[activeIndex].alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 799px) 75vw, 260px"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex flex-col justify-center py-4 sm:py-6 px-5 sm:px-6 w-full rounded-2xl sm:rounded-3xl bg-white/60 backdrop-blur-xl border border-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                  <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase text-[#A62B3A]/90 mb-2 sm:mb-3 block">
                    {SLIDES[activeIndex].subtitle ?? 'Curated selection'}
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={activeIndex}
                      className="font-serif text-lg sm:text-xl font-medium text-[#2C2F24] mb-3 sm:mb-4 tracking-tight"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.28 }}
                    >
                      {SLIDES[activeIndex].title}
                    </motion.p>
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={activeIndex}
                      className="text-[#414536] font-dm-sans leading-relaxed text-sm sm:text-base"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.28 }}
                    >
                      {SLIDES[activeIndex].description}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <div className="flex items-center justify-center gap-8 sm:gap-12 pt-2">
                  <button
                    type="button"
                    onClick={prev}
                    disabled={activeIndex === 0}
                    className={`flex items-center justify-center p-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A62B3A] focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                      activeIndex === 0
                        ? 'text-gray-300'
                        : 'text-[#A62B3A] hover:text-[#8a2232] hover:scale-105'
                    }`}
                    aria-label="Previous dish"
                  >
                    <svg className="w-12 h-12 sm:w-14 sm:h-14 shrink-0" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10}>
                      <path d="M212 130H48" />
                      <path d="M61.537 152.188 43.675 130l17.862-22.188" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    disabled={activeIndex === TOTAL - 1}
                    className={`flex items-center justify-center p-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A62B3A] focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                      activeIndex === TOTAL - 1
                        ? 'text-gray-300'
                        : 'text-[#A62B3A] hover:text-[#8a2232] hover:scale-105'
                    }`}
                    aria-label="Next dish"
                  >
                    <svg className="w-12 h-12 sm:w-14 sm:h-14 shrink-0" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10}>
                      <path d="M44 130h164" />
                      <path d="M194.463 152.188 212.325 130l-17.862-22.188" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative ">
                <div
                  className="absolute left-1/2 top-1/2 w-full h-full"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${orbitRotation}deg)`,
                    transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    zIndex: 1,
                  }}
                >
                  {SLIDES.map((slide, i) => {
                    const angleDeg = i * STEP_DEG;
                    const isActive = i === activeIndex;
                    const baseSize = 96;
                    const activeSizeFactor = isBelowXl ? 0.6 : 0.8;
                    const activeSize = Math.round((baseSize + ACTIVE_SLIDE_EXTRA_PX) * activeSizeFactor);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => goTo(i)}
                        className="absolute left-1/2 top-1/2 rounded-full overflow-hidden shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A62B3A] focus-visible:ring-offset-2 transition-[transform,box-shadow] duration-300 hover:scale-110 border-2 border-white"
                        style={{
                          transform: `rotate(${angleDeg}deg) translateY(-${ORBIT_RADIUS}px) rotate(${-angleDeg}deg)`,
                          transformOrigin: 'center center',
                          zIndex: isActive ? 10 : 1,
                          width: activeSize,
                          height: activeSize,
                          marginLeft: -activeSize / 2,
                          marginTop: -activeSize / 2,
                          boxShadow: isActive
                            ? '0 20px 40px -10px rgba(166, 43, 58, 0.4), 0 0 0 3px rgba(166, 43, 58, 0.35)'
                            : '0 8px 24px -4px rgba(0,0,0,0.2)',
                          opacity: 1,
                          visibility: 'visible',
                          pointerEvents: 'auto',
                        }}
                        aria-label={`View ${slide.title}`}
                        aria-current={isActive ? 'true' : undefined}
                      >
                        <Image
                          src={slide.src}
                          alt={slide.alt}
                          fill
                          className="object-cover"
                          sizes={`${activeSize}px`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Right section – Curated selection card (hidden below 800px; in-flow copy shown then) */}
      <div
        className="hidden min-[800px]:flex absolute right-4 sm:right-6 lg:right-[15%] 2xl:right-20 top-1/2 
        -translate-y-1/2 flex-col justify-center py-8 sm:py-10 lg:py-12 px-5 
        sm:px-6 lg:px-8 2xl:px-10 max-w-[280px] sm:max-w-[400px] 
        lg:max-w-lg 2xl:max-w-md z-20 rounded-2xl sm:rounded-3xl
         bg-white/60 backdrop-blur-xl border border-white/70 
         shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
        aria-hidden
      >
        <span className="text-[10px] sm:text-xs 2xl:text-sm font-medium tracking-[0.2em] uppercase text-[#A62B3A]/90 mb-2 sm:mb-3 2xl:mb-4 block">
          {SLIDES[activeIndex].subtitle ?? 'Curated selection'}
        </span>
        <AnimatePresence mode="wait">
          <motion.p
            key={activeIndex}
            className="font-serif text-lg sm:text-xl 2xl:text-2xl font-medium text-[#2C2F24] mb-3 sm:mb-4 2xl:mb-5 tracking-tight"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
          >
            {SLIDES[activeIndex].title}
          </motion.p>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.p
            key={activeIndex}
            className="text-[#414536] font-dm-sans leading-relaxed text-blog-body"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
          >
            {SLIDES[activeIndex].description}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Left and right arrows at bottom of section (hidden below 800px; in-flow arrows shown then) */}
      <div className="hidden min-[800px]:flex absolute bottom-6 sm:bottom-8 lg:bottom-10 left-0 right-0 items-center justify-center gap-8 sm:gap-12 z-20">
        <button
          type="button"
          onClick={prev}
          disabled={activeIndex === 0}
          className={`flex items-center justify-center p-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A62B3A] focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed ${
            activeIndex === 0
              ? 'text-gray-300'
              : 'text-[#A62B3A] hover:text-[#8a2232] hover:scale-105'
          }`}
          aria-label="Previous dish"
        >
          <svg className="w-12 h-12 sm:w-14 sm:h-14 shrink-0" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10}>
            <path d="M212 130H48" />
            <path d="M61.537 152.188 43.675 130l17.862-22.188" />
          </svg>
        </button>
        <button
          type="button"
          onClick={next}
          disabled={activeIndex === TOTAL - 1}
          className={`flex items-center justify-center p-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A62B3A] focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed ${
            activeIndex === TOTAL - 1
              ? 'text-gray-300'
              : 'text-[#A62B3A] hover:text-[#8a2232] hover:scale-105'
          }`}
          aria-label="Next dish"
        >
          <svg className="w-12 h-12 sm:w-14 sm:h-14 shrink-0" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10}>
            <path d="M44 130h164" />
            <path d="M194.463 152.188 212.325 130l-17.862-22.188" />
          </svg>
        </button>
      </div>
    </section>
  );
}
