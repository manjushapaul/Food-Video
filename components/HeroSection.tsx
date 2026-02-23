'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useIsTabletUp } from '@/hooks/useIsTabletUp';

export interface HeroStrapiProps {
  title?: string;
  subtitle?: string;
  image?: { url: string } | null;
  cta?: string;
  ctalink?: string;
  SecondaryCta?: string;
  SecondaryCtaLink?: string;
}

export interface HeaderStrapiProps {
  logo?: { url: string } | null;
  logoLink?: string;
  navLinks?: { label: string; href: string }[];
  ctaText?: string;
  ctaLink?: string;
}

export default function HeroSection({
  hero,
  header,
  headerOnly = false,
}: {
  hero?: HeroStrapiProps | null;
  header?: HeaderStrapiProps | null;
  headerOnly?: boolean;
}) {
  const isTabletUp = useIsTabletUp();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = header?.navLinks?.map((l) => ({ href: l.href, label: l.label })) ?? [];
  const logoUrl = header?.logo?.url ?? null;
  const logoLink = header?.logoLink ?? '/';
  const ctaText = header?.ctaText ?? '';
  const ctaLink = header?.ctaLink ?? '#';

  return (
    <main className="relative">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isScrolled ? 'liquid-glass-scrolled' : 'liquid-glass'
          }`}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div
              initial={isTabletUp ? { opacity: 0, x: -8 } : false}
              animate={isTabletUp ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex-shrink-0"
            >
              <Link href={logoLink} className="flex items-center">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="Logo"
                    width={150}
                    height={50}
                    className="h-10 w-auto"
                    priority
                  />
                ) : (
                  <span className="h-10 text-lg font-semibold text-gray-800">Logo</span>
                )}
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <motion.div
                    key={link.href}
                    initial={isTabletUp ? { opacity: 0, y: -4 } : false}
                    animate={isTabletUp ? { opacity: 1, y: 0 } : undefined}
                    transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <Link
                      href={link.href}
                      className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${isActive
                          ? 'bg-[#DBDFD0] text-[#2C2F24]'
                          : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              {ctaText && (
                <Link href={ctaLink}>
                  <motion.span
                    initial={isTabletUp ? { opacity: 0, scale: 0.98 } : false}
                    animate={isTabletUp ? { opacity: 1, scale: 1 } : undefined}
                    transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-block hover:bg-[#8B2330] border border-[#2C2F24] hover:border-[#8B2330] text-[#182226] hover:text-white px-6 py-2.5 rounded-full text-sm font-semibold"
                  >
                    {ctaText}
                  </motion.span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md transition-colors text-gray-900"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-3 py-2 font-medium rounded-md ${isActive
                        ? 'bg-[#DBDFD0] text-[#2C2F24]'
                        : 'text-gray-700 hover:text-maroon-600'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href={ctaLink}
                className="block w-full mt-4 bg-[#A62B3A] hover:bg-[#8B2330] text-white px-6 py-2.5 rounded-full text-sm font-semibold text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {ctaText}
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section - skip when headerOnly (e.g. /about page) */}
      {!headerOnly && (
        <section className="relative flex items-center justify-center overflow-hidden bg-white h-screen">
          {/* Background Image - from Strapi */}
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0.92 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            {hero?.image?.url && (
              <Image
                src={hero.image.url}
                alt={hero.title || 'Background'}
                fill
                className="object-cover"
                priority
                quality={90}
                sizes="100vw"
              />
            )}
            <div className="absolute inset-0" />
          </motion.div>

          {/* Content Container – each child animates with stagger */}
          <motion.div
            className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex items-center"
          >
            <div className="grid grid-cols-1 gap-8 lg:gap-16 items-center w-full py-10">
              <motion.div
                className="w-full max-w-3xl mx-auto text-center space-y-6 lg:space-y-8 rounded-2xl p-6 lg:p-8"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
                  },
                }}
              >
                {/* Main Heading */}
                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="font-serif font-medium text-6xl md:text-7xl lg:text-8xl"
                  style={{
                    lineHeight: 'clamp(60px, 6vw, 84px)',
                    color: '#2C2F24',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {hero?.title ?? ''}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="text-md md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-lg font-sans mx-auto"
                >
                  {hero?.subtitle ?? ''}
                </motion.p>

                {/* Buttons - from Strapi */}
                {(hero?.cta || hero?.SecondaryCta) && (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="flex flex-col sm:flex-row gap-4 pt-2 justify-center"
                  >
                    <Link href={hero?.ctalink ?? '#'}>
                      <motion.span
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-block bg-[#A62B3A] hover:bg-[#8B2330] text-white px-8 py-4 rounded-full text-base font-bold transition-all duration-300 shadow-lg hover:shadow-xl text-center cursor-pointer"
                      >
                        {hero?.cta ?? ''}
                      </motion.span>
                    </Link>
                    {hero?.SecondaryCta && (
                      <Link href={hero?.SecondaryCtaLink ?? '#'}>
                        <motion.span
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className="inline-block border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 text-center cursor-pointer"
                        >
                          {hero.SecondaryCta}
                        </motion.span>
                      </Link>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </section>
      )}
      {headerOnly}
    </main>
  );
}
