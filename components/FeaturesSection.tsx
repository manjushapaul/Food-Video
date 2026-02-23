'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useIsTabletUp } from '@/hooks/useIsTabletUp';

export interface FeatureStrapiProps {
  id?: number;
  title?: string;
  desc?: string;
  icon?: { url: string } | null;
}

export interface FeaturesSectionProps {
  sectionTitle?: string;
  features?: FeatureStrapiProps[] | null;
}

export default function FeaturesSection({ sectionTitle, features }: FeaturesSectionProps) {
  const isTabletUp = useIsTabletUp();
  const list = features ?? [];
  if (list.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section id="features" className="py-12 lg:py-20 xl:py-28 bg-[#fff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left-aligned title */}
        <motion.h2
          initial={isTabletUp ? { opacity: 0, y: 30 } : false}
          whileInView={isTabletUp ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-serif text-3xl md:text-4xl lg:text-[40px] lg:leading-[40px] font-medium 2xl:leading-[60px] leading-tight mb-10 md:mb-14 max-w-xl"
          style={{ color: '#2C2F24' }}
        >
          {sectionTitle}
        </motion.h2>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial={isTabletUp ? 'hidden' : false}
          whileInView={isTabletUp ? 'visible' : undefined}
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6"
        >
          {list.map((feature, index) => (
            <motion.div
              key={feature.id ?? feature.title ?? index}
              variants={cardVariants}
              className="group cursor-pointer"
            >
              {/* Large rectangular image with rounded corners */}
              <div className="relative w-full aspect-[3/4] mb-5 rounded-xl overflow-hidden bg-gray-100">
                {feature.icon?.url && <Image
                  src={feature.icon.url}
                  alt={feature.title ?? ''}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />}
              </div>
              {/* Left-aligned title */}
              <h3 className="font-serif text-xl md:text-2xl font-medium mb-2" style={{ color: '#2C2F24' }}>
                {feature.title ?? 'Feature'}
              </h3>
              {/* Left-aligned description */}
              <p className="text-sm md:text-base leading-relaxed" style={{ color: '#5C5C5C' }}>
                {feature.desc ?? ''}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
