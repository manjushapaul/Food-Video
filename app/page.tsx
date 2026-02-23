import { Suspense } from 'react';
import HeroSection from '@/components/HeroSection';
import CircularSliderSection from '@/components/CircularSliderSection';
import MenuSection from '@/components/MenuSection';
import AboutSection from '@/components/AboutSection';
import FeaturesSection from '@/components/FeaturesSection';
import DeliverySection from '@/components/DeliverySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BlogSection from '@/components/BlogSection';
import Footer from '@/components/Footer';
import { getHero, getHeader, getFeatures, getFeaturesSection, getMenus, getMenuSection, getSignatureDishes, getAboutSection, getDeliverySection, getTestimonials, getTestimonialsSection, getBlogPosts, getBlogSection, getFooter } from '@/lib/strapi';
import { truncateWords } from '@/lib/text';
import type { Metadata } from 'next';

// SEO from Strapi hero (SSG/ISR compatible)
export async function generateMetadata(): Promise<Metadata> {
  try {
    const hero = await getHero();
    const meta = hero?.seo;
    if (meta?.metaTitle || meta?.metaDescription) {
      return {
        title: meta.metaTitle ?? undefined,
        description: meta.metaDescription ?? undefined,
      };
    }
  } catch {
    // fallback to layout defaults
  }
  return {};
}

async function HeroData() {
  const [hero, header] = await Promise.all([getHero(), getHeader()]);
  const heroProps = hero
    ? {
      title: hero.title ?? undefined,
      subtitle: hero.subtitle ?? undefined,
      image: hero.image ? { url: hero.image.url } : null,
      cta: hero.cta ?? undefined,
      ctalink: hero.ctalink ?? undefined,
      SecondaryCta: hero.SecondaryCta ?? undefined,
      SecondaryCtaLink: hero.SecondaryCtaLink ?? undefined,
    }
    : null;
  const headerProps = header
    ? {
      logo: header.logo ? { url: header.logo.url } : null,
      logoLink: header.logoLink ?? undefined,
      navLinks: header.navLinks?.map((l) => ({ label: l.label, href: l.href })),
      ctaText: header.ctaText ?? undefined,
      ctaLink: header.ctaLink ?? undefined,
    }
    : null;
  return <HeroSection hero={heroProps} header={headerProps} />;
}

async function SignatureDishesData() {
  const data = await getSignatureDishes();
  const dishes = data?.dishes?.map((d) => ({
    image: d.image ? { url: d.image.url } : null,
    subtitle: d.subtitle,
    name: d.name,
    description: d.description,
  }));
  return (
    <CircularSliderSection
      title={data?.title}
      subtitle={data?.subtitle}
      dishes={dishes}
    />
  );
}

const HOME_ABOUT_MAX_WORDS = 300;
const DEFAULT_ABOUT_HEADLINE = 'We provide healthy food for your family.';
const DEFAULT_ABOUT_PARAGRAPH =
  "Our story began with a vision to create a unique dining experience that merges fine dining, exceptional service, and a vibrant ambiance. Rooted in city's rich culinary culture, we honor our local roots while infusing a global palate. At our place, we believe that dining is not just about food, but also about the overall experience.";

async function AboutData() {
  const about = await getAboutSection();
  const combined = about
    ? [about.firstParagraph, about.secondParagraph].filter(Boolean).join(' ')
    : '';
  const truncated = truncateWords(combined || DEFAULT_ABOUT_PARAGRAPH, HOME_ABOUT_MAX_WORDS);
  const props = about
    ? {
      image: about.image ? { url: about.image.url } : null,
      contactBoxTitle: about.contactBoxTitle,
      contactPhone: about.contactPhone,
      contactEmail: about.contactEmail,
      contactAddress: about.contactAddress,
      headline: about.headline,
      firstParagraph: truncated || about.firstParagraph || DEFAULT_ABOUT_PARAGRAPH,
      secondParagraph: undefined as string | undefined,
      ctaText: about.ctaText,
      ctaLink: about.ctaLink || '/about',
    }
    : {
      image: null,
      contactBoxTitle: 'Come and visit us',
      contactPhone: '(414) 857 - 0107',
      contactEmail: 'happytummy@restaurant.com',
      contactAddress: '637 W Marshalltown, IA 50158, Los Angeles',
      headline: DEFAULT_ABOUT_HEADLINE,
      firstParagraph: truncated,
      secondParagraph: undefined as string | undefined,
      ctaText: 'More About Us',
      ctaLink: '/about',
      fallbackImage: '/images/about.png',
    };
  return <AboutSection {...props} contactCardPosition="bottom-right" />;
}

async function MenuData() {
  const [menus, menuSection] = await Promise.all([getMenus(), getMenuSection()]);
  const cards =
    menus?.map((m) => ({
      id: m.id,
      title: m.title ?? '',
      icon: m.icon?.url ?? null,
      description: m.description ?? undefined,
    })) ?? null;
  return (
    <MenuSection
      sectionTitle={menuSection?.title}
      menuCards={cards}
    />
  );
}

