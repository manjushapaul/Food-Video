'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';

const DEFAULT_HEADLINE = 'Feel the authentic &\noriginal taste from us';
const FALLBACK_BG = '/images/BG.png';

export interface AboutVideoFeature {
  icon?: { url: string } | null;
  title?: string;
  description?: string;
}

export interface AboutVideoSectionProps {
  backgroundImage?: { url: string } | null;
  headline?: string;
  videoUrl?: string;
  features?: AboutVideoFeature[];
}

function isYouTubeOrVimeo(url: string): boolean {
  return /youtube|youtu\.be|vimeo/i.test(url);
}

function getEmbedUrl(url: string): string | null {
  if (/youtube\.com\/watch\?v=([^&]+)/.test(url)) {
    const m = url.match(/v=([^&]+)/);
    return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1` : null;
  }
  if (/youtu\.be\/([^?]+)/.test(url)) {
    const m = url.match(/youtu\.be\/([^?]+)/);
    return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1` : null;
  }
  if (/vimeo\.com\/(\d+)/.test(url)) {
    const m = url.match(/vimeo\.com\/(\d+)/);
    return m ? `https://player.vimeo.com/video/${m[1]}?autoplay=1` : null;
  }
  return null;
}

export default function AboutVideoSection(props: AboutVideoSectionProps) {
  const { backgroundImage, headline, videoUrl, features = [] } = props;
  const [modalOpen, setModalOpen] = useState(false);

  const bgUrl = backgroundImage?.url || FALLBACK_BG;
  const displayHeadline = headline?.trim() || DEFAULT_HEADLINE;
  // Allow line break at " & " so "Feel the authentic & original taste from us" wraps correctly
  const normalizedHeadline = displayHeadline.replace(/\s+&\s+/, ' &\n');
  const lines = normalizedHeadline.split('\n').filter(Boolean);
  if (lines.length === 0) lines.push(DEFAULT_HEADLINE);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  useEffect(() => {
    if (!modalOpen) return;
    const onEscape = (e: KeyboardEvent) => e.key === 'Escape' && closeModal();
    document.addEventListener('keydown', onEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEscape);
      document.body.style.overflow = '';
    };
  }, [modalOpen, closeModal]);

  const hasVideo = !!videoUrl?.trim();
  const embedUrl = videoUrl && isYouTubeOrVimeo(videoUrl) ? getEmbedUrl(videoUrl) : null;
  const isNativeVideo = videoUrl && !embedUrl;

  return (
    <>
      <section id="about-video-section" aria-label="Video and features" className="w-full">
        {/* Video / Hero block */}
        <div
          className="relative w-full min-h-[320px] sm:min-h-[400px] md:min-h-[480px] lg:min-h-[520px] xl:min-h-[690px] max-h-[85vh] flex items-center justify-center overflow-hidden"
          style={{ aspectRatio: '1600/690' }}
        >
          <div className="absolute inset-0">
            <Image
              src={bgUrl}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-12">
            <button
              type="button"
              onClick={() => hasVideo && openModal()}
              className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-white/50 mb-8 rounded-full overflow-hidden"
              aria-label="Play video"
            >
              <Image
                src="/images/Play.svg"
                alt=""
                width={106}
                height={106}
                className="w-full h-full object-contain"
                aria-hidden
              />
            </button>
            <h2
              className="font-serif text-white text-3xl md:text-4xl lg:text-[40px] lg:leading-[40px] font-medium 2xl:leading-[60px] leading-tight max-w-4xl"
              style={{ color: '#ffffff' }}
            >
              {lines.map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h2>
          </div>
        </div>

        {/* Features */}
        {features.length > 0 && (
          <div className="bg-white py-12 md:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex flex-row items-start gap-4 text-left"
                  >
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 flex items-start justify-center bg-white flex-shrink-0"
                  >
                      {feature.icon?.url ? (
                        <Image
                          src={feature.icon.url}
                          alt=""
                          width={40}
                          height={40}
                          className="object-contain w-10 h-10 sm:w-12 sm:h-12"
                        />
                      ) : (
                        <span className="text-2xl text-[#AD343E]" aria-hidden>◆</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-dm-sans font-bold text-[20px] leading-[26px] mb-2 text-[#2C2F24]">
                        {feature.title || `Feature ${idx + 1}`}
                      </h3>
                      <p className="font-dm-sans font-normal text-[16px] leading-[24px] text-[#414536]">
                        {feature.description || ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Video modal */}
      {modalOpen && videoUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Video"
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-3xl leading-none z-10"
              aria-label="Close"
            >
              ×
            </button>
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title="Video"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : isNativeVideo ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full"
                onEnded={() => {}}
              />
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
