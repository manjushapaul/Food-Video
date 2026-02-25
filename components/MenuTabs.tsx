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

import { MenuDishStrapi } from '@/lib/strapi';

const tabs = ['All', 'Breakfast', 'Main Dishes', 'Drinks', 'Desserts'];

export default function MenuTabs({ initialDishes = [] }: { initialDishes?: MenuDishStrapi[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');

  const menuItems = initialDishes.map(d => ({
    name: d.name,
    price: d.price,
    description: d.description,
    category: d.category,
    imageUrl: d.image?.url,
  }));


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
              Add dishes in Strapi Admin → Content Manager → Dish (Single Type)
            </p>
          </div>
        ) : (
          filteredItems.map((item: StrapiMenuItem, index: number) => (
            <div
              key={index}
              className="bg-white border border-[#DBDFD0] rounded-xl transition-shadow overflow-hidden hover:shadow-md"
            >
              <div className="relative w-full h-52 overflow-hidden bg-gray-100">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
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