async function FeaturesData() {
  const [features, featuresSection] = await Promise.all([getFeatures(), getFeaturesSection()]);
  const list =
    features?.map((f) => ({
      id: f.id,
      title: f.title ?? undefined,
      desc: f.desc ?? undefined,
      icon: f.icon ? { url: f.icon.url } : null,
    })) ?? null;
  return (
    <FeaturesSection
      sectionTitle={featuresSection?.title}
      features={list}
    />
  );
}

async function DeliveryData() {
  const strapiData = await getDeliverySection();
  console.log('[DeliveryData] strapiData:', JSON.stringify(strapiData, null, 2));

  // FALLBACK MOCK IF NO DATA
  const data = strapiData || {
    title: "Hardcoded Fallback Title",
    description: "Data fetch failed, showing fallback.",
    // Partial mock structure
    features: [{ text: "Mock feature 1", icon: { url: "/images/mock.png" } }],
    imageLeft: undefined,
    imageMiddleTop: undefined,
    imageMiddleBottom: undefined,
  };

  const props = {
    title: data.title,
    description: data.description,
    imageLeft: data.imageLeft ? { url: data.imageLeft.url } : null,
    imageMiddleTop: data.imageMiddleTop ? { url: data.imageMiddleTop.url } : null,
    imageMiddleBottom: data.imageMiddleBottom ? { url: data.imageMiddleBottom.url } : null,
    features: data.features?.map((f) => ({
      icon: f.icon ? { url: f.icon.url } : null,
      text: f.text,
    })),
  };
  return <DeliverySection {...props} />;
}

async function TestimonialsData() {
  const [testimonials, testimonialsSection] = await Promise.all([getTestimonials(), getTestimonialsSection()]);
  const list =
    testimonials?.map((t) => ({
      headline: t.quote,
      text: t.review,
      name: t.author,
      location: t.location,
      avatar: t.photo ? { url: t.photo.url } : null,
    })) ?? null;
  return (
    <TestimonialsSection
      sectionTitle={testimonialsSection?.title}
      testimonials={list}
    />
  );
}

async function BlogData() {
  const [featuredPosts, regularPosts, blogSection] = await Promise.all([
    getBlogPosts(1, true),
    getBlogPosts(5, false),
    getBlogSection()
  ]);

  const posts = featuredPosts.length > 0
    ? [featuredPosts[0], ...regularPosts.slice(0, 4)]
    : regularPosts.slice(0, 5);

  const postsList =
    posts?.map((p) => ({
      id: p.id,
      slug: p.slug,
      image: p.image ? { url: p.image.url } : null,
      date: p.date ? new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined,
      title: p.title,
      excerpt: p.excerpt,
    })) ?? null;
  return (
    <BlogSection
      sectionTitle={blogSection?.title}
      buttonText={blogSection?.buttonText}
      buttonLink={blogSection?.buttonLink}
      posts={postsList}
    />
  );
}

async function FooterData() {
  const footer = await getFooter();
  const props = footer
    ? {
      logo: footer.logo ? { url: footer.logo.url } : null,
      logoLink: footer.logoLink,
      description: footer.description,
      socialLinks: footer.socialLinks?.map((s) => ({ icon: s.icon, href: s.href })),
      pagesTitle: footer.pagesTitle,
      pagesLinks: footer.pagesLinks,
      utilityTitle: footer.utilityTitle,
      utilityLinks: footer.utilityLinks,
      instagramTitle: footer.instagramTitle,
      instagramItems: footer.instagramItems?.map((i) => ({
        image: i.image ? { url: i.image.url } : null,
        link: i.link,
      })),
      copyrightText: footer.copyrightText,
    }
    : {};
  return <Footer {...props} />;
}

function HeroLoading() {
  return (
    <div className="relative flex items-center justify-center overflow-hidden bg-white h-screen min-h-[400px]">
      <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      <div className="relative z-10 text-center px-4">
        <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse" />
        <div className="h-5 w-96 max-w-full bg-gray-200 rounded mx-auto animate-pulse" />
      </div>
    </div>
  );
}

function MenuLoading() {
  return (
    <section id="menu" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto mb-12 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border rounded-lg p-6 md:p-8 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mb-6" />
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesLoading() {
  return (
    <section className="py-8 lg:py-24 bg-[#fff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-12 w-96 max-w-full bg-gray-200 rounded-lg mx-auto mb-12 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse mb-4 mx-auto" />
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3 mx-auto" />
              <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Suspense fallback={<HeroLoading />}>
        <HeroData />
      </Suspense>

      <SignatureDishesData />
      <Suspense fallback={<MenuLoading />}>
        <MenuData />
      </Suspense>
      <AboutData />

      <Suspense fallback={<FeaturesLoading />}>
        <FeaturesData />
      </Suspense>

      <DeliveryData />
      <TestimonialsData />
      <BlogData />
      <FooterData />
    </>
  );
}
