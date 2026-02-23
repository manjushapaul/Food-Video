'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useIsTabletUp } from '@/hooks/useIsTabletUp';

const DEFAULT_HEADLINE = 'We provide healthy food for your family.';
const DEFAULT_CONTACT_TITLE = 'Come and visit us';
const DEFAULT_PARAGRAPH_1 =
  "Our story began with a vision to create a unique dining experience that merges fine dining, exceptional service, and a vibrant ambiance. Rooted in city's rich culinary culture, we honor our local roots while infusing a global palate.";
const DEFAULT_PARAGRAPH_2 =
  'At our place, we believe that dining is not just about food, but also about the overall experience. Our staff, renowned for their warmth and dedication, strives to make every visit an unforgettable event.';
const DEFAULT_ADDRESS = '637 W Marshalltown, IA 50158, Los Angeles';

export interface AboutSectionProps {
  image?: { url: string } | null;
  contactBoxTitle?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactAddress?: string;
  headline?: string;
  firstParagraph?: string;
  secondParagraph?: string;
  /** Third paragraph – only displayed on /about page when passed */
  thirdParagraph?: string;
  ctaText?: string;
  ctaLink?: string;
  /** Dark right column (black bg, light text); default light = white/light bg, dark text per Figma */
  variant?: 'light' | 'dark';
  /** Local image path when Strapi has no image (e.g. /images/about.png) */
  fallbackImage?: string;
  /** Contact card position: bottom-left (Figma about page) or bottom-right (home page) */
  contactCardPosition?: 'bottom-left' | 'bottom-right';
  /** Section id for anchor links; use a different id on the dedicated about page to separate from home */
  sectionId?: string;
  /** When false, render a div instead of section (use when wrapping in your own section, e.g. about page) */
  asSection?: boolean;
  /** When false, hide the "More About Us" / CTA button (e.g. on the dedicated about page) */
  showCta?: boolean;
}

