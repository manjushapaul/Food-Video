'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useIsTabletUp } from '@/hooks/useIsTabletUp';
import { useRouter } from 'next/navigation';

export interface MenuCardProps {
  id?: number | string;
  title: string;
  icon?: string | null;
  description?: string;
}

export interface MenuSectionProps {
  sectionTitle?: string;
  menuCards?: MenuCardProps[] | null;
}

export default function MenuSection({ sectionTitle, menuCards }: MenuSectionProps) {
  const cards = menuCards ?? [];
  if (cards.length === 0) return null;
  const isTabletUp = useIsTabletUp();

  const gridVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
        delayChildren: 0,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
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

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3,
      },
    },
  };

  const sectionVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const router = useRouter();

  return (
    <section id="menu" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section content – title then each card animate in sequence */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={sectionVariants}
        >
          {/* Section Title */}
          <motion.h2
            variants={titleVariants}
            className="text-center font-serif text-3xl md:text-4xl lg:text-[40px] lg:leading-[40px] font-medium 2xl:leading-[60px] leading-tight text-gray-900 mb-12 md:mb-16"
          >
            {sectionTitle}
          </motion.h2>

          {/* Menu Cards Grid – cards stagger after title */}
          <motion.div
            variants={gridVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
          {cards.map((card, index) => (
            <motion.div
              key={card.id ?? `${card.title}-${index}`}
              variants={cardVariants}
              initial={isTabletUp ? undefined : false}
              whileHover={isTabletUp ? { 
                y: -10,
                transition: { duration: 0.3 }
              } : undefined}
              className="bg-white border rounded-lg p-6 md:p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              style={{ borderColor: '#DBDFD0' }}
            >
              {/* Icon with ripple effect */}
              <motion.div 
                className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6 overflow-hidden"
                variants={isTabletUp ? iconVariants : undefined}
                initial={isTabletUp ? undefined : false}
                whileHover={isTabletUp ? 'hover' : undefined}
              >
                {/* Ripple rings */}
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute inset-0 rounded-full border-2  border-[#ddd] pointer-events-none"
                    animate={{
                      scale: [0.3, 1.1, 1.1],
                      opacity: [0.4, 0.15, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.65,
                      ease: 'easeOut',
                    }}
                  />
                ))}
                <span className="relative z-10 flex items-center justify-center">
                  <Image
                    src={card.icon || '/images/cup.svg'}
                    alt={card.title}
                    width={48}
                    height={48}
                    className="w-12 h-12 md:w-14 md:h-14"
                  />
                </span>
              </motion.div>

              {/* Title */}
              <motion.h3 
                className="text-xl md:text-2xl font-bold text-gray-900 mb-4"
                whileHover={isTabletUp ? { scale: 1.05 } : undefined}
                transition={{ duration: 0.2 }}
              >
                {card.title}
              </motion.h3>

              {/* Description */}
              <motion.p 
                className="text-gray-600 text-sm md:text-base leading-relaxed mb-6 flex-grow"
                initial={isTabletUp ? { opacity: 0 } : false}
                whileInView={isTabletUp ? { opacity: 1 } : undefined}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              >
                {card.description}
              </motion.p>

              {/* Explore Menu Button */}
              <motion.button
                type="button"
                className="text-[#A62B3A] font-semibold underline hover:text-[#8B2330] transition-colors duration-300"
                whileHover={isTabletUp ? { scale: 1.1 } : undefined}
                whileTap={isTabletUp ? { scale: 0.95 } : undefined}
                onClick={() => {
                  const tab = card.title ?? '';
                  const url = tab ? `/menu?tab=${encodeURIComponent(tab)}` : '/menu';
                  router.push(url);
                }}
              >
                Explore Menu
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
