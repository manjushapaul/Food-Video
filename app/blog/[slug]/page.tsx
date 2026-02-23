import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import { getHeader, getFooter, getBlogPostBySlug, getBlogPosts } from '@/lib/strapi';
import type { Metadata } from 'next';

// Simple Blocks Renderer for Strapi 5 Blocks
function BlocksRenderer({ content }: { content: any }) {
    if (!content || !Array.isArray(content)) return null;

    return (
        <div className="prose prose-lg max-w-none text-[#495460] ">
            {content.map((block: any, index: number) => {
                switch (block.type) {
                    case 'paragraph':
                        return (
                            <p key={index} className='m-0 mb-1 text-base xl:text-lg'>
                                {block.children?.map((child: any, i: number) => (
                                    <span key={i} style={{
                                        fontWeight: child.bold ? 'bold' : 'normal',
                                        fontStyle: child.italic ? 'italic' : 'normal',
                                        textDecoration: child.underline ? 'underline' : 'none'
                                    }}>
                                        {child.text}
                                    </span>
                                ))}
                            </p>
                        );
                    case 'heading':
                        const HeadingTag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
                        return (
                            <HeadingTag key={index} className="font-serif text-[#2C2F24] mb-4 mt-8">
                                {block.children?.map((child: any, i: number) => child.text).join('')}
                            </HeadingTag>
                        );
                    case 'list':
                        const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
                        return (
                            <ListTag key={index} className="list-inside list-disc mb-6 space-y-2">
                                {block.children?.map((item: any, i: number) => (
                                    <li key={i}>
                                        {item.children?.map((child: any, j: number) => child.text).join('')}
                                    </li>
                                ))}
                            </ListTag>
                        );
                    case 'image':
                        return (
                            <div key={index} className="my-12">
                                <div className="relative w-full rounded-2xl overflow-hidden shadow-md">
                                    <Image
                                        src={block.image?.url ?? ''}
                                        alt={block.image?.alternativeText ?? ''}
                                        width={block.image?.width ?? 1200}
                                        height={block.image?.height ?? 600}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                                {block.image?.caption && (
                                    <p className="text-center text-sm text-[#737865] mt-3 italic">
                                        {block.image.caption}
                                    </p>
                                )}
                            </div>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = await getBlogPostBySlug(params.slug);
    return {
        title: post ? `${post.title} - Bistro Boss` : 'Blog Post - Bistro Boss',
        description: post?.excerpt || 'Read our latest blog post.',
    };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const [header, footer, post, latestPosts] = await Promise.all([
        getHeader(),
        getFooter(),
        getBlogPostBySlug(params.slug),
        getBlogPosts(5), // For "Read More" section
    ]);

    if (!post) {
        notFound();
    }

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

    const otherPosts = latestPosts.filter(p => p.slug !== params.slug).slice(0, 4);

    return (
        <div className="bg-white min-h-screen">
            <HeroSection hero={null} header={headerProps} headerOnly />

            <main >
                <div className='bg-[#F9F9F7]'>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 md:pt-24">
                        {/* Title */}
                        <div className="text-center mb-12">
                            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#2C2F24] leading-tight mb-8">
                                {post.title}
                            </h1>
                        </div>

                        {/* Detail Image */}
                        {post.detailImage && (
                            <div className="relative w-full overflow-hidden mb-16 shadow-lg">
                                <Image
                                    src={post.detailImage.url}
                                    alt={post.title ?? ''}
                                    width={1640}
                                    height={660}
                                    className="w-full h-auto object-contain"
                                    priority
                                />
                            </div>
                        )}

                        {/* Content */}
                        <article className="mx-auto mb-20">
                            <BlocksRenderer content={post.content} />
                        </article>

                        {/* Gallery */}
                        {post.gallery && post.gallery.length > 0 && (
                            <div className="mb-24">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {post.gallery.map((img, idx) => (
                                        <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                                            <Image
                                                src={img.url}
                                                alt={`Gallery image ${idx + 1}`}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
                {/* Read More Section */}
                <section>
                    <div className="mx-auto text-center pt-16 mb-16">
                        <h2 className="font-serif text-4xl md:text-5xl text-[#2C2F24] mb-4">Read More Articles</h2>
                        <p className="text-[#495460] max-w-xl mx-auto">
                            We consider all the drivers of change gives you the components you need to change to create a truly happens.
                        </p>
                    </div>

                    <div className="max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 md:pb-32 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {otherPosts.map((otherPost) => (
                            <Link key={otherPost.id} href={`/blog/${otherPost.slug}`} className="group">
                                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full border border-[#DBDFD0]">
                                    {otherPost.image && (
                                        <div className="relative aspect-[4/3] w-full">
                                            <Image
                                                src={otherPost.image.url}
                                                alt={otherPost.title ?? ''}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <p className="text-[#737865] text-xs font-dm-sans font-medium mb-2 uppercase tracking-wider">
                                            {otherPost.date ? new Date(otherPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                                        </p>
                                        <h3 className="text-[#2C2F24] font-dm-sans text-lg font-bold leading-snug group-hover:text-[#AD343E] transition-colors duration-300 line-clamp-2">
                                            {otherPost.title}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>

            <Footer {...(footerProps ?? {})} />
        </div>
    );
}