export default function AboutSection(props: AboutSectionProps) {
  const {
    image,
    contactBoxTitle,
    contactPhone,
    contactEmail,
    contactAddress,
    headline,
    firstParagraph,
    secondParagraph,
    thirdParagraph,
    ctaText,
    ctaLink,
    variant = 'light',
    fallbackImage,
    contactCardPosition = 'bottom-left',
    sectionId = 'about',
    asSection = true,
    showCta = true,
  } = props;

  const imageUrl = image?.url || fallbackImage;
  const hasContent =
    imageUrl ||
    headline ||
    contactBoxTitle ||
    firstParagraph ||
    contactPhone ||
    contactEmail ||
    contactAddress;
  if (!hasContent) return null;

  const isDark = variant === 'dark';
  const isTabletUp = useIsTabletUp();
  const cardBottomLeft = contactCardPosition === 'bottom-left';

  const displayHeadline = headline || DEFAULT_HEADLINE;
  const displayContactTitle = contactBoxTitle || DEFAULT_CONTACT_TITLE;
  const displayFirst = firstParagraph || DEFAULT_PARAGRAPH_1;
  const displaySecond = secondParagraph || DEFAULT_PARAGRAPH_2;
  const displayThird = thirdParagraph;

  const sectionClassName = `py-8 xl:py-12 bg-[#F5F5F7]`;
  const Wrapper = asSection ? 'section' : 'div';
  return (
    <Wrapper
      {...(asSection ? { id: sectionId } : {})}
      className={sectionClassName}
      {...(!asSection ? { role: 'region', 'aria-label': 'About us content' } : {})}
    >
      <div className="max-w-7xl 2xl:max-w-8xl  py-8 mx-auto px-4 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-0 min-h-[420px] lg:min-h-[520px]">
          {/* Left Side - Food Image with Overlay Card */}
          <motion.div
            initial={isTabletUp ? { opacity: 0, x: -50 } : false}
            whileInView={isTabletUp ? { opacity: 1, x: 0 } : undefined}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative order-2 lg:order-1 min-h-[380px] lg:min-h-0"
          >
            {/* Food Image */}
            <motion.div
              className="relative w-full overflow-hidden bg-neutral-200 h-full min-h-[380px] md:min-h-[460px] lg:min-h-[520px] rounded-lg"
              whileHover={isTabletUp ? { scale: 1.01 } : undefined}
              transition={{ duration: 0.4 }}
            >
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="About our food and restaurant"
                  fill
                  className="object-cover"
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
            </motion.div>

            {/* Contact Overlay Card */}
            <motion.div
              initial={isTabletUp ? { opacity: 0, y: 30, scale: 0.98 } : false}
              whileInView={isTabletUp ? { opacity: 1, y: 0, scale: 1 } : undefined}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={isTabletUp ? { scale: 1.01, transition: { duration: 0.3 } } : undefined}
              className={`absolute max-w-[340px] md:max-w-[380px] rounded-xl 
                bg-[#474747] p-8 md:p-14 shadow-2xl
                bottom-[20px] right-[10px] lg:bottom-[-30px] lg:right-[-30px]`}
            >
              <div className="relative z-10">
              <h3 className="text-white text-xl md:text-2xl font-semibold mb-6">
                {displayContactTitle}
              </h3>
              <div className="space-y-5">
                {/* Phone */}
                <div className="flex items-center text-white text-sm md:text-base">
                  <svg
                    className="w-5 h-5 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{contactPhone || '(414) 857 - 0107'}</span>
                </div>

                {/* Email */}
                <div className="flex items-center text-white text-sm md:text-base">
                  <svg
                    className="w-5 h-5 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{contactEmail || 'happytummy@restaurant.com'}</span>
                </div>

                {/* Address */}
                <div className="flex items-start text-white text-sm md:text-base">
                  <svg
                    className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{contactAddress || DEFAULT_ADDRESS}</span>
                </div>
              </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Text */}
          <motion.div
            initial={isTabletUp ? { opacity: 0, x: 50 } : false}
            whileInView={isTabletUp ? { opacity: 1, x: 0 } : undefined}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={` flex flex-col justify-center p-8 md:p-10 lg:pl-24 rounded-lg order-1 lg:order-2 text-center lg:text-left `}
          >
            {/* Headline - large, bold, dark */}
            <motion.h2
              initial={isTabletUp ? { opacity: 0, y: 30 } : false}
              whileInView={isTabletUp ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.7, 
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className={`font-serif text-3xl md:text-4xl lg:text-[40px] lg:leading-[40px] font-medium 2xl:leading-[60px] leading-tight mb-6 ${isDark ? 'text-white' : 'text-[#2C2F24]'}`}
            >
              {displayHeadline}
            </motion.h2>

            {/* Paragraphs - readable size, dark grey on light bg */}
            <motion.p
              initial={isTabletUp ? { opacity: 0, y: 20 } : false}
              whileInView={isTabletUp ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`font-medium lg:text-lg leading-relaxed mb-4 text-[#2C2F24] `}
             
            >
              {displayFirst}
            </motion.p>

            <motion.p
              initial={isTabletUp ? { opacity: 0, y: 20 } : false}
              whileInView={isTabletUp ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`text-base md:text-lg leading-relaxed ${displayThird ? 'mb-4' : 'mb-6'} ${isDark ? 'text-gray-300' : 'text-[#4a4a4a]'}`}
             
            >
              {displaySecond}
            </motion.p>

            {/* Third paragraph – only shown on /about page when passed */}
            {displayThird && displayThird.trim() && (
              <motion.p
                initial={isTabletUp ? { opacity: 0, y: 20 } : false}
                whileInView={isTabletUp ? { opacity: 1, y: 0 } : undefined}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.48, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`text-base md:text-lg leading-relaxed mb-6 text-[#4a4a4a]`}
               
              >
                {displayThird.trim()}
              </motion.p>
            )}

            {/* More About Us Button */}
            {showCta && (ctaText || ctaLink) && (
              <motion.div
                initial={isTabletUp ? { opacity: 0, y: 20 } : false}
                whileInView={isTabletUp ? { opacity: 1, y: 0 } : undefined}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {ctaLink ? (
                  <Link
                    href={ctaLink}
                    className={`inline-block border-2 px-8 py-4 rounded-full font-semibold transition-all duration-300 ${
                      isDark
                        ? 'border-white text-white hover:bg-white hover:text-black'
                        : 'border-gray-600 text-[#414536] hover:bg-gray-800 hover:border-gray-500 hover:text-white'
                    }`}
                  >
                    {ctaText || 'More About Us'}
                  </Link>
                ) : (
                  <span
                    className={`inline-block border-2 px-8 py-4 rounded-full font-semibold ${
                      isDark ? 'border-white text-white' : 'border-gray-600 text-[#414536]'
                    }`}
                  >
                    {ctaText || 'More About Us'}
                  </span>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </Wrapper>
  );
}
