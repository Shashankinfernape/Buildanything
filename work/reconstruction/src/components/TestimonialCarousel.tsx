import React, { useState, useCallback } from 'react';

interface Testimonial {
  headline: string;
  author: {
    name: string;
    role: string;
    company: string;
  };
}

const testimonials: Testimonial[] = [
  {
    headline: "By integrating with Lakebase and Databricks Apps, we're combining Replit's capabilities with trusted enterprise data and governance, helping teams move from idea to production faster and more securely than ever.",
    author: {
      name: "Ali Ghodsi",
      role: "CEO",
      company: "Databricks"
    }
  },
  {
    headline: "Agent 4 unlocks true collaboration and real-time learning — now our teams can design and build with our closest partners live, turn instant feedback into measurable wins, and deliver outcomes that delight customers and partners.",
    author: {
      name: "Doug Rodermund",
      role: "Principal Product Manager",
      company: "Zillow"
    }
  },
  {
    headline: "Replit Agent 4 is incredible. Its ability to take a one-shot prompt and flesh out the requirements before a full build is unmatched. It requires very little guidance to take a rough concept to a functional prototype. This makes my life as a Product Manager 10x easier. Rather than writing requirements and waiting for Figmas, I can show, not tell.",
    author: {
      name: "Alex Meyers",
      role: "Principal Product Manager",
      company: "Gusto"
    }
  },
  {
    headline: "The parallel task execution is a game-changer for us. We have multiple builders working on the same codebase every day, and the ability to submit tasks simultaneously with full visibility before anything merges is exactly how we've wanted to work. Agent 4 feels like it finally matches the speed our team actually operates at.",
    author: {
      name: "Barak Hirchson",
      role: "Co-Founder & Chief AI Officer",
      company: "Payouts.com"
    }
  },
  {
    headline: "To deliver the world's best customer experience, our internal teams need to work without limits. Replit gives our teams the 'superpowers' to prototype and scale internal solutions in hours rather than weeks, ensuring our operations are as innovative as the products we build. We're excited to see what we can build with Agent 4.",
    author: {
      name: "Shauna Geraghty",
      role: "SVP, Global People and Talent",
      company: "Talkdesk"
    }
  },
  {
    headline: "Agent 4 is a game-changer. Multi-user vibe coding via the kanban is a significant milestone for enterprises. It's great for turning individual concepts into team realities and managing tasks through diverse role definitions.",
    author: {
      name: "Takeshi Fujiwara",
      role: "Director",
      company: "SMFL Digital Lab"
    }
  }
];

function BubbleFancyS({
  color = "hsla(14, 100%, 80%, 1)",
  width = 518,
  height = 518,
  borderRadius = 70,
  innerRadius = 70,
  topRight,
  bottomLeft
}: {
  color?: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  innerRadius?: number;
  topRight: React.ReactNode;
  bottomLeft: React.ReactNode;
}) {
  const v = width / 2;
  const _ = height / 2;
  const pathD = `M${v + borderRadius} 0 H${width - borderRadius} Q${width} 0 ${width} ${borderRadius} V${_ - borderRadius} Q${width} ${_} ${width - borderRadius} ${_} H${v + innerRadius} Q${v} ${_} ${v} ${_ + innerRadius} V${height - borderRadius} Q${v} ${height} ${v - borderRadius} ${height} H${borderRadius} Q0 ${height} 0 ${height - borderRadius} V${_ + borderRadius} Q0 ${_} ${borderRadius} ${_} H${v - innerRadius} Q${v} ${_} ${v} ${_ - innerRadius} V${borderRadius} Q${v} 0 ${v + borderRadius} 0 Z`;

  return (
    <div
      style={{
        ["--BubbleFancyS--bubble-color" as any]: color,
        ["--BubbleFancyS--bubble-border-radius" as any]: `${borderRadius}px`,
        ["--BubbleFancyS--bubble-width" as any]: `${width}px`,
        ["--BubbleFancyS--bubble-height" as any]: `${height}px`,
        ["--BubbleFancyS--bubble-half-width" as any]: `${width / 2}px`,
        ["--BubbleFancyS--bubble-half-height" as any]: `${height / 2}px`,
      }}
      className="relative w-(--BubbleFancyS--bubble-width) h-(--BubbleFancyS--bubble-height)"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 size-full"
      >
        <path d={pathD} fill={color} />
      </svg>
      <div className="absolute top-0 right-0 flex items-logical-end justify-center overflow-hidden rounded-(--BubbleFancyS--bubble-border-radius) bg-(--BubbleFancyS--bubble-color) w-(--BubbleFancyS--bubble-half-width) h-(--BubbleFancyS--bubble-half-height)">
        {topRight}
      </div>
      <div className="absolute bottom-0 left-0 flex items-logical-end justify-center overflow-hidden rounded-(--BubbleFancyS--bubble-border-radius) bg-(--BubbleFancyS--bubble-color) w-(--BubbleFancyS--bubble-half-width) h-(--BubbleFancyS--bubble-half-height)">
        {bottomLeft}
      </div>
    </div>
  );
}

