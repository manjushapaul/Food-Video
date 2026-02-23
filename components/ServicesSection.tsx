'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useIsTabletUp } from '@/hooks/useIsTabletUp';

interface ServiceCard {
  title: string;
  image: string;
  description: string;
}

const services: ServiceCard[] = [
  {
    title: 'Caterings',
    image: '/images/kebab-set-table 1.png',
    description: 'In the new era of technology we look in the future with certainty for life.',
  },
  {
    title: 'Birthdays',
    image: '/images/Mask group.png',
    description: 'In the new era of technology we look in the future with certainty for life.',
  },
  {
    title: 'Weddings',
    image: '/images/happy-man-wife-sunny-day 1.png',
    description: 'In the new era of technology we look in the future with certainty for life.',
  },
  {
    title: 'Events',
    image: '/images/cater.png',
    description: 'In the new era of technology we look in the future with certainty for life.',
  },
];

export default function ServicesSection() {
  const isTabletUp = useIsTabletUp();

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
      scale: 0.9,
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

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.5,
      },
    },
  };

  return (
    <section id="services" className="py-8 lg:py-24 xl:py-32 bg-[#fff]">
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
          className="text-center font-serif text-3xl md:text-4xl lg:text-[40px] lg:leading-[40px] font-medium 2xl:leading-[60px] leading-tight mb-10 
          md:mb-12"
          style={{ color: '#2C2F24' }}
        >
          We also offer unique services for your events
        </motion.h2>

        {/* Services Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial={isTabletUp ? 'hidden' : false}
          whileInView={isTabletUp ? 'visible' : undefined}
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              initial={isTabletUp ? undefined : false}
              whileHover={isTabletUp ? { 
                y: -8,
                transition: { duration: 0.3 }
              } : undefined}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              {/* Service Image */}
              <motion.div 
                className="relative w-full h-48 md:h-56 lg:h-64 overflow-hidden"
                variants={isTabletUp ? imageVariants : undefined}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                  quality={90}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </motion.div>

              {/* Service Content */}
              <motion.div 
                className="p-4 md:p-6"
                variants={isTabletUp ? contentVariants : undefined}
              >
                <motion.h3 
                  className="font-serif text-xl md:text-2xl font-medium mb-3" 
                  style={{ color: '#2C2F24' }}
                  whileHover={isTabletUp ? { scale: 1.05 } : undefined}
                  transition={{ duration: 0.2 }}
                >
                  {service.title}
                </motion.h3>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: '#414536' }}>
                  {service.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
