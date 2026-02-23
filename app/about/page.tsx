import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import {
  getHeader,
  getAboutSection,
  getFooter,
  getAboutVideoSection,
  getAboutGuestSection,
  getTestimonials,
  getTestimonialsSection,
} from '@/lib/strapi';
import AboutVideoSection from '@/components/AboutVideoSection';
import AboutGuestSection from '@/components/AboutGuestSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Bistro Boss',
  description:
    'Our story, your table. Learn how we bring healthy food and a unique dining experience to your family.',
};

export default async function AboutPage() {
  const [header, about, footer, aboutVideo, aboutGuest, testimonials, testimonialsSection] = await Promise.all([
    getHeader(),
    getAboutSection(),
    getFooter(),
    getAboutVideoSection(),
    getAboutGuestSection(),
    getTestimonials(),
    getTestimonialsSection(),
  ]);

  const headerProps = header
    ? {
        logo: header.logo ? { url: header.logo.url } : null,
        logoLink: header.logoLink ?? '/',
        navLinks: header.navLinks?.map((l) => ({ label: l.label, href: l.href })),
        ctaText: header.ctaText ?? undefined,
        ctaLink: header.ctaLink ?? undefined,
      }
    : null;

  const aboutProps = about
    ? {
        image: (about.aboutPageImage ?? about.image) ? { url: (about.aboutPageImage ?? about.image)!.url } : null,
        contactBoxTitle: about.contactBoxTitle,
        contactPhone: about.contactPhone,
        contactEmail: about.contactEmail,
        contactAddress: about.contactAddress,
        headline: about.headline,
        firstParagraph: about.firstParagraph,
        secondParagraph: about.secondParagraph,
        thirdParagraph: about.thirdParagraph,
        ctaText: about.ctaText,
        ctaLink: about.ctaLink,
      }
    : {};

  const footerProps = footer
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

  return (
    <>
      <HeroSection hero={null} header={headerProps} headerOnly />
      <section id="about-page" aria-label="About us">
        <AboutSection
          {...aboutProps}
          fallbackImage="/images/about.png"
          contactCardPosition="bottom-right"
          asSection={false}
          showCta={false}
        />
      </section>
      <AboutVideoSection
        backgroundImage={aboutVideo?.backgroundImage ? { url: aboutVideo.backgroundImage.url } : null}
        headline={aboutVideo?.headline}
        videoUrl={aboutVideo?.videoUrl}
        features={aboutVideo?.features?.map((f) => ({
          icon: f.icon ? { url: f.icon.url } : null,
          title: f.title,
          description: f.description,
        }))}
      />
      <AboutGuestSection
        heading={aboutGuest?.title}
        paragraph={aboutGuest?.subtitle}
        stats={aboutGuest?.stats?.map((s) => ({ value: s.value, label: s.label }))}
        image={aboutGuest?.image ? { url: aboutGuest.image.url } : null}
        fallbackImage="/images/abouts.png"
      />
      <TestimonialsSection
        sectionTitle={testimonialsSection?.title}
        testimonials={
          testimonials?.map((t) => ({
            headline: t.quote,
            text: t.review,
            name: t.author,
            location: t.location,
            avatar: t.photo ? { url: t.photo.url } : null,
          })) ?? null
        }
      />
      <Footer {...(footerProps ?? {})} />
    </>
  );
}
