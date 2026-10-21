import React, { useState } from 'react';

const CATEGORIES = [
  'Featured',
  'Landing Pages',
  'Mobile',
  'Prototypes',
  'Posters',
  'Social Posts',
  'Email'
];

interface TemplateItem {
  id: string;
  title: string;
  image: string;
  category: string;
}

const TEMPLATES: TemplateItem[] = [
  {
    id: 'art-poster-7204',
    title: 'Orange Portrait Event Poster',
    image: '/assets/de12876dbb81_frame-art-poster-7204-preview.jpg',
    category: 'Posters'
  },
  {
    id: 'bento-dashboard-7306',
    title: 'Mission Control Bento Dashboard',
    image: '/assets/6cac5ea5ec14_frame-bento-dashboard-7306-preview.jpg',
    category: 'Prototypes'
  },
  {
    id: 'crm-contact-list-view-4338',
    title: 'Swiss Grid CRM Dashboard',
    image: '/assets/93450b597cf3_frame-crm-contact-list-view-4338-preview.jpg',
    category: 'Prototypes'
  },
  {
    id: 'dinner-party-poster-7303',
    title: 'Severance Dinner Party Invite',
    image: '/assets/1622df132747_frame-dinner-party-poster-7303-preview.jpg',
    category: 'Posters'
  },
  {
    id: 'instagram-carousel-slide-1789',
    title: 'Neon Horizons Travel Carousel',
    image: '/assets/40d25dc36d6d_frame-instagram-carousel-slide-1789-preview.jpg',
    category: 'Social Posts'
  },
  {
    id: 'jazz-night-poster-7301',
    title: 'Octopus Jazz Night Poster',
    image: '/assets/47364210bd75_frame-jazz-night-poster-7301-preview.jpg',
    category: 'Posters'
  },
  {
    id: 'kai-floating-nigiri-7304',
    title: 'Japanese Omakase Landing Page',
    image: '/assets/a602174189a6_frame-kai-floating-nigiri-7304-preview.jpg',
    category: 'Landing Pages'
  },
  {
    id: 'landing-pages-lp-14',
    title: 'Monochrome Landscape Photography Portfolio',
    image: '/assets/604da691b3c3_frame-landing-pages-lp-14-preview.jpg',
    category: 'Landing Pages'
  }
];

export const TemplateGallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Featured');

  return (
    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 w-full px-0 [--design-page-bg:#f3f2ee] bg-(--design-page-bg) pt-[120px] pb-[112px] [@media_screen_and_(width<=768px)]:pt-1600 [@media_screen_and_(width<=768px)]:pb-[56px] [&>div]:max-w-[1380px]">
      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-600 my-0 mx-auto w-full px-400">
        {/* Header: Title and category filter chips */}
        <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-between items-center gap-400 flex-wrap w-full [@media_screen_and_(width<=768px)]:flex-col [@media_screen_and_(width<=768px)]:items-logical-start flex-row shrink-0">
          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start items-center gap-400 flex-row shrink-0">
            <h2 className="m-0 font-medium leading-tight text-(length:--font-size-header-big) text-[#181818] [view-transition-name:design-templates-heading] [@media_screen_and_(width<=640px)]:text-[28px] [@media_screen_and_(width<=640px)]:leading-[34px]">
              Get started with templates
            </h2>
          </div>

          <div
            className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start items-stretch flex-row gap-200 shrink flex-wrap min-w-0 max-w-full [view-transition-name:design-templates-chips]"
            data-analytics-id="template_filter_chip_list"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeTab === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={isActive}
                  data-analytics-id="template_filter_chip"
                  onClick={() => setActiveTab(cat)}
                  className={`inline-flex h-900 cursor-pointer flex-row items-center justify-center whitespace-nowrap rounded-full border duration-150 px-[17px] text-[14px] font-[450] transition-[border-color,background-color,color] ease-[ease] focus-visible:outline-offset-2 focus-visible:outline-[2px_solid_#181818] ${
                    isActive
                      ? 'border-[#181818] bg-[#181818] text-[#fff] hover:border-[#181818]'
                      : 'bg-transparent border-[#d8d5cf] text-[#55524e] hover:border-[#a8a49d]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Templates Grid Container */}
        <div className="relative w-full overflow-hidden max-h-[560px] [@media_screen_and_(width_>=_1024px)]:max-h-[667px]">
          <div className="grid grid-cols-4 gap-400 [@media_screen_and_(width_<_1120px)]:grid-cols-3 [@media_screen_and_(width_<_844px)]:grid-cols-2 [@media_screen_and_(width_<_568px)]:grid-cols-1 [@media_screen_and_(width_<_1120px)]:[&_button[data-analytics-id='template_card']:nth-child(n+7)]:hidden [@media_screen_and_(width_<_844px)]:[&_button[data-analytics-id='template_card']:nth-child(n+5)]:hidden [@media_screen_and_(width_<_568px)]:[&_button[data-analytics-id='template_card']:nth-child(n+3)]:hidden [@media_screen_and_(width_<_1120px)]:[&_[data-design-template-shell]:nth-child(n+12)]:hidden [@media_screen_and_(width_<_844px)]:[&_[data-design-template-shell]:nth-child(n+11)]:hidden [@media_screen_and_(width_<_568px)]:[&_[data-design-template-shell]:nth-child(n+10)]:hidden">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                aria-label={tpl.title}
                data-analytics-id="template_card"
                className="block w-full min-w-0 overflow-hidden border transition-shadow duration-200 border-[rgb(197_197_197_/_60%)] bg-[#f6f5f4] contain-[layout_paint] ease-[ease] hover:shadow-[0_4px_24px_rgb(0_0_0_/_10%)] rounded-16"
              >
                <div className="relative w-full overflow-hidden aspect-[300/211.5]">
                  <img
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={{
                      position: 'absolute',
                      height: '100%',
                      width: '100%',
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      color: 'transparent',
                      objectFit: 'cover',
                      objectPosition: 'top center'
                    }}
                    sizes="(min-width: 570px) 300px, 100vw"
                    src={tpl.image}
                    draggable={false}
                  />
                </div>
              </button>
            ))}

            {/* 4 Trailing Shell Placeholders */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`shell-${i}`}
                className="flex box-border min-h-0 min-w-0 view-outline-none flex-col justify-logical-start items-stretch shrink-0 rounded-16 border aspect-[300/211.5] border-[rgb(197_197_197_/_60%)] bg-[#f6f5f4]"
                data-design-template-shell=""
              />
            ))}
          </div>

          {/* Bottom Gradient Fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8000 bg-[linear-gradient(to_bottom,transparent_0%,var(--design-page-bg,#f6f5f4)_55%)] [@media_screen_and_(width_>=_1024px)]:h-[332px] [@media_screen_and_(width_>=_1024px)]:bg-[linear-gradient(to_bottom,transparent_0%,var(--design-page-bg,#f6f5f4)_74%)]" />

          {/* Browse All Link */}
          <a
            href="/design?templates=all"
            data-analytics-id="template_browse_all_link"
            className="absolute left-1/2 flex cursor-pointer items-center justify-center whitespace-nowrap bg-transparent px-500 py-250 duration-150 rounded-8 bottom-[82px] transform-[translateX(-50%)] border-[1.5px] border-[#ff3c00] text-[14px] font-[500] tracking-[-0.02em] text-[#ff3c00] transition-[background-color,color] ease-[ease] hover:bg-[#ff3c00] hover:text-[#fff] focus-visible:outline-offset-2 focus-visible:outline-[2px_solid_#181818]"
          >
            Browse all
          </a>
        </div>
      </div>
    </div>
  );
};
