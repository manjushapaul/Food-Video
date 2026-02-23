import Image from 'next/image';

const DEFAULT_HEADING = 'A little information for our valuable guest';
const DEFAULT_PARAGRAPH =
  'At place, we believe that dining is not just about food, but also about the overall experience. Our staff, renowned for their warmth and dedication, strives to make every visit an unforgettable event.';

export interface StatItem {
  value: string;
  label: string;
}

const DEFAULT_STATS: StatItem[] = [
  { value: '3', label: 'Locations' },
  { value: '1995', label: 'Founded' },
  { value: '65+', label: 'Staff Members' },
  { value: '100%', label: 'Satisfied Customers' },
];

export interface AboutGuestSectionProps {
  heading?: string;
  paragraph?: string;
  stats?: StatItem[];
  image?: { url: string } | null;
  /** Fallback when no image from CMS, e.g. /images/abouts.png */
  fallbackImage?: string;
}

const FALLBACK_IMAGE = '/images/abouts.png';

export default function AboutGuestSection(props: AboutGuestSectionProps) {
  const {
    heading = DEFAULT_HEADING,
    paragraph = DEFAULT_PARAGRAPH,
    stats = DEFAULT_STATS,
    image,
    fallbackImage = FALLBACK_IMAGE,
  } = props;

  const imageUrl = image?.url || fallbackImage;

  return (
    <section
      id="about-guest"
      aria-label="Information for our guests"
      className="w-full bg-[#F5F5F7]"
    >
      <div className="max-w-7xl 2xl:max-w-8xl py-16 mx-auto px-4 sm:px-6 lg:px-8 lg:py-16">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[40px] lg:leading-[40px] font-medium 2xl:leading-[60px] leading-tight mb-6 text-[#2C2F24] block lg:hidden text-center lg:text-left">
          {heading}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left: text + stats */}
          <div className="flex flex-col justify-start  lg:pr-12 xl:pr-16 order-2 lg:order-1">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-[40px] lg:leading-[40px] font-medium 2xl:leading-[60px] leading-tight mb-6 text-[#2C2F24] hidden lg:block">
              {heading}
            </h2>
            <p className="text-base leading-relaxed mb-8 md:mb-10 lg:max-w-xl text-[#414536]  text-center lg:text-left pt-5 lg:pt-0">
              {paragraph}
            </p>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:max-w-2xl  text-center ">
              {stats.slice(0, 4).map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-5 sm:p-6 border border-[#DBDFD0] min-h-[120px] sm:min-h-[130px] flex flex-col justify-center">
                  <div
                    className="text-3xl sm:text-4xl md:text-5xl font-semibold font-serif mb-3 text-[#2C2F24]">
                    {stat.value}
                  </div>
                  <div
                    className="text-sm sm:text-base text-[#414536]"
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right: image */}
          <div className="order-1 lg:order-2 rounded-lg overflow-hidden lg:pl-20">
            <div className="relative w-full h-[320px] lg:min-h-[550px]  ">
              <Image
                src={imageUrl}
                alt="Food preparation and fresh ingredients"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
