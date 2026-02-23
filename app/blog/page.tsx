import Image from 'next/image';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import AppsSection from '@/components/AppsSection';
import { getHeader, getFooter, getBlogPosts, getBlogSection } from '@/lib/strapi';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog - Bistro Boss',
    description: 'Read our latest articles and updates about food and dining.',
};

export default async function BlogPage() {
    const [header, footer, blogSection, posts] = await Promise.all([
        getHeader(),
        getFooter(),
        getBlogSection(),
        getBlogPosts(), // Fetch all posts
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

    const sectionTitle = blogSection?.title ?? 'Our Blog & Articles';
    const sectionDescription = 'We consider all the drivers of change gives you the components you need to change to create a truly happens.';

    return (
        <>
            <HeroSection hero={null} header={headerProps} headerOnly />

            <section className="w-full py-16 md:py-24 bg-[#F9F9F7]">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#2C2F24] mb-6">
                            {sectionTitle}
                        </h1>
                        <p className="text-[#495460] max-w-2xl mx-auto text-lg">
                            {sectionDescription}
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {posts.map((post) => {
                            const imageUrl = post.image?.url;
                            const formattedDate = post.date
                                ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                                : '';

                            return (
                                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                                        {imageUrl && (
                                            <div className="relative aspect-[4/3] w-full">
                                                <Image
                                                    src={imageUrl}
                                                    alt={post.title ?? ''}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <p className="text-[#737865] font-dm-sans text-sm font-medium mb-3 uppercase tracking-wider">
                                                {formattedDate}
                                            </p>
                                            <h2 className="text-[#2C2F24] font-dm-sans text-xl font-bold leading-snug group-hover:text-[#AD343E] transition-colors duration-300 line-clamp-2">
                                                {post.title}
                                            </h2>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>


            <Footer {...(footerProps ?? {})} />
        </>
    );
}
