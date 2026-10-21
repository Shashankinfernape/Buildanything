import React from 'react';

export const HeroBentoGrid: React.FC = () => {
  return (
    <div className="relative">
      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start shrink-0 items-center gap-800 pb-900 pt-[112px] max-tablet-max:gap-600 max-tablet-max:pb-400 max-tablet-max:pt-[60px]">
        {/* Title & Subtitle */}
        <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start shrink-0 items-center gap-400">
          <h2 className="text-center font-brand text-[#312e2e] font-[400] text-[68.92px] leading-[100%] tracking-[-0.06em] max-tablet-max:text-[32px]">
            Meet <span className="text-[#ff3c00]">Replit</span>
          </h2>
          <p className="text-center font-brand text-[hsl(0deg_0%_58%_/_100%)] font-[400] text-[28px] leading-[83%] tracking-[-0.04em] max-tablet-max:text-[18px]">
            Maximize Making on Replit
          </p>
        </div>

        {/* 2x2 Bento Grid */}
        <div
          data-analytics-id="free_mode_bento_grid"
          className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-400 px-400 w-full max-w-[1380px] max-tablet-max:gap-400 max-tablet-max:min-h-8000 max-tablet-max:max-h-none"
        >
          {/* Row 1: Free Mode Card & Replit Chat Card */}
          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start items-stretch shrink-0 flex-row gap-400 max-tablet-max:flex max-tablet-max:flex-col max-tablet-max:gap-400 max-tablet-max:h-auto">
            {/* Card 1: Free Mode Card */}
            <div
              data-analytics-id="free_mode_card"
              className="flex box-border min-h-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch flex-1 min-w-0 h-8000 max-tablet-max:flex-none max-tablet-max:min-h-fit max-tablet-max:max-h-8000 max-tablet-max:h-[48vw]"
            >
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start items-stretch relative flex-row shrink-0 gap-600 rounded-24 p-1000 h-full overflow-hidden font-brand bg-[hsl(17deg_90%_76%_/_100%)] text-[hsl(0deg_4%_19%_/_100%)] max-tablet-min:p-600">
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink max-w-[45%]">
                  <p className="opacity-85 mb-200 uppercase font-[500] text-[13px] font-[family-name:'Replit_Diatype_Mono',monospace] tracking-[0.12em] max-tablet-min:text-[11px]">
                    Free mode
                  </p>
                  <h3 className="font-[400] text-[36px] leading-[100%] tracking-[-0.03em] max-tablet-min:text-[22px]">
                    Create without token costs
                  </h3>
                  <p className="opacity-85 mt-400 font-[400] text-[14px] leading-[130%] tracking-[-0.02em] max-tablet-min:mt-200 max-tablet-min:text-[12px]">
                    Brainstorm and create at no cost.
                  </p>
                </div>
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col items-stretch self-stretch ml-auto shrink-0 justify-between w-[48%]">
                  {/* Free Tier */}
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-400 -mr-1000 py-300 pr-1000 pl-400 rounded-[12px_0_0_12px] [background:linear-gradient(90deg,hsl(14deg_100%_45%_/_100%),hsl(16deg_100%_48%_/_100%))] w-[calc(100%+40px)] text-[#fff] font-[400] text-[36px] leading-[100%] tracking-[-0.02em] max-tablet-min:-mr-600 max-tablet-min:py-200 max-tablet-min:pr-600 max-tablet-min:pl-300 max-tablet-min:rounded-[8px_0_0_8px] max-tablet-min:w-[calc(100%+24px)] max-tablet-min:text-[20px]">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="shrink-0 size-700 text-[#fff] max-tablet-min:size-400">
                      <circle cx="3.724" cy="3.724" r="1.75" fill="currentColor" opacity="0.2" />
                      <circle cx="9.004" cy="3.724" r="1.75" fill="currentColor" opacity="0.55" />
                      <circle cx="14.285" cy="3.724" r="1.75" fill="currentColor" opacity="1" />
                      <circle cx="3.724" cy="9.004" r="1.75" fill="currentColor" opacity="0.2" />
                      <circle cx="9.004" cy="9.004" r="1.75" fill="currentColor" opacity="0.2" />
                      <circle cx="14.285" cy="9.004" r="1.75" fill="currentColor" opacity="0.55" />
                      <circle cx="3.724" cy="14.285" r="1.75" fill="currentColor" opacity="0.2" />
                      <circle cx="9.004" cy="14.285" r="1.75" fill="currentColor" opacity="0.2" />
                      <circle cx="14.285" cy="14.285" r="1.75" fill="currentColor" opacity="0.2" />
                    </svg>
                    Free
                  </div>
                  {/* Power Tier */}
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-400 rounded-12 py-300 pr-600 pl-400 w-full text-[#fff] font-[400] text-[36px] leading-[100%] tracking-[-0.02em] max-tablet-min:py-200 max-tablet-min:pr-400 max-tablet-min:pl-300 max-tablet-min:rounded-8 max-tablet-min:text-[20px]">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="shrink-0 size-700 text-[#fff] max-tablet-min:size-400">
                      <circle cx="3.724" cy="3.724" r="1.75" fill="currentColor" opacity="0.55" />
                      <circle cx="9.004" cy="3.724" r="1.75" fill="currentColor" opacity="1" />
                      <circle cx="14.285" cy="3.724" r="1.75" fill="currentColor" opacity="1" />
                      <circle cx="3.724" cy="9.004" r="1.75" fill="currentColor" opacity="0.2" />
                      <circle cx="9.004" cy="9.004" r="1.75" fill="currentColor" opacity="0.55" />
                      <circle cx="14.285" cy="9.004" r="1.75" fill="currentColor" opacity="1" />
                      <circle cx="3.724" cy="14.285" r="1.75" fill="currentColor" opacity="0.2" />
                      <circle cx="9.004" cy="14.285" r="1.75" fill="currentColor" opacity="0.2" />
                      <circle cx="14.285" cy="14.285" r="1.75" fill="currentColor" opacity="0.55" />
                    </svg>
                    Power
                  </div>
                  {/* Max Tier */}
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-400 rounded-12 py-300 pr-600 pl-400 w-full text-[#fff] font-[400] text-[36px] leading-[100%] tracking-[-0.02em] max-tablet-min:py-200 max-tablet-min:pr-400 max-tablet-min:pl-300 max-tablet-min:rounded-8 max-tablet-min:text-[20px]">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="shrink-0 size-700 text-[#fff] max-tablet-min:size-400">
                      <circle cx="3.724" cy="3.724" r="1.75" fill="currentColor" opacity="1" />
                      <circle cx="9.004" cy="3.724" r="1.75" fill="currentColor" opacity="1" />
                      <circle cx="14.285" cy="3.724" r="1.75" fill="currentColor" opacity="1" />
                      <circle cx="3.724" cy="9.004" r="1.75" fill="currentColor" opacity="1" />
                      <circle cx="9.004" cy="9.004" r="1.75" fill="currentColor" opacity="1" />
                      <circle cx="14.285" cy="9.004" r="1.75" fill="currentColor" opacity="1" />
                      <circle cx="3.724" cy="14.285" r="1.75" fill="currentColor" opacity="1" />
                      <circle cx="9.004" cy="14.285" r="1.75" fill="currentColor" opacity="1" />
                      <circle cx="14.285" cy="14.285" r="1.75" fill="currentColor" opacity="1" />
                    </svg>
                    Max
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Replit Chat Card */}
            <div
              data-analytics-id="replit_chat_card"
              className="flex box-border min-h-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch flex-1 min-w-0 h-8000 max-tablet-max:flex-none max-tablet-max:min-h-fit max-tablet-max:max-h-8000 max-tablet-max:h-[48vw]"
            >
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch relative shrink-0 rounded-24 p-1000 h-full overflow-hidden font-brand bg-[hsl(100deg_12%_18%_/_100%)] text-[#fff] max-tablet-min:p-600">
                {/* Background image */}
                <div className="absolute inset-0">
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
                      objectFit: 'cover'
                    }}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    src="/assets/4f7578985759_outcome-focused-experience@2x.webp"
                  />
                </div>
                {/* Gradient overlay */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 [background:linear-gradient(100deg,hsl(100deg_12%_12%_/_80%)_0%,hsl(100deg_12%_12%_/_45%)_50%,hsl(100deg_12%_12%_/_20%)_100%)]"
                />
                {/* Chat bubbles preview */}
                <div
                  aria-hidden="true"
                  className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch absolute -top-200 right-600 shrink-0 gap-450 w-[48%] max-tablet-min:gap-200"
                >
                  <span className="flex items-center gap-200 -mb-150 ml-100 text-[hsl(0deg_0%_100%_/_95%)] font-[500] text-[12px] max-tablet-min:text-[10px]">
                    <span
                      className="inline-flex items-center justify-center relative shrink-0 rounded-full size-500 overflow-hidden [border-width:1px] [border-style:solid] [border-color:hsl(0deg_0%_100%_/_55%)] bg-[hsl(0deg_0%_100%_/_35%)] text-[10px] font-[500] text-[#fff]"
                      title="[Photo Placeholder]"
                      aria-label="[Photo Placeholder]"
                    >
                      S
                    </span>
                    Sarah
                  </span>
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 rounded-16 py-250 px-400 backdrop-blur-[12px] bg-[hsl(0deg_0%_100%_/_18%)] w-[88%] text-[#fff] text-[12px] leading-[140%] tracking-[-0.02em] max-tablet-min:py-150 max-tablet-min:px-250 max-tablet-min:rounded-[10px] max-tablet-min:text-[10px]">
                    Great! Here's the plan…
                  </div>
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 ml-800 rounded-16 py-250 px-400 backdrop-blur-[12px] bg-[hsl(0deg_0%_100%_/_18%)] w-[calc(100%-32px)] text-[#fff] text-[12px] leading-[140%] tracking-[-0.02em] max-tablet-min:ml-500 max-tablet-min:py-150 max-tablet-min:px-250 max-tablet-min:rounded-[10px] max-tablet-min:w-[calc(100%-20px)] max-tablet-min:text-[10px]">
                    I have an idea to create a mood board.
                  </div>
                  <span className="flex items-center gap-200 -mb-150 ml-100 text-[hsl(0deg_0%_100%_/_95%)] font-[500] text-[12px] max-tablet-min:text-[10px]">
                    <span
                      className="inline-flex items-center justify-center relative shrink-0 rounded-full size-500 overflow-hidden [border-width:1px] [border-style:solid] [border-color:hsl(0deg_0%_100%_/_55%)] bg-[hsl(0deg_0%_100%_/_35%)] text-[10px] font-[500] text-[#fff]"
                      title="[Photo Placeholder]"
                      aria-label="[Photo Placeholder]"
                    >
                      S
                    </span>
                    Sarah
                  </span>
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 rounded-16 py-250 px-400 backdrop-blur-[12px] bg-[hsl(0deg_0%_100%_/_18%)] w-[88%] text-[#fff] text-[12px] leading-[140%] tracking-[-0.02em] max-tablet-min:py-150 max-tablet-min:px-250 max-tablet-min:rounded-[10px] max-tablet-min:text-[10px]">
                    Perfect! Let's create a project from here!
                  </div>
                </div>
                {/* Foreground Text */}
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative z-1 max-w-[45%]">
                  <p className="opacity-85 mb-200 uppercase font-[500] text-[13px] font-[family-name:'Replit_Diatype_Mono',monospace] tracking-[0.12em] max-tablet-min:text-[11px]">
                    Replit chat
                  </p>
                  <h3 className="font-[400] text-[36px] leading-[100%] tracking-[-0.03em] max-tablet-min:text-[22px]">
                    Chat that flows
                  </h3>
                  <p className="opacity-85 mt-400 font-[400] text-[14px] leading-[130%] tracking-[-0.02em] max-tablet-min:mt-200 max-tablet-min:text-[12px]">
                    Just ask what you need, and Replit will take care of the rest.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Design Freely Card & Intelligent Model Routing Card */}
          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start items-stretch shrink-0 flex-row gap-400 max-tablet-max:flex max-tablet-max:flex-col max-tablet-max:gap-400 max-tablet-max:h-auto">
            {/* Card 3: Design Freely Card */}
            <div
              data-analytics-id="design_freely_card"
              className="flex box-border min-h-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch flex-1 min-w-0 h-8000 max-tablet-max:flex-none max-tablet-max:min-h-fit max-tablet-max:max-h-8000 max-tablet-max:h-[48vw]"
            >
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start items-stretch relative flex-row shrink-0 gap-600 rounded-24 p-1000 h-full overflow-hidden font-brand bg-[#ededed] text-[hsl(0deg_4%_19%_/_100%)] max-tablet-min:p-600">
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink max-w-[45%]">
                  <p className="opacity-85 mb-200 uppercase font-[500] text-[13px] font-[family-name:'Replit_Diatype_Mono',monospace] tracking-[0.12em] max-tablet-min:text-[11px]">
                    Infinite Canvas
                  </p>
                  <h3 className="font-[400] text-[36px] leading-[100%] tracking-[-0.03em] max-tablet-min:text-[22px]">
                    Design Freely
                  </h3>
                  <p className="opacity-85 mt-400 font-[400] text-[14px] leading-[130%] tracking-[-0.02em] max-tablet-min:mt-200 max-tablet-min:text-[12px]">
                    Introducing a new space that allows you to explore and tweak designs visually, and then apply them directly to your app.
                  </p>
                </div>
                <div
                  aria-hidden="true"
                  className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col items-stretch ml-auto mr-0 shrink-0 justify-center gap-350 -my-1000 w-[clamp(222px,40%,260px)] max-tablet-min:-my-600 max-tablet-min:mr-0 max-tablet-min:w-[34%]"
                >
                  <div className="relative shrink-0 rounded-12 overflow-hidden aspect-[12/5] max-tablet-min:rounded-8">
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
                        objectFit: 'cover'
                      }}
                      sizes="320px"
                      src="/assets/b1fcdb60e5f7_design-freely-chromatica.webp"
                    />
                  </div>
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 items-center justify-center rounded-12 uppercase [border-width:1.5px] [border-style:dashed] [border-color:hsl(285deg_85%_65%_/_100%)] [background:radial-gradient(80%_80%_at_50%_50%,hsl(285deg_90%_88%_/_90%)_0%,hsl(285deg_90%_96%_/_60%)_100%),white] aspect-[7/4] text-[hsl(0deg_4%_19%_/_100%)] font-[500] text-[11px] font-[family-name:'Replit_Diatype_Mono',monospace] tracking-[0.12em] max-tablet-min:whitespace-nowrap max-tablet-min:rounded-8 max-tablet-min:text-[7px] max-tablet-min:tracking-[0.08em]">
                    Explore a new vibe
                  </div>
                  <div className="relative shrink-0 rounded-12 overflow-hidden aspect-[12/5] max-tablet-min:rounded-8">
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
                        objectFit: 'cover'
                      }}
                      sizes="320px"
                      src="/assets/fb95e3b7c31b_design-freely-exhibition.webp"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Intelligent Model Routing Card */}
            <div
              data-analytics-id="user_quotes_card"
              className="flex box-border min-h-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch flex-1 min-w-0 h-8000 max-tablet-max:flex-none max-tablet-max:min-h-fit max-tablet-max:max-h-8000 max-tablet-max:h-[48vw]"
            >
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch relative shrink-0 rounded-24 p-1000 h-full overflow-hidden font-brand bg-[#fff] text-[hsl(0deg_0%_10%_/_100%)] max-tablet-min:p-600">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 [&::after]:absolute [&::after]:inset-0 [&::after]:content-[''] [&::after]:[background:linear-gradient(to_bottom,hsl(0deg_0%_100%_/_16%)_0%,hsl(0deg_0%_100%_/_0%)_16%,hsl(0deg_0%_100%_/_0%)_84%,hsl(0deg_0%_100%_/_16%)_100%)]"
                >
                  <div className="absolute inset-y-0 left-[-0.7%] w-[62.8%] [background:radial-gradient(100%_150%_at_0%_50%,hsl(14deg_100%_65%_/_100%)_0%,hsl(14deg_100%_65%_/_100%)_72%,hsl(14deg_100%_65%_/_82%)_84%,hsl(14deg_100%_65%_/_58%)_94%,hsl(14deg_100%_65%_/_42%)_100%)]" />
                  <div className="absolute inset-y-0 left-[62.1%] w-[25.3%] [background:radial-gradient(108%_60%_at_0%_50%,hsl(14deg_100%_65%_/_100%)_0%,hsl(14deg_100%_65%_/_100%)_45%,hsl(14deg_100%_65%_/_85%)_65%,hsl(14deg_100%_65%_/_65%)_82%,hsl(14deg_100%_65%_/_45%)_100%)]" />
                  <div className="absolute inset-y-0 left-[87.4%] w-[13.3%] [background:radial-gradient(115%_54%_at_0%_50%,hsl(14deg_100%_65%_/_100%)_0%,hsl(14deg_100%_65%_/_100%)_30%,hsl(14deg_100%_65%_/_80%)_58%,hsl(14deg_100%_65%_/_55%)_80%,hsl(14deg_100%_65%_/_35%)_100%)]" />
                </div>
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative z-1 max-w-[55%]">
                  <p className="mb-200 uppercase font-[500] text-[13px] font-[family-name:'Replit_Diatype_Mono',monospace] tracking-[0.12em] max-tablet-min:text-[11px]">
                    Intelligent model routing
                  </p>
                  <h3 className="font-[400] text-[36px] leading-[100%] tracking-[-0.03em] max-tablet-min:text-[22px]">
                    The best model for every task
                  </h3>
                  <p className="opacity-85 mt-400 font-[400] text-[14px] leading-[130%] tracking-[-0.02em] max-tablet-min:mt-200 max-tablet-min:text-[12px]">
                    Intelligent Model Routing lets you create the same quality output at 65% lower average cost than the previous version of Max Mode.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Row: Try Free Mode & Documentation */}
        <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start items-center flex-row gap-800 pt-300 px-400 shrink-0">
          <a
            href="/signup"
            data-analytics-id="try_free_mode_cta"
            className="inline-flex items-center gap-200 cursor-pointer py-300 px-600 bg-transparent no-underline rounded-8 font-brand transition-[background,color] duration-[0.2s] [border-width:1.5px] [border-style:solid] [border-color:#ff3c00] text-[#ff3c00] font-[500] text-[14px] tracking-[-0.02em] [&:hover]:bg-[#ff3c00] [&:hover]:text-[#fff]"
          >
            Try Free Mode
            <svg
              preserveAspectRatio="xMidYMin"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="Icon-module__wMmReq__icon"
              style={{
                ['--Icon--size' as any]: '16px',
                ['--Icon--rotate' as any]: '0deg',
                width: '16px',
                height: '16px'
              }}
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M19.53 11.47a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 1 1-1.06-1.06l5.72-5.72H5a.75.75 0 0 1 0-1.5h12.19l-5.72-5.72a.75.75 0 0 1 1.06-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a
            href="https://docs.replit.com"
            target="_blank"
            rel="noreferrer"
            data-analytics-id="free_mode_docs_link"
            className="inline-flex items-center opacity-100 cursor-pointer w-auto h-450 no-underline whitespace-nowrap font-brand gap-[7px] text-[#312e2e] font-[500] text-[14px] tracking-[-0.02em] [&:hover]:opacity-70"
          >
            Read the documentation
          </a>
        </div>
      </div>
    </div>
  );
};
