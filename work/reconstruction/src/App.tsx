import React from 'react';
import { MegaNav } from './components/MegaNav';
import { HeroPromptBuilder } from './components/HeroPromptBuilder';
import { HeroBentoGrid } from './components/HeroBentoGrid';
import { TemplateGallery } from './components/TemplateGallery';
import { PlatformInfrastructure } from './components/PlatformInfrastructure';
import { TestimonialCarousel } from './components/TestimonialCarousel';
import { PricingSection } from './components/PricingSection';
import { PartnerLogoBlock } from './components/PartnerLogoBlock';
import { FooterCta, MarketingFooter } from './components/MarketingFooter';

export const App: React.FC = () => {
  return (
    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 overflow-x-clip overscroll-x-none font-brand [background-color:#faf6f1]! [&_header]:[--surface-color:var(--brand-off-white-surface-color-100)]! [&_header]:[background-color:#faf6f1]! _sdz_theme-default _sdz_surface bg-surface _sdz_switch-theme min-h-screen">
      <MegaNav />
      <HeroPromptBuilder />
      <div aria-hidden="true" />
      <HeroBentoGrid />
      <TemplateGallery />
      <PlatformInfrastructure />
      <TestimonialCarousel />
      <PricingSection />
      <PartnerLogoBlock />
      <FooterCta />
      <MarketingFooter />
    </div>
  );
};

export default App;
