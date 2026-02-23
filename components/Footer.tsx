'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface FooterProps {
  logo?: { url: string } | null;
  logoLink?: string;
  description?: string;
  socialLinks?: { icon: 'twitter' | 'facebook' | 'instagram' | 'github'; href: string }[];
  pagesTitle?: string;
  pagesLinks?: { label: string; href: string }[];
  utilityTitle?: string;
  utilityLinks?: { label: string; href: string }[];
  instagramTitle?: string;
  instagramItems?: { image?: { url: string } | null; link?: string }[];
  copyrightText?: string;
}

function SocialIcon({ icon }: { icon: string }) {
  const className = 'w-5 h-5';
  switch (icon) {
    case 'twitter':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      );
    case 'instagram':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-4.123v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
      );
    case 'github':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Footer({
  logo,
  logoLink,
  description,
  socialLinks,
  pagesTitle,
  pagesLinks,
  utilityTitle,
  utilityLinks,
  instagramTitle,
  instagramItems,
  copyrightText,
}: FooterProps) {
  const pathname = usePathname();
  const hasContent = logo?.url || description || (socialLinks?.length ?? 0) > 0
    || (pagesLinks?.length ?? 0) > 0 || (utilityLinks?.length ?? 0) > 0
    || (instagramItems?.length ?? 0) > 0 || copyrightText;
  if (!hasContent) return null;

  const logoUrl = logo?.url;
  const instagramImages = (instagramItems ?? []).map((item) => item.image?.url).filter(Boolean) as string[];
  const instagramLinks = (instagramItems ?? []).map((item) => item.link ?? '#');

  return (
    <footer id="contact" className="bg-footer-bg text-footer-text font-dm-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 md:pt-16 md:pb-12 lg:pt-20 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Left - Brand & Socials */}
          <div className="space-y-4 lg:max-w-[280px]">
            <Link href={logoLink ?? '/'} className="inline-flex items-center gap-2">
              {logoUrl ? <Image src={logoUrl} alt="Logo" width={200} height={40} className="flex-shrink-0" /> : <span className="text-lg font-semibold text-white">Logo</span>}
            </Link>
            {description && (
              <p className="font-dm-sans text-blog-body leading-relaxed text-footer-desc">
                {description}
              </p>
            )}
            <div className="flex gap-3">
              {(socialLinks ?? []).map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  aria-label={item.icon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-footer-social flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                >
                  <SocialIcon icon={item.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Pages & Utility Pages - same row in all breakpoints */}
          <div className="grid grid-cols-2 gap-6 md:gap-8 lg:gap-10">
            <div className="space-y-4">
              {pagesTitle && (
                <h3 className="font-dm-sans font-bold text-blog-body text-footer-heading tracking-wide">
                  {pagesTitle}
                </h3>
              )}
              <ul className="space-y-5">
                {(pagesLinks ?? []).map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className={`font-dm-sans text-blog-body font-normal py-1 rounded transition-colors ${isActive
                          ? 'font-black text-white  text-[#2C2F24]'
                          : 'text-footer-desc hover:text-white'
                          }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="space-y-4">
              {utilityTitle && (
                <h3 className="font-dm-sans font-bold text-blog-body text-footer-heading tracking-wide">
                  {utilityTitle}
                </h3>
              )}
              <ul className="space-y-5">
                {(utilityLinks ?? []).map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className={`font-dm-sans text-blog-body font-normal py-1 rounded transition-colors ${isActive
                          ? 'bg-[#DBDFD0] text-[#2C2F24]'
                          : 'text-footer-desc hover:text-white'
                          }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Right - Instagram */}
          <div className="space-y-4">
            {instagramTitle && (
              <h3 className="font-dm-sans font-bold text-blog-body text-footer-heading tracking-wide">
                {instagramTitle}
              </h3>
            )}
            <div className="grid grid-cols-2 gap-2 max-w-[240px]">
              {instagramImages.slice(0, 4).map((src, i) => (
                <a
                  key={i}
                  href={instagramLinks[i] ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square rounded-lg overflow-hidden block"
                >
                  <Image
                    src={src}
                    alt={`Instagram ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        {copyrightText && (
          <div className="mt-16 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-footer-text">
              {copyrightText.replace(/\b(19|20)\d{2}\b/, new Date().getFullYear().toString())}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}
