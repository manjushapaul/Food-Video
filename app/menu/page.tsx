import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import MenuTabs from '@/components/MenuTabs';
import AppsSection from '@/components/AppsSection';
import { getHeader, getFooter, getMenuDishHeader } from '@/lib/strapi';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu - Bistro Boss',
  description: 'Browse our menu and discover delicious dishes for every taste.',
};

export default async function MenuPage() {
  const [header, footer, menuDishHeader] = await Promise.all([
    getHeader(),
    getFooter(),
    getMenuDishHeader(),
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

  const menuTitle = menuDishHeader?.title ?? 'Our Menu';
  const menuDescription =
    menuDishHeader?.description ??
    'We consider all the drivers of change gives you the components you need to change to create a truly happens.';

  return (
    <>
      <HeroSection hero={null} header={headerProps} headerOnly />
      <section className="w-full py-12 md:py-16" aria-label="Menu heading">
        <h1 className="font-serif font-normal text-center text-5xl md:text-6xl lg:text-7xl text-[#2C2F24]">
          {menuTitle}
        </h1>
        <p className="font-dm-sans font-normal text-center text-[18px] leading-[28px] text-[#495460] mt-6 max-w-2xl mx-auto">
          {menuDescription}
        </p>
        <div className="mt-12">
          <MenuTabs />
        </div>
      </section>
      <AppsSection
        title={menuDishHeader?.menuTitle}
        description={menuDishHeader?.menuDescription}
        appLogos={menuDishHeader?.appLogos}
      />
      <Footer {...(footerProps ?? {})} />
    </>
  );
}