export function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  return (
    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start shrink-0 px-800 pb-1200 items-center pt-[84px] [@media_screen_and_(width<1024px)]:px-0">
      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 w-full max-w-(--marketing-surface-max-width)">
        <div className="relative w-full select-none">
          {/* Desktop view (>1300px) */}
          <div className="relative hidden [@media(width>1300px)]:block">
            {/* Carousel track container */}
            <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 w-full overflow-hidden">
              <div
                className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start items-stretch shrink-0 flex-row transition-transform duration-500 ease-out"
                style={{
                  transform: `translate3d(-${activeIndex * 100}%, 0px, 0px)`
                }}
              >
                {testimonials.map((t, idx) => (
                  <div
                    key={t.author.name}
                    className="min-w-0 flex-[0_0_calc(100%_-_calc(273px_-_10px_*_2))] pr-[273px]"
                    style={{ transform: 'translate3d(0px, 0px, 0px)' }}
                  >
                    <div className="grid gap-300 h-[518px] grid-cols-[253px_1fr] grid-rows-[253px_253px]">
                      {/* Empty cell top-left (covered by floating badge) */}
                      <div></div>

                      {/* Testimonial figure card */}
                      <figure className="flex box-border min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 col-start-2 row-span-full min-h-0 select-text gap-600 overflow-hidden p-1200 font-brand rounded-[60px] bg-[#fff] text-[#312e2e]">
                        <blockquote className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch grow shrink basis-0 gap-400 overflow-hidden">
                          <span
                            aria-hidden="true"
                            className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 leading-none text-[48px] font-[700] text-[hsl(14deg_100%_80%/100%)]"
                          >
                            “
                          </span>
                          <p className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 line-clamp-8 wrap-break-word text-[26px] font-[400] leading-[1.2] tracking-[-0.03em] text-[#312e2e]">
                            {t.headline}
                          </p>
                        </blockquote>
                        <figcaption className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row items-logical-end justify-between">
                          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch grow shrink basis-0 gap-50">
                            <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xl font-medium max-w-full text-ellipsis whitespace-nowrap wrap-break-word inline-block overflow-hidden text-color-default">
                              {t.author.name}
                            </span>
                            <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-sm max-w-full text-ellipsis whitespace-nowrap wrap-break-word inline-block overflow-hidden text-color-secondary">
                              {t.author.role}
                            </span>
                            <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-sm max-w-full text-ellipsis whitespace-nowrap wrap-break-word inline-block overflow-hidden text-color-secondary">
                              {t.author.company}
                            </span>
                          </div>
                        </figcaption>
                      </figure>

                      {/* Photo Placeholder bottom-left */}
                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 overflow-hidden rounded-[56px]">
                        <div
                          className="size-full flex flex-col items-center justify-center bg-[#f0ede6] text-[#706e6b] font-brand select-none border border-dashed border-[#d5d0c8]"
                          style={{ width: '253px', height: '253px' }}
                        >
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2 opacity-50">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          <span className="text-xs font-medium tracking-wide">[Photo Placeholder]</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge top-left */}
            <div className="pointer-events-none absolute left-0 top-0 z-1 h-[253px] w-[253px]">
              <div className="flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col items-stretch shrink-0 pointer-events-auto h-full overflow-hidden p-600 rounded-[40px] border-[1.5px] border-[hsl(30deg_7%_78%/100%)] bg-[hsl(33deg_47%_96%/100%)]">
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col items-stretch shrink justify-logical-end h-full">
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 grow">
                    <span className="wrap-break-word font-brand leading-none text-[31.78px] font-[400] tracking-[-0.04em] text-[#312e2e]">
                      Trusted by builders
                    </span>
                  </div>
                  <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-sm max-w-full text-ellipsis whitespace-nowrap wrap-break-word inline-block overflow-hidden text-color-secondary font-brand">
                    Endorsed by innovators
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Bubble controls top-right */}
            <div className="pointer-events-none absolute right-0 top-0 z-1">
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0">
                <BubbleFancyS
                  color="hsla(14, 100%, 80%, 1)"
                  width={518}
                  height={518}
                  borderRadius={70}
                  innerRadius={70}
                  topRight={
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex box-border min-h-0 min-w-0 border-solid view-outline-none shrink-0 pointer-events-auto size-full cursor-pointer flex-row items-logical-end justify-between border-0 bg-transparent p-800 font-brand capitalize text-[17px] font-[400] leading-[105%] tracking-[-0.04em] text-[hsl(0deg_2%_10%/100%)]"
                    >
                      <span className="text-left">
                        Next<br />Testimonial
                      </span>
                      <svg
                        preserveAspectRatio="xMidYMin"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="Icon-module__wMmReq__icon size-600 text-[hsl(14deg_100%_50%/100%)]"
                        style={{ width: '24px', height: '24px' }}
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M19.53 11.47a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 1 1-1.06-1.06l5.72-5.72H5a.75.75 0 0 1 0-1.5h12.19l-5.72-5.72a.75.75 0 0 1 1.06-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  }
                  bottomLeft={
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="flex box-border min-h-0 min-w-0 border-solid view-outline-none shrink-0 pointer-events-auto size-full cursor-pointer flex-row items-logical-end justify-between border-0 bg-transparent p-800 font-brand capitalize text-[17px] font-[400] leading-[105%] tracking-[-0.04em] text-[hsl(0deg_2%_10%/100%)]"
                    >
                      <svg
                        preserveAspectRatio="xMidYMin"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="Icon-module__wMmReq__icon size-600 text-[hsl(14deg_100%_50%/100%)]"
                        style={{ width: '24px', height: '24px' }}
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.47 11.47a.75.75 0 0 0 0 1.06l7 7a.75.75 0 1 0 1.06-1.06l-5.72-5.72H19a.75.75 0 0 0 0-1.5H6.81l5.72-5.72a.75.75 0 0 0-1.06-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-right">
                        Previous<br />Testimonial
                      </span>
                    </button>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
