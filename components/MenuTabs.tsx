'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

interface StrapiMenuItem {
  name: string;
  price: number | string;
  description: string;
  category: string;
  imageUrl?: string; // resolved absolute URL
}

const tabs = ['All', 'Breakfast', 'Main Dishes', 'Drinks', 'Desserts'];

export default function MenuTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');
  const [menuItems, setMenuItems] = useState<StrapiMenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

        // const res = await fetch(`${strapiUrl}/api/menu-dish?populate=*`, {
        //   next: { revalidate: 300 }
        // });

        const res = await fetch(`${strapiUrl}/api/menu-dish?populate=Dish.Image`, {
          next: { revalidate: 300 }
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const result = await res.json();
        console.log('🔍 RAW Strapi response:', JSON.stringify(result, null, 2));

        // DEBUG: Try ALL possible paths
        const possiblePaths = [
          result.data?.[0]?.attributes?.Dish,
          result.data?.attributes?.Dish,
          result.data?.[0]?.Dish,
          result.data?.Dish,
          result.data?.[0]?.attributes?.dishItems,
          result.data?.attributes?.dishItems
        ];

        const rawDishes = possiblePaths.find(path => path && Array.isArray(path)) || [];
        console.log('🔍 Found dishes at path:', rawDishes);

        const dishes: StrapiMenuItem[] = rawDishes.map((dish: any, i: number) => {
          // dish.Image can be a flat object { url, ... } or nested { data: { attributes: { url } } }
          const rawImage = dish.Image || dish.image;
          let imageUrl: string | undefined;
          if (rawImage) {
            const relativeUrl =
              rawImage.url ??
              rawImage.data?.attributes?.url ??
              rawImage.attributes?.url;
            if (relativeUrl) {
              imageUrl = relativeUrl.startsWith('http')
                ? relativeUrl
                : `${strapiUrl}${relativeUrl}`;
            }
          }
          return {
            name: dish.Dish || dish.name || `Dish ${i}`,
            price: dish.Price || dish.price || 0,
            description: dish.Description || dish.description || '',
            category: dish.Category || dish.category || 'All',
            imageUrl,
          };
        });

        console.log('🍽️ FINAL dishes:', dishes);
        setMenuItems(dishes);
        console.log('🖼️ Images check:', dishes.map(d => ({ name: d.name, imageUrl: d.imageUrl })));

      } catch (error) {
        console.error('❌ Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);


  useEffect(() => {
    const param = searchParams?.get('tab');
    if (param && tabs.includes(param)) {
      setActiveTab(param);
    } else {
      setActiveTab('All');
    }
  }, [searchParams]);

  const filteredItems = activeTab === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === activeTab);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AD343E]"></div>
        <p className="mt-4 text-gray-600">Loading menu from Strapi...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-4 justify-center items-center mb-4 lg:mb-20">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              const url = tab === 'All' ? '/menu' : `/menu?tab=${encodeURIComponent(tab)}`;
              router.push(url);
            }}
            className={`px-12 py-3 font-bold font-dm-sans lg:text-base text-sm rounded-full transition-all duration-200 whitespace-nowrap ${activeTab === tab
              ? 'bg-[#AD343E] text-white border border-[#AD343E] hover:border-gray-400'
              : 'bg-white text-[#2d2d2d] border border-[#DBDFD0] hover:border-gray-400'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid max-[450px]:grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8 px-4 md:px-12 xl:max-w-8xl mx-auto mb-0 lg:mb-20">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-xl text-gray-500 mb-4">No menu items found</p>
            <p className="text-sm text-gray-400">
              {loading ? 'Loading...' : 'Add dishes in Strapi Admin → Content Manager → Dishes'}
            </p>
          </div>
        ) : (
          filteredItems.map((item: StrapiMenuItem, index: number) => (
            <div
              key={index}
              className="bg-white border border-[#DBDFD0] rounded-xl transition-shadow overflow-hidden hover:shadow-md"
            >
              <div className="relative w-full overflow-hidden bg-gray-100">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>


              <div className="p-6 text-center">
                <p className="text-[#AD343E] font-dm-sans text-lg lg:text-xl font-bold mb-2 xl:text-2xl">
                  ${item.price}
                </p>
                <h3 className="text-[#2C2F24] font-dm-sans xl:text-xl lg:text-lg text-sm font-bold mb-3">
                  {item.name}
                </h3>
                <p className="text-[#414536] font-dm-sans xl:text-base lg:text-sm text-xs leading-6">
                  {item.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
