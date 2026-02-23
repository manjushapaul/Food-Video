'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useIsTabletUp } from '@/hooks/useIsTabletUp';

export interface TestimonialProps {
  headline?: string;
  text?: string;
  name?: string;
  location?: string;
  avatar?: string | { url: string } | null;
}

export interface TestimonialsSectionProps {
  sectionTitle?: string;
  testimonials?: TestimonialProps[] | null;
}

const DEFAULT_SECTION_TITLE = 'What Our Customers Say';

export default function TestimonialsSection({
  sectionTitle,
  testimonials,
}: TestimonialsSectionProps) {
  const list = testimonials ?? [];
  if (list.length === 0) return null;
  const isTabletUp = useIsTabletUp();
  const displayTitle = sectionTitle?.trim() || DEFAULT_SECTION_TITLE;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section id="testimonials" className="py-16 lg:py-24 xl:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.h2
          initial={isTabletUp ? { opacity: 0, y: 30 } : false}
          whileInView={isTabletUp ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="text-center font-serif text-3xl md:text-4xl lg:text-[40px] lg:leading-[40px] font-medium 2xl:leading-[60px] leading-tight mb-10 md:mb-12"
          style={{ color: '#2C2F24' }}
        >
          {displayTitle}
        </motion.h2>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial={isTabletUp ? 'hidden' : false}
          whileInView={isTabletUp ? 'visible' : undefined}
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 pb-2"
        >
          {list.map((testimonial, index) => {
            const avatarUrl = typeof testimonial.avatar === 'string' ? testimonial.avatar : testimonial.avatar?.url ?? '/images/healthy.png';
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                initial={isTabletUp ? undefined : false}
                whileHover={isTabletUp ? {
                  y: -8,
                  transition: { duration: 0.3 }
                } : undefined}
                className="bg-[#F8F8F8] rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {/* Headline */}
                <motion.h3
                  initial={isTabletUp ? { opacity: 0, y: 10 } : false}
                  whileInView={isTabletUp ? { opacity: 1, y: 0 } : undefined}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="font-serif text-sm sm:text-base md:text-xl lg:text-2xl font-medium mb-3 sm:mb-4"
                  style={{ color: '#A62B3A' }}
                >
                  "{testimonial.headline ?? ''}"
                </motion.h3>

                {/* Testimonial Text */}
                <motion.p
                  initial={isTabletUp ? { opacity: 0, y: 10 } : false}
                  whileInView={isTabletUp ? { opacity: 1, y: 0 } : undefined}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6"
                  style={{ color: '#414536' }}
                >
                  {testimonial.text ?? ''}
                </motion.p>

                {/* Separator */}
                <div className="border-t border-gray-300 mb-4 sm:mb-6"></div>

                {/* Customer Details */}
                <motion.div
                  initial={isTabletUp ? { opacity: 0, y: 10 } : false}
                  whileInView={isTabletUp ? { opacity: 1, y: 0 } : undefined}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  {/* Avatar */}
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={avatarUrl}
                      alt={testimonial.name ?? ''}
                      fill
                      className="object-cover"
                      quality={90}
                      sizes="56px"
                    />
                  </div>

                  {/* Name and Location */}
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm md:text-base" style={{ color: '#2C2F24' }}>
                      {testimonial.name ?? ''}
                    </h4>
                    <p className="text-[10px] sm:text-xs md:text-sm" style={{ color: '#414536' }}>
                      {testimonial.location ?? ''}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
