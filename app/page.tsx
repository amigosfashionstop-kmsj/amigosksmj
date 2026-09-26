import React from 'react';
import { Hero } from '@/components/home/Hero';
import { CollectionTiles } from '@/components/home/CollectionTiles';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { ShopByPrice } from '@/components/home/ShopByPrice';
import { BrandStory } from '@/components/home/BrandStory';
import { WhyShopAmigos } from '@/components/home/WhyShopAmigos';
import { InstagramSection } from '@/components/home/InstagramSection';
import { StoreBanner } from '@/components/home/StoreBanner';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <CollectionTiles />
      <FeaturedSection />
      <ShopByPrice />
      <BrandStory />
      <WhyShopAmigos />
      <StoreBanner />
      <InstagramSection />
    </div>
  );
}
