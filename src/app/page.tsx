import { Hero } from '@/components/home/Hero';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { LimitedSpotlight } from '@/components/home/LimitedSpotlight';
import { TrustBadges } from '@/components/home/TrustBadges';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <LimitedSpotlight />
      <TrustBadges />
    </>
  );
}
