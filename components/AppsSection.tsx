import Image from 'next/image';

interface AppsSectionProps {
  title?: string;
  description?: string;
  appLogos?: { url: string; name?: string; alternativeText?: string | null }[];
}

// Fallback static logos when no Strapi content is available
const FALLBACK_LOGOS = [
  'app1.png', 'app2.png', 'app3.png',
  'app4.png', 'app5.png', 'app6.png',
  'app7.png', 'app8.png', 'app9.png',
];

export default function AppsSection({ title, description, appLogos }: AppsSectionProps) {
  const sectionTitle = title ?? 'You can order\nthrough apps';
  const sectionDesc = description ??
    'Lorem ipsum dolor sit amet consectetur adipisicing elit enim bibendum sed et aliquet aliquet risus tempor semper.';

  // Use Strapi logos if available, otherwise fallback to local images
  const useStrapLogos = appLogos && appLogos.length > 0;

  return (
    <section className="py-32 bg-[#F9F9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-serif text-4xl lg:text-5xl text-[#253325] leading-tight mb-4">
              {sectionTitle.split('\n').map((line, i) => (
                <span key={i}>{line}{i < sectionTitle.split('\n').length - 1 && <br />}</span>
              ))}
            </h2>
            <p className="text-[#6B6F5F] max-w-md">{sectionDesc}</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {useStrapLogos
              ? appLogos.map((logo, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md px-2 py-3 flex items-center justify-center">
                  <div className="flex items-center justify-center">
                    <Image
                      src={logo.url}
                      alt={logo.alternativeText ?? logo.name ?? `App ${i + 1}`}
                      width={240}
                      height={248}
                      className="object-none"
                    />
                  </div>
                </div>
              ))
              : FALLBACK_LOGOS.map((img) => (
                <div key={img} className="bg-white rounded-xl shadow-md px-2 py-3 flex items-center justify-center">
                  <div className="flex items-center justify-center">
                    <Image src={`/images/${img}`} alt={img} width={240} height={248} className="object-none" />
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </section>
  );
}
