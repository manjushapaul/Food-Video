import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { getHeader, getFooter, getContactPage } from '@/lib/strapi';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us - Bistro Boss',
    description: 'Get in touch with us for any inquiries or reservations.',
};

export default async function ContactPage() {
    const [header, footer, contactData] = await Promise.all([
        getHeader(),
        getFooter(),
        getContactPage(),
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

    const title = contactData?.title ?? 'Contact Us';
    const description = contactData?.description ?? 'We consider all the drivers of change gives you the components you need to change to create a truly happens.';

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Section */}
            <div className="bg-[#F9F9F7] pb-32">
                <HeroSection hero={null} header={headerProps} headerOnly />
                <div className="max-w-7xl mx-auto text-center pt-16 pb-24 md:pt-32 md:pb-16 px-4 sm:px-6 lg:px-8">
                    <h1 className="font-serif font-serif text-5xl md:text-6xl lg:text-7xl text-[#2C2F24] mb-6">
                        {title}
                    </h1>
                    <p className="font-dm-sans text-lg md:text-xl text-[#495460] max-w-2xl mx-auto leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="bg-white flex-grow relative px-4 sm:px-6 lg:px-8 pb-24 md:pb-32">
                {/* Contact Form overlapping the split */}
                <div className="max-w-7xl mx-auto relative -top-24 md:-top-32 z-10">
                    <div className="flex justify-center">
                        <ContactForm />
                    </div>
                </div>

                {/* Contact Info */}
                <div className="max-w-[800px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center md:text-left mt-0 md:mt-8">
                    {/* Call Us */}
                    <div className="space-y-4">
                        <h3 className="font-dm-sans font-bold text-xl text-[#2C2F24]">Call Us:</h3>
                        <p className="font-dm-sans text-xl font-bold text-[#AD343E]">
                            {contactData?.phone ?? '+1-234-567-8900'}
                        </p>
                    </div>

                    {/* Hours */}
                    <div className="space-y-4">
                        <h3 className="font-dm-sans font-bold text-xl text-[#2C2F24]">Hours:</h3>
                        <div className="font-dm-sans text-lg text-[#2C2F24] space-y-1">
                            {contactData?.hours ? (
                                <p className="whitespace-pre-line">{contactData.hours}</p>
                            ) : (
                                <>
                                    <p>Mon-Fri: 11am - 8pm</p>
                                    <p>Sat, Sun: 9am - 10pm</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Our Location */}
                    <div className="space-y-4">
                        <h3 className="font-dm-sans font-bold text-xl text-[#2C2F24]">Our Location:</h3>
                        <div className="font-dm-sans text-lg text-[#2C2F24] space-y-1">
                            {contactData?.address ? (
                                <p className="whitespace-pre-line">{contactData.address}</p>
                            ) : (
                                <>
                                    <p>123 Bridge Street</p>
                                    <p>Nowhere Land, LA 12345</p>
                                    <p>United States</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer {...(footerProps ?? {})} />
        </div>
    );
}
