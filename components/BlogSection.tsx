'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useIsTabletUp } from '@/hooks/useIsTabletUp';

export interface BlogPostProps {
  id?: number;
  slug?: string;
  image?: string | { url: string } | null;
  date?: string;
  title?: string;
  excerpt?: string;
}

export interface BlogSectionProps {
  sectionTitle?: string;
  buttonText?: string;
  buttonLink?: string;
  posts?: BlogPostProps[] | null;
}

const DEFAULT_SECTION_TITLE = 'Our Blog & Articles';
const DEFAULT_BUTTON_TEXT = 'Read All Articles';
const DEFAULT_BUTTON_LINK = '/blog';

export default function BlogSection({
  sectionTitle,
  buttonText,
  buttonLink,
  posts,
}: BlogSectionProps) {
  const blogPosts = posts ?? [];
  if (blogPosts.length === 0) return null;
  const isTabletUp = useIsTabletUp();
  const displayTitle = sectionTitle?.trim() || DEFAULT_SECTION_TITLE;
  const displayButtonText = buttonText?.trim() || DEFAULT_BUTTON_TEXT;
  const displayButtonLink = buttonLink?.trim() || DEFAULT_BUTTON_LINK;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
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
    <section id="blog" className="py-8 lg:py-24 xl:py-32 bg-[#F9F9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={isTabletUp ? { opacity: 0, y: 30 } : false}
          whileInView={isTabletUp ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12"
        >
          {/* Title */}
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[40px] lg:leading-[40px] font-medium 2xl:leading-[60px] leading-tight text-text-dark">
            {displayTitle}
          </h2>

          {/* Read All Articles Button */}
          <Link href={displayButtonLink}>
            <motion.button
              whileHover={isTabletUp ? { scale: 1.05 } : undefined}
              whileTap={isTabletUp ? { scale: 0.95 } : undefined}
              className="bg-[#A62B3A] hover:bg-maroon-500 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-sm md:text-base transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {displayButtonText}
            </motion.button>
          </Link>
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          variants={containerVariants}
          initial={isTabletUp ? 'hidden' : false}
          whileInView={isTabletUp ? 'visible' : undefined}
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.75fr_0.75fr] gap-4 md:gap-6"
        >
          {/* Large Featured Card */}
          {blogPosts[0] && (() => {
            const featuredPost = blogPosts[0];
            const featuredImageUrl = typeof featuredPost.image === 'string' ? featuredPost.image : featuredPost.image?.url;
            const featuredHref = featuredPost.slug ? `/blog/${featuredPost.slug}` : '#';
            return (
              <Link href={featuredHref} className="lg:col-span-1">
                <motion.div
                  variants={cardVariants}
                  initial={isTabletUp ? undefined : false}
                  whileHover={isTabletUp ? {
                    y: -8,
                    transition: { duration: 0.3 }
                  } : undefined}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full"
                >
                  {featuredImageUrl && (
                    <div className="relative w-full h-[24.64rem] md:h-[30.8rem] lg:h-[36.96rem]">
                      <Image
                        src={featuredImageUrl}
                        alt={featuredPost.title ?? ''}
                        fill
                        className="object-cover"
                        quality={90}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <div className="p-4 md:p-6">
                    <p className="font-dm-sans font-medium mb-2 text-text-date text-blog-body">
                      {featuredPost.date ?? ''}
                    </p>
                    <h3 className="font-dm-sans font-medium mb-3 md:mb-4 leading-tight text-text-dark text-blog-title">
                      {featuredPost.title ?? ''}
                    </h3>
                    {featuredPost.excerpt && (
                      <p className="font-dm-sans leading-relaxed text-text-body text-blog-body">
                        {featuredPost.excerpt}
                      </p>
                    )}
                  </div>
                </motion.div>
              </Link>
            );
          })()}

          {/* Small Cards Grid (2x2) */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {blogPosts.slice(1).map((post, index) => {
              const imageUrl = typeof post.image === 'string' ? post.image : post.image?.url;
              const postHref = post.slug ? `/blog/${post.slug}` : '#';
              return (
                <Link key={post.id ?? index} href={postHref}>
                  <motion.div
                    variants={cardVariants}
                    initial={isTabletUp ? undefined : false}
                    whileHover={isTabletUp ? {
                      y: -8,
                      transition: { duration: 0.3 }
                    } : undefined}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full"
                  >
                    {imageUrl && (
                      <div className="relative w-full  lg:h-64">
                        <Image
                          src={imageUrl}
                          alt={post.title ?? ''}
                          width={0}
                          height={0}
                          className="object-cover w-full h-full"
                          quality={90}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>
                    )}

                    <div className="p-4 md:p-6">
                      <p className="font-dm-sans font-medium mb-2 text-text-date text-blog-body">
                        {post.date ?? ''}
                      </p>
                      <h3 className="font-dm-sans font-medium leading-tight text-text-dark text-blog-title line-clamp-2">
                        {post.title ?? ''}
                      </h3>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
