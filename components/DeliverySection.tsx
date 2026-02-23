'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useIsTabletUp } from '@/hooks/useIsTabletUp';

export interface DeliveryFeatureProps {
  icon?: { url: string } | string | null;
  text?: string;
}

export interface DeliverySectionProps {
  title?: string;
  description?: string;
  imageLeft?: { url: string } | null;
  imageMiddleTop?: { url: string } | null;
  imageMiddleBottom?: { url: string } | null;
  features?: DeliveryFeatureProps[] | null;
}

export default function DeliverySection({
  title,
  description,
  imageLeft,
  imageMiddleTop,
  imageMiddleBottom,
  features,
}: DeliverySectionProps) {
  const imgLeft = imageLeft?.url;
  const imgMiddleTop = imageMiddleTop?.url;
  const imgMiddleBottom = imageMiddleBottom?.url;
  const featureList = features ?? [];

  const isTabletUp = useIsTabletUp();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: -20,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.2,
      },
    },
    hover: {
      scale: 1.05,
      y: -25,
      transition: {
        duration: 0.4,
      },
    },
  };

  const imageVariantsSubtle = {
    hidden: { opacity: 0, scale: 0.96, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.15,
      },
    },
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.35,
      },
    },
  };

  return (
    <section id="delivery" className="py-8 lg:py-24 xl:py-32 bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial={isTabletUp ? 'hidden' : false}
          whileInView={isTabletUp ? 'visible' : undefined}
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {/* Left Section - Chef Image */}
          <motion.div
            variants={isTabletUp ? itemVariants : undefined}
            initial={isTabletUp ? undefined : false}
            className="col-span-1 lg:col-span-1 order-2 lg:order-1"
          >
            <motion.div
              className="relative w-full h-[400px] md:h-[500px] lg:h-full min-h-[600px] rounded-lg overflow-hidden"
              variants={isTabletUp ? imageVariants : undefined}
              initial={isTabletUp ? 'hidden' : false}
              whileInView={isTabletUp ? 'visible' : undefined}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={isTabletUp ? 'hover' : undefined}
            >
              {imgLeft && <Image
                src={imgLeft}
                alt="Chef preparing food"
                fill
                className="object-cover"
                quality={90}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />}
            </motion.div>
          </motion.div>

          {/* Middle Section - Two Food Images */}
          <div className="col-span-1 lg:col-span-1 order-3 lg:order-2 flex flex-col gap-4 md:gap-6">
            {/* Top Food Image */}
            <motion.div
              variants={isTabletUp ? itemVariants : undefined}
              initial={isTabletUp ? undefined : false}
              className="flex-1 min-h-[300px]"
            >
              <motion.div
                className="relative w-full h-full min-h-[300px] md:min-h-[350px] lg:min-h-[290px] rounded-lg overflow-hidden"
                variants={isTabletUp ? imageVariantsSubtle : undefined}
                initial={isTabletUp ? 'hidden' : false}
                whileInView={isTabletUp ? 'visible' : undefined}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={isTabletUp ? 'hover' : undefined}
              >
                {imgMiddleTop && <Image
                  src={imgMiddleTop}
                  alt="Delicious curry dish"
                  fill
                  className="object-cover"
                  quality={90}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />}
              </motion.div>
            </motion.div>

            {/* Bottom Food Image */}
            <motion.div
              variants={isTabletUp ? itemVariants : undefined}
              initial={isTabletUp ? undefined : false}
              className="flex-1 min-h-[300px]"
            >
              <motion.div
                className="relative w-full h-full min-h-[300px] md:min-h-[350px] lg:min-h-[290px] rounded-lg overflow-hidden"
                variants={isTabletUp ? imageVariantsSubtle : undefined}
                initial={isTabletUp ? 'hidden' : false}
                whileInView={isTabletUp ? 'visible' : undefined}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={isTabletUp ? 'hover' : undefined}
              >
                {imgMiddleBottom && <Image
                  src={imgMiddleBottom}
                  alt="Grilled meats and kebabs"
                  fill
                  className="object-cover"
                  quality={90}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />}
              </motion.div>
            </motion.div>
          </div>

          {/* Right Section - Promotional Text */}
          <motion.div
            variants={isTabletUp ? itemVariants : undefined}
            initial={isTabletUp ? undefined : false}
            className="col-span-2 lg:col-span-1 order-1 lg:order-3 rounded-lg p-6 md:p-8 lg:p-10 flex flex-col justify-center"
          >
            <motion.h2
              initial={isTabletUp ? { opacity: 0, y: 20 } : false}
              whileInView={isTabletUp ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-serif text-3xl md:text-4xl lg:text-[40px] lg:leading-[40px] font-medium 2xl:leading-[60px] leading-tight mb-6 text-[#2C2F24]"
            >
              {title}
            </motion.h2>

            <motion.p
              initial={isTabletUp ? { opacity: 0, y: 20 } : false}
              whileInView={isTabletUp ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-[#2C2F24] text-sm md:text-base leading-relaxed mb-8"
            >
              {description}
            </motion.p>

            {/* Features List */}
            <div className="space-y-4">
              {featureList.map((feature, index) => {
                const iconUrl = typeof feature.icon === 'string' ? feature.icon : feature.icon?.url;
                return (
                  <motion.div
                    key={index}
                    initial={isTabletUp ? { opacity: 0, x: -20 } : false}
                    whileInView={isTabletUp ? { opacity: 1, x: 0 } : undefined}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <motion.div
                      className="w-10 h-10 md:w-12 md:h-12 
                      rounded-full bg-[#A62B3A] flex items-center 
                      justify-center flex-shrink-0"
                      whileHover={isTabletUp ? { scale: 1.1, rotate: 5 } : undefined}
                      transition={{ duration: 0.2 }}
                    >
                      {iconUrl ? (
                        <Image
                          src={iconUrl}
                          alt={feature.text ?? ''}
                          width={18}
                          height={18}
                        />
                      ) : null}
                    </motion.div>
                    <span className="text-[#2C2F24] text-sm md:text-base font-medium">
                      {feature.text ?? ''}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
