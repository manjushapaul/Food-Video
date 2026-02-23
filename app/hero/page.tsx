import HeroSection from '@/components/HeroSection';
import { getHero, getHeader } from '@/lib/strapi';

export default async function HeroPage() {
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
