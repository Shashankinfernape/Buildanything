import React, { useState, useEffect, useRef } from 'react';

const placeholders = [
  "Build a website for…",
  "Create a mobile app that…",
  "Make a landing page for…",
  "Make a launch video about…",
  "Design a wireframe for…",
  "Make a slide deck about…",
  "Build a portfolio site that…",
  "Build an app that…",
  "Create an explainer video for…",
  "Design a UI that…",
  "Build a game that…",
  "Create a web app that…",
  "Make a mobile app for…",
  "Animate an explainer video for…",
  "Create a pitch deck about…"
];

const taglines = [
  "Turn ideas into apps in minutes — no coding needed",
  "You can always make changes later.",
  "Your first prompt is free. No credit consumption."
];

const examplePromptPool = [
  { shortPrompt: "B2B project management app", prompt: "A project management web app for a small B2B SaaS startup team to track tasks, assign owners, set deadlines, and view progress across projects" },
  { shortPrompt: "Freelance client portal", prompt: "A client portal for a freelance design business where customers can submit requests, upload files, and track the status of their projects" },
  { shortPrompt: "AI sales assistant", prompt: "An AI sales assistant chatbot that answers customer queries, qualifies leads, and schedules meetings" },
  { shortPrompt: "Startup pitch deck", prompt: "A startup pitch deck for a recycled clothing marketplace explaining the problem, solution, market opportunity, and business model" },
  { shortPrompt: "3D maze game", prompt: "A 3D first-person maze exploration game built with Three.js featuring procedural walls, lighting, and a timer" },
  { shortPrompt: "Product launch presentation", prompt: "A clean product launch slide deck highlighting customer pain points, feature overview, and go-to-market timeline" },
  { shortPrompt: "3D racing game", prompt: "An arcade style 3D racing game with low-poly vehicles, checkpoints, and lap timing" },
  { shortPrompt: "SaaS KPI dashboard", prompt: "A comprehensive SaaS KPI dashboard displaying ARR, churn, LTV, CAC, and active user trends" },
  { shortPrompt: "Fitness app onboarding wireframe", prompt: "A wireframe for the onboarding flow of a personal fitness tracking app that introduces features like workout logging, goal setting, and progress tracking" }
];

export const HeroPromptBuilder: React.FC = () => {
  const [promptText, setPromptText] = useState('');
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [placeholderText, setPlaceholderText] = useState('Build a website for…');
  const [activePill, setActivePill] = useState<string | null>(null);
  const [exampleOffset, setExampleOffset] = useState(0);

  const pillsContainerRef = useRef<HTMLDivElement>(null);

  // Typewriter placeholder effect (20ms step, 3500ms pause from module-585035.js)
  useEffect(() => {
    let pIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timeout: any;

    const tick = () => {
      // Respect CDP test freeze attribute
      const ta = document.querySelector('textarea[data-ruic="MultiLineInput"]') as HTMLTextAreaElement | null;
      if (ta && ta.getAttribute('data-frozen') === 'true') {
        return;
      }

      const currentFull = placeholders[pIdx];
      if (!isDeleting) {
        setPlaceholderText(currentFull.slice(0, charIdx + 1));
        charIdx++;
        if (charIdx >= currentFull.length) {
          isDeleting = true;
          timeout = setTimeout(tick, 3500);
          return;
        }
        timeout = setTimeout(tick, 20);
      } else {
        setPlaceholderText(currentFull.slice(0, charIdx - 1));
        charIdx--;
        if (charIdx <= 0) {
          isDeleting = false;
          pIdx = (pIdx + 1) % placeholders.length;
          timeout = setTimeout(tick, 200);
          return;
        }
        timeout = setTimeout(tick, 10);
      }
    };

    timeout = setTimeout(tick, 2000);
    return () => clearTimeout(timeout);
  }, []);

  // Tagline cycling effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTaglineIdx((prev) => (prev + 1) % taglines.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollPills = (direction: 'left' | 'right') => {
    if (pillsContainerRef.current) {
      const amount = direction === 'left' ? -200 : 200;
      pillsContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleReshuffle = () => {
    setExampleOffset((prev) => (prev + 3) % examplePromptPool.length);
  };

  const currentExamples = [
    examplePromptPool[exampleOffset % examplePromptPool.length],
    examplePromptPool[(exampleOffset + 1) % examplePromptPool.length],
    examplePromptPool[(exampleOffset + 2) % examplePromptPool.length]
  ];

  return (
    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 pt-900 h-[calc(100vh-67px)] [@media_screen_and_(width<=768px)]:pt-0">
      <div className="flex box-border min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 items-center justify-center p-200 min-h-[58px] max-mobile-max:items-stretch max-mobile-max:px-0">
        <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch banner-content-container pointer-events-auto shrink opacity-0 max-w-full [transform:translateY(-100%)] [transition:transform_250ms_ease,opacity_250ms_linear] [&:not(:empty)]:opacity-100 [&:not(:empty)]:[transform:translateY(0)]" />
      </div>

      <div className="flex box-border min-h-0 border-0 border-solid view-outline-none flex-col shrink-0 gap-400 items-center justify-center grow min-w-0 h-auto overflow-x-clip pt-300 pb-1600">
        <div className="flex box-border min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 gap-800 items-center justify-center -mx-400 -mb-400 mt-1200 p-400 size-full max-w-full relative overflow-visible min-h-[min(40vh,var(--below-the-fold-max-size))] max-h-(--below-the-fold-max-size) [@media_screen_and_(width<=768px)]:min-h-[min(45vh,var(--below-the-fold-max-size))]">
          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start shrink-0 items-center gap-400">
            <h1 className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none font-bold text-color-default my-0 mx-auto text-center font-regular font-brand text-[64px] leading-[100%] tracking-[-0.06em] [@media_screen_and_(width<=768px)]:text-[32px]">
              What will you build?
            </h1>
            <div className="relative w-full text-center [@media_screen_and_(width<=768px)]:w-fit [@media_screen_and_(width<=768px)]:max-w-full">
              <span className="block font-brand text-[#52545a] font-normal text-[16px] leading-[22px] transition-opacity duration-300">
                {taglines[taglineIdx]}
              </span>
            </div>
          </div>

          {/* Interactive Agent Input Box matching exact live DOM */}
          <div className="my-0 mx-auto w-full max-w-[650px] [&_textarea]:max-h-[200px]">
            <div className="w-full max-w-[800px]" data-agent-input2-root="">
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative isolate [&_textarea]:[box-shadow:none] [&_input]:[box-shadow:none] [&_button]:rounded-[100px] before:absolute before:-z-1 before:-inset-250 before:pointer-events-none before:rounded-8 before:blur-[50px] before:bg-[rgb(253_84_2_/_7.5%)] before:content-[''] landing-page-module__A2EV7W__loggedOutInputImproved">
                <div className="flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative [transition:border-color_0.2s_ease-out] rounded-[20px] [&:is(:focus-within,:hover,[data-is-dragged-over=true])]:border-[#FFB199] _sdz_theme-text-input _sdz_surface bg-surface border border-surface-border-regular _sdz_switch-theme">
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 pt-(--TextArea--pt) pr-(--TextArea--pr) pb-(--TextArea--pb) pl-(--TextArea--pl)" style={{ '--TextArea--pt': '12px', '--TextArea--pr': '12px', '--TextArea--pb': '48px', '--TextArea--pl': '12px' } as any}>
                    <textarea
                      data-ruic="MultiLineInput"
                      placeholder={placeholderText}
                      rows={1}
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      className="cursor-text [outline:0_none] font-inherit transition-background duration-snappy ease-snappy shadow-interactive-input interactive-radius-default bg-surface border border-surface-border-strong custom-pointer-capable:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:cursor-not-allowed custom-focus-visible-active:transition-none custom-focus-visible-active:outline-accent-primary-default custom-focus-not-focus-visible:outline-transparent custom-focus:outline-2 custom-focus:outline-solid custom-focus:-outline-offset-2 custom-focus:outline-accent-primary-default [[data-rui-diagnostics]_&:not([data-ruic])]:outline-offset-2! [[data-rui-diagnostics]_&:not([data-ruic])]:[outline:2px_solid_var(--accent-negative-default)]! _sdz_switch-theme _sdz_theme-text-input py-200 box-border min-w-0 max-w-full overflow-x-hidden! max-tablet-min:scrollbar-none max-tablet-min:[&::-webkit-scrollbar]:hidden w-full resize-none px-150 pt-150 pb-0 cursor-text! border-none! background-transparent! text-(--foreground-default) placeholder:text-(--foreground-dimmest) [&:focus]:view-outline-none!"
                      style={{
                        overflow: 'hidden',
                        overflowWrap: 'break-word',
                        textAlign: 'start',
                        height: '24px'
                      }}
                    />
                  </div>

                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 pr-(--useView--pr) pb-(--useView--pb) pl-(--useView--pl) empty:hidden" style={{ '--useView--pr': '8px', '--useView--pb': '48px', '--useView--pl': '8px' } as any} />

                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row justify-between items-logical-end px-200 absolute bottom-200 left-0 w-full h-0">
                    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-200">
                      <button
                        data-ruic="IconButton"
                        data-analytics-instrumented=""
                        type="button"
                        aria-haspopup="true"
                        aria-expanded="false"
                        data-react-aria-pressable="true"
                        aria-label="Add attachment"
                        className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center w-(--icon-button-size) h-(--icon-button-size) rounded-6 [[data-rui-diagnostics]_&:not([data-ruic])]:outline-offset-2! [[data-rui-diagnostics]_&:not([data-ruic])]:[outline:2px_solid_var(--accent-negative-default)]! text-color-default appearance-none border-0 border-solid border-transparent transition-background-color duration-snappy ease-snappy custom-focus-not-focus-visible:outline-transparent custom-focus-visible-active:transition-none custom-focus-visible-active:outline-accent-primary-default custom-disabled:cursor-not-allowed custom-disabled:opacity-50 select-none cursor-pointer bg-surface forced-colors:outline-regular forced-colors:outline-solid forced-colors:-outline-offset-regular _sdz_custom-pressed:shades-up-2 _sdz_custom-hover:shades-up-2 _sdz_custom-pressed:shades-up-3 custom-focus:outline-thick custom-focus:outline-solid custom-focus:-outline-offset-thin custom-focus:outline-accent-primary-default custom-focus:forced-colors:outline-[Highlight]"
                        style={{ '--icon-button-size': '32px' } as any}
                      >
                        <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="Icon-module__wMmReq__icon" style={{ '--Icon--size': '16px', '--Icon--rotate': '0deg', width: '16px', height: '16px' } as any} aria-hidden="true">
                          <path d="M12 4.25a.75.75 0 0 1 .75.75v6.25H19a.75.75 0 0 1 0 1.5h-6.25V19a.75.75 0 0 1-1.5 0v-6.25H5a.75.75 0 0 1 0-1.5h6.25V5a.75.75 0 0 1 .75-.75" />
                        </svg>
                      </button>
                      <input type="file" multiple className="hidden" />
                    </div>

                    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-row gap-(--useView--gap) justify-logical-start items-center grow-0 basis-auto shrink" style={{ '--useView--gap': '8px' } as any}>
                      <button
                        type="button"
                        data-cy="ai-prompt-submit"
                        disabled={!promptText.trim()}
                        onClick={() => {
                          if (promptText.trim()) {
                            alert(`Starting agent with: "${promptText}"`);
                          }
                        }}
                        className={`flex h-800 cursor-pointer items-center justify-center text-center font-brand font-regular not-italic leading-350 border-0 border-none border-image-none gap-0 p-200 rounded-[100px] bg-[#ff3c00] text-[rgb(255_255_255_/_90%)] text-[14px] [transition:opacity_0.15s_ease-out,padding_0.25s_ease-out,gap_0.25s_ease-out,width_0.25s_ease-out] [&:not(:disabled):hover]:opacity-90 disabled:opacity-40 disabled:cursor-default disabled:bg-[#ff3c00] ${
                          promptText.trim() ? 'w-auto px-300 gap-100' : 'w-800'
                        }`}
                      >
                        {promptText.trim() && <span className="inline-block whitespace-nowrap">Start</span>}
                        <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="Icon-module__wMmReq__icon" style={{ '--Icon--size': '16px', '--Icon--rotate': '0deg', width: '16px', height: '16px' } as any} aria-hidden="true">
                          <path fillRule="evenodd" d="M19.53 11.47a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 1 1-1.06-1.06l5.72-5.72H5a.75.75 0 0 1 0-1.5h12.19l-5.72-5.72a.75.75 0 0 1 1.06-1.06z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exact Category Output Pills & Arrow Scroll inside exact 172px container */}
              <div className="[html[data-slides-bias-hint]_&]:invisible">
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 -m-400">
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row justify-center items-center gap-300 flex-wrap pt-800">
                    <div className="flex box-border min-h-0 border-0 border-solid view-outline-none flex-row gap-(--useView--gap) justify-center items-center pb-(--useView--pb) min-w-0 max-w-full grow shrink basis-full" style={{ '--useView--gap': '8px', '--useView--pb': '32px', '--RequestedOutputsOptions--bleed': '0px' } as any}>
                      <button
                        data-ruic="IconButton"
                        data-analytics-instrumented=""
                        type="button"
                        aria-label="Previous"
                        onClick={() => scrollPills('left')}
                        className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center w-(--icon-button-size) h-(--icon-button-size) rounded-6 [[data-rui-diagnostics]_&:not([data-ruic])]:outline-offset-2! [[data-rui-diagnostics]_&:not([data-ruic])]:[outline:2px_solid_var(--accent-negative-default)]! text-color-default appearance-none border-0 border-solid border-transparent transition-background-color duration-snappy ease-snappy custom-focus-not-focus-visible:outline-transparent custom-focus-visible-active:transition-none custom-focus-visible-active:outline-accent-primary-default custom-disabled:cursor-not-allowed custom-disabled:opacity-50 select-none cursor-pointer bg-surface forced-colors:outline-regular forced-colors:outline-solid forced-colors:-outline-offset-regular _sdz_custom-pressed:shades-up-2 _sdz_custom-hover:shades-up-2 _sdz_custom-pressed:shades-up-3 custom-focus:outline-thick custom-focus:outline-solid custom-focus:-outline-offset-thin custom-focus:outline-accent-primary-default custom-focus:forced-colors:outline-[Highlight] z-1 -translate-y-250"
                        style={{ '--icon-button-size': '32px' } as any}
                      >
                        <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="Icon-module__wMmReq__icon" aria-hidden="true" style={{ '--Icon--size': '16px', '--Icon--rotate': '0deg', width: '16px', height: '16px' } as any}>
                          <path fillRule="evenodd" d="M4.47 11.47a.75.75 0 0 0 0 1.06l7 7a.75.75 0 1 0 1.06-1.06l-5.72-5.72H19a.75.75 0 0 0 0-1.5H6.81l5.72-5.72a.75.75 0 0 0-1.06-1.06z" clipRule="evenodd" />
                        </svg>
                      </button>

                      <div
                        ref={pillsContainerRef}
                        className="flex box-border min-h-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch min-w-0 shrink overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-auto snap-x snap-mandatory scrollbar-none [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden [@media(width<=480px)]:-mx-(--RequestedOutputsOptions--bleed) [@media(width<=480px)]:scroll-px-(--RequestedOutputsOptions--bleed)"
                        style={{ maxWidth: '496px' }}
                      >
                        <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start items-stretch shrink-0 flex-row w-max pb-500 gap-(--requested-output-option-gap)" style={{ '--requested-output-option-gap': '4px' } as any}>
                  <div key="Website" className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 justify-center items-center w-2400 snap-start [@media(width<=480px)]:first:pl-(--RequestedOutputsOptions--bleed)">
                    <button
                      type="button"
                      tabIndex={0}
                      onClick={() => setActivePill(activePill === 'Website' ? null : 'Website')}
                      className="flex box-border min-h-0 min-w-0 border-0 view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative m-0 size-1200 cursor-pointer border-none background-transparent p-0 font-inherit"
                    >
                      <div
                        className={`flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col shrink-0 h-full w-full items-center justify-center [:not([disabled],[aria-disabled]):focus-visible>&]:rounded-16 [:not([disabled],[aria-disabled]):focus-visible>&]:outline-thick [:not([disabled],[aria-disabled]):focus-visible>&]:outline-solid [:not([disabled],[aria-disabled]):focus-visible>&]:-outline-offset-thick [:not([disabled],[aria-disabled]):focus-visible>&]:outline-accent-primary-default font-inherit transition-background duration-snappy ease-snappy text-color-default custom-pointer-capable:cursor-pointer interactive-radius-default bg-surface border border-surface-border-regular disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:cursor-not-allowed custom-focus-visible-active:transition-none custom-focus-visible-active:outline-accent-primary-default custom-focus-not-focus-visible:outline-transparent [[data-rui-diagnostics]_&:not([data-ruic])]:outline-offset-2! [[data-rui-diagnostics]_&:not([data-ruic])]:[outline:2px_solid_var(--accent-negative-default)]! _sdz_surface _sdz_custom-hover:shades-up-2 _sdz_custom-pressed:shades-up-3 ${
                          activePill === 'Website' ? 'bg-[#18191B] text-white' : ''
                        }`}
                        style={{ '--interactive2-border-radius': '16px' } as any}
                      >
                        <svg
                          preserveAspectRatio="xMidYMin"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="Icon-module__wMmReq__icon"
                          style={{ '--Icon--size': '16px', '--Icon--rotate': '0deg', width: '16px', height: '16px' } as any}
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{ __html: "<path d=\"M14 5.25a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1 0-1.5zM18 5.25a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5z\"></path><path fill-rule=\"evenodd\" d=\"M19 2.25A2.75 2.75 0 0 1 21.75 5v14A2.75 2.75 0 0 1 19 21.75H5A2.75 2.75 0 0 1 2.25 19V5A2.75 2.75 0 0 1 5 2.25zM3.75 19c0 .69.56 1.25 1.25 1.25h14c.69 0 1.25-.56 1.25-1.25V9.75H3.75zM5 3.75c-.69 0-1.25.56-1.25 1.25v3.25h16.5V5c0-.69-.56-1.25-1.25-1.25z\" clip-rule=\"evenodd\"></path>" }}
                        />
                      </div>
                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 pt-100 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                        <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs max-w-full text-ellipsis whitespace-nowrap wrap-break-word inline-block overflow-hidden text-color-default">
                          Website
                        </span>
                      </div>
                    </button>
                  </div>
                  <div key="Mobile" className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 justify-center items-center w-2400 snap-start">
                    <button
                      type="button"
                      tabIndex={0}
                      onClick={() => setActivePill(activePill === 'Mobile' ? null : 'Mobile')}
                      className="flex box-border min-h-0 min-w-0 border-0 view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative m-0 size-1200 cursor-pointer border-none background-transparent p-0 font-inherit"
                    >
                      <div
                        className={`flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col shrink-0 h-full w-full items-center justify-center [:not([disabled],[aria-disabled]):focus-visible>&]:rounded-16 [:not([disabled],[aria-disabled]):focus-visible>&]:outline-thick [:not([disabled],[aria-disabled]):focus-visible>&]:outline-solid [:not([disabled],[aria-disabled]):focus-visible>&]:-outline-offset-thick [:not([disabled],[aria-disabled]):focus-visible>&]:outline-accent-primary-default font-inherit transition-background duration-snappy ease-snappy text-color-default custom-pointer-capable:cursor-pointer interactive-radius-default bg-surface border border-surface-border-regular disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:cursor-not-allowed custom-focus-visible-active:transition-none custom-focus-visible-active:outline-accent-primary-default custom-focus-not-focus-visible:outline-transparent [[data-rui-diagnostics]_&:not([data-ruic])]:outline-offset-2! [[data-rui-diagnostics]_&:not([data-ruic])]:[outline:2px_solid_var(--accent-negative-default)]! _sdz_surface _sdz_custom-hover:shades-up-2 _sdz_custom-pressed:shades-up-3 ${
                          activePill === 'Mobile' ? 'bg-[#18191B] text-white' : ''
                        }`}
                        style={{ '--interactive2-border-radius': '16px' } as any}
                      >
                        <svg
                          preserveAspectRatio="xMidYMin"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="Icon-module__wMmReq__icon"
                          style={{ '--Icon--size': '16px', '--Icon--rotate': '0deg', width: '16px', height: '16px' } as any}
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{ __html: "<path d=\"M12.01 17.25a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1 0-1.5z\"></path><path fill-rule=\"evenodd\" d=\"M17 1.25A2.75 2.75 0 0 1 19.75 4v16A2.75 2.75 0 0 1 17 22.75H7A2.75 2.75 0 0 1 4.25 20V4A2.75 2.75 0 0 1 7 1.25zM7 2.75c-.69 0-1.25.56-1.25 1.25v16c0 .69.56 1.25 1.25 1.25h10c.69 0 1.25-.56 1.25-1.25V4c0-.69-.56-1.25-1.25-1.25z\" clip-rule=\"evenodd\"></path>" }}
                        />
                      </div>
                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 pt-100 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                        <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs max-w-full text-ellipsis whitespace-nowrap wrap-break-word inline-block overflow-hidden text-color-default">
                          Mobile
                        </span>
                      </div>
                    </button>
                  </div>
                  <div key="Design" className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 justify-center items-center w-2400 snap-start">
                    <button
                      type="button"
                      tabIndex={0}
                      onClick={() => setActivePill(activePill === 'Design' ? null : 'Design')}
                      className="flex box-border min-h-0 min-w-0 border-0 view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative m-0 size-1200 cursor-pointer border-none background-transparent p-0 font-inherit"
                    >
                      <div
                        className={`flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col shrink-0 h-full w-full items-center justify-center [:not([disabled],[aria-disabled]):focus-visible>&]:rounded-16 [:not([disabled],[aria-disabled]):focus-visible>&]:outline-thick [:not([disabled],[aria-disabled]):focus-visible>&]:outline-solid [:not([disabled],[aria-disabled]):focus-visible>&]:-outline-offset-thick [:not([disabled],[aria-disabled]):focus-visible>&]:outline-accent-primary-default font-inherit transition-background duration-snappy ease-snappy text-color-default custom-pointer-capable:cursor-pointer interactive-radius-default bg-surface border border-surface-border-regular disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:cursor-not-allowed custom-focus-visible-active:transition-none custom-focus-visible-active:outline-accent-primary-default custom-focus-not-focus-visible:outline-transparent [[data-rui-diagnostics]_&:not([data-ruic])]:outline-offset-2! [[data-rui-diagnostics]_&:not([data-ruic])]:[outline:2px_solid_var(--accent-negative-default)]! _sdz_surface _sdz_custom-hover:shades-up-2 _sdz_custom-pressed:shades-up-3 ${
                          activePill === 'Design' ? 'bg-[#18191B] text-white' : ''
                        }`}
                        style={{ '--interactive2-border-radius': '16px' } as any}
                      >
                        <svg
                          preserveAspectRatio="xMidYMin"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="Icon-module__wMmReq__icon"
                          style={{ '--Icon--size': '16px', '--Icon--rotate': '0deg', width: '16px', height: '16px' } as any}
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{ __html: "<path fill-rule=\"evenodd\" d=\"M11.664 13.095c-.246-1.147.892-2.101 1.978-1.66l7.415 3.012c1.286.522 1.188 2.374-.145 2.757l-2.933.843a.9.9 0 0 0-.555.467l-1.34 2.741c-.61 1.246-2.45 1.022-2.742-.335zm1.468-.402a.104.104 0 0 0-.14.118l1.678 7.825c.02.096.15.111.194.023l1.507-3.084c.173-.354.488-.618.867-.727l3.299-.948a.104.104 0 0 0 .01-.196z\" clip-rule=\"evenodd\"></path><path d=\"M2.781 17.925a.75.75 0 0 1 .75.75 1.25 1.25 0 0 0 1.25 1.25.75.75 0 0 1 0 1.5 2.75 2.75 0 0 1-2.75-2.75.75.75 0 0 1 .75-.75M9.781 19.925a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1 0-1.5zM2.781 12.925a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75M2.781 7.925a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75M20.781 7.925a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75M4.781 1.925a.75.75 0 0 1 0 1.5 1.25 1.25 0 0 0-1.25 1.25.75.75 0 0 1-1.5 0 2.75 2.75 0 0 1 2.75-2.75M18.781 1.925a2.75 2.75 0 0 1 2.75 2.75.75.75 0 0 1-1.5 0 1.25 1.25 0 0 0-1.25-1.25.75.75 0 0 1 0-1.5M9.781 1.925a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1 0-1.5zM14.781 1.925a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1 0-1.5z\"></path>" }}
                        />
                      </div>
                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 pt-100 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                        <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs max-w-full text-ellipsis whitespace-nowrap wrap-break-word inline-block overflow-hidden text-color-default">
                          Design
                        </span>
                      </div>
                    </button>
                  </div>
                  <div key="Slides" className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 justify-center items-center w-2400 snap-start">
                    <button
                      type="button"
                      tabIndex={0}
                      onClick={() => setActivePill(activePill === 'Slides' ? null : 'Slides')}
                      className="flex box-border min-h-0 min-w-0 border-0 view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative m-0 size-1200 cursor-pointer border-none background-transparent p-0 font-inherit"
                    >
                      <div
                        className={`flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col shrink-0 h-full w-full items-center justify-center [:not([disabled],[aria-disabled]):focus-visible>&]:rounded-16 [:not([disabled],[aria-disabled]):focus-visible>&]:outline-thick [:not([disabled],[aria-disabled]):focus-visible>&]:outline-solid [:not([disabled],[aria-disabled]):focus-visible>&]:-outline-offset-thick [:not([disabled],[aria-disabled]):focus-visible>&]:outline-accent-primary-default font-inherit transition-background duration-snappy ease-snappy text-color-default custom-pointer-capable:cursor-pointer interactive-radius-default bg-surface border border-surface-border-regular disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:cursor-not-allowed custom-focus-visible-active:transition-none custom-focus-visible-active:outline-accent-primary-default custom-focus-not-focus-visible:outline-transparent [[data-rui-diagnostics]_&:not([data-ruic])]:outline-offset-2! [[data-rui-diagnostics]_&:not([data-ruic])]:[outline:2px_solid_var(--accent-negative-default)]! _sdz_surface _sdz_custom-hover:shades-up-2 _sdz_custom-pressed:shades-up-3 ${
                          activePill === 'Slides' ? 'bg-[#18191B] text-white' : ''
                        }`}
                        style={{ '--interactive2-border-radius': '16px' } as any}
                      >
                        <svg
                          preserveAspectRatio="xMidYMin"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="Icon-module__wMmReq__icon"
                          style={{ '--Icon--size': '16px', '--Icon--rotate': '0deg', width: '16px', height: '16px' } as any}
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{ __html: "<path fill-rule=\"evenodd\" d=\"M19 9.25A2.75 2.75 0 0 1 21.75 12v8A2.75 2.75 0 0 1 19 22.75H5A2.75 2.75 0 0 1 2.25 20v-8A2.75 2.75 0 0 1 5 9.25zm-14 1.5c-.69 0-1.25.56-1.25 1.25v8c0 .69.56 1.25 1.25 1.25h14c.69 0 1.25-.56 1.25-1.25v-8c0-.69-.56-1.25-1.25-1.25z\" clip-rule=\"evenodd\"></path><path d=\"M19 5.25a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1 0-1.5zM17 1.25a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1 0-1.5z\"></path>" }}
                        />
                      </div>
                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 pt-100 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                        <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs max-w-full text-ellipsis whitespace-nowrap wrap-break-word inline-block overflow-hidden text-color-default">
                          Slides
                        </span>
                      </div>
                    </button>
                  </div>
                  <div key="Animation" className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 justify-center items-center w-2400 snap-start">
                    <button
                      type="button"
                      tabIndex={0}
                      onClick={() => setActivePill(activePill === 'Animation' ? null : 'Animation')}
                      className="flex box-border min-h-0 min-w-0 border-0 view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative m-0 size-1200 cursor-pointer border-none background-transparent p-0 font-inherit"
                    >
                      <div
                        className={`flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col shrink-0 h-full w-full items-center justify-center [:not([disabled],[aria-disabled]):focus-visible>&]:rounded-16 [:not([disabled],[aria-disabled]):focus-visible>&]:outline-thick [:not([disabled],[aria-disabled]):focus-visible>&]:outline-solid [:not([disabled],[aria-disabled]):focus-visible>&]:-outline-offset-thick [:not([disabled],[aria-disabled]):focus-visible>&]:outline-accent-primary-default font-inherit transition-background duration-snappy ease-snappy text-color-default custom-pointer-capable:cursor-pointer interactive-radius-default bg-surface border border-surface-border-regular disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:cursor-not-allowed custom-focus-visible-active:transition-none custom-focus-visible-active:outline-accent-primary-default custom-focus-not-focus-visible:outline-transparent [[data-rui-diagnostics]_&:not([data-ruic])]:outline-offset-2! [[data-rui-diagnostics]_&:not([data-ruic])]:[outline:2px_solid_var(--accent-negative-default)]! _sdz_surface _sdz_custom-hover:shades-up-2 _sdz_custom-pressed:shades-up-3 ${
                          activePill === 'Animation' ? 'bg-[#18191B] text-white' : ''
                        }`}
                        style={{ '--interactive2-border-radius': '16px' } as any}
                      >
                        <svg
                          preserveAspectRatio="xMidYMin"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="Icon-module__wMmReq__icon"
                          style={{ '--Icon--size': '16px', '--Icon--rotate': '0deg', width: '16px', height: '16px' } as any}
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{ __html: "<path fill-rule=\"evenodd\" d=\"m10.467 11.252.182.012c.181.023.357.083.516.175l4.066 2.352a1.4 1.4 0 0 1 .511 1.907 1.4 1.4 0 0 1-.51.511l-4.065 2.352a1.397 1.397 0 0 1-2.094-1.21v-4.703c0-.244.064-.485.186-.697l.101-.152c.111-.145.25-.268.41-.36l.164-.08c.168-.07.35-.107.533-.107m.106 5.919L14.326 15l-3.753-2.172z\" clip-rule=\"evenodd\"></path><path fill-rule=\"evenodd\" d=\"M19 2.25A2.75 2.75 0 0 1 21.75 5v14A2.75 2.75 0 0 1 19 21.75H5A2.75 2.75 0 0 1 2.25 19V5A2.75 2.75 0 0 1 5 2.25zM3.75 19c0 .69.56 1.25 1.25 1.25h14c.69 0 1.25-.56 1.25-1.25V9.75H3.75zM5 3.75c-.69 0-1.25.56-1.25 1.25v3.25h16.5V5c0-.69-.56-1.25-1.25-1.25z\" clip-rule=\"evenodd\"></path>" }}
                        />
                      </div>
                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 pt-100 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                        <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs max-w-full text-ellipsis whitespace-nowrap wrap-break-word inline-block overflow-hidden text-color-default">
                          Animation
                        </span>
                      </div>
                    </button>
                  </div>
                  <div key="Data Visualization" className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 justify-center items-center w-2400 snap-start">
                    <button
                      type="button"
                      tabIndex={0}
                      onClick={() => setActivePill(activePill === 'Data Visualization' ? null : 'Data Visualization')}
                      className="flex box-border min-h-0 min-w-0 border-0 view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative m-0 size-1200 cursor-pointer border-none background-transparent p-0 font-inherit"
                    >
                      <div
                        className={`flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col shrink-0 h-full w-full items-center justify-center [:not([disabled],[aria-disabled]):focus-visible>&]:rounded-16 [:not([disabled],[aria-disabled]):focus-visible>&]:outline-thick [:not([disabled],[aria-disabled]):focus-visible>&]:outline-solid [:not([disabled],[aria-disabled]):focus-visible>&]:-outline-offset-thick [:not([disabled],[aria-disabled]):focus-visible>&]:outline-accent-primary-default font-inherit transition-background duration-snappy ease-snappy text-color-default custom-pointer-capable:cursor-pointer interactive-radius-default bg-surface border border-surface-border-regular disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:cursor-not-allowed custom-focus-visible-active:transition-none custom-focus-visible-active:outline-accent-primary-default custom-focus-not-focus-visible:outline-transparent [[data-rui-diagnostics]_&:not([data-ruic])]:outline-offset-2! [[data-rui-diagnostics]_&:not([data-ruic])]:[outline:2px_solid_var(--accent-negative-default)]! _sdz_surface _sdz_custom-hover:shades-up-2 _sdz_custom-pressed:shades-up-3 ${
                          activePill === 'Data Visualization' ? 'bg-[#18191B] text-white' : ''
                        }`}
                        style={{ '--interactive2-border-radius': '16px' } as any}
                      >
                        <svg
                          preserveAspectRatio="xMidYMin"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="Icon-module__wMmReq__icon"
                          style={{ '--Icon--size': '16px', '--Icon--rotate': '0deg', width: '16px', height: '16px' } as any}
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{ __html: "<path d=\"M5 14.25a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0v-6a.75.75 0 0 1 .75-.75M12 2.25a.75.75 0 0 1 .75.75v18a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75M19 8.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75\"></path>" }}
                        />
                      </div>
                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 pt-100 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                        <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs max-w-full text-ellipsis whitespace-nowrap wrap-break-word inline-block overflow-hidden text-color-default">
                          Data Visualization
                        </span>
                      </div>
                    </button>
                  </div>
                  <div key="3D Game" className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 justify-center items-center w-2400 snap-start">
                    <button
                      type="button"
                      tabIndex={0}
                      onClick={() => setActivePill(activePill === '3D Game' ? null : '3D Game')}
                      className="flex box-border min-h-0 min-w-0 border-0 view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative m-0 size-1200 cursor-pointer border-none background-transparent p-0 font-inherit"
                    >
                      <div
                        className={`flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col shrink-0 h-full w-full items-center justify-center [:not([disabled],[aria-disabled]):focus-visible>&]:rounded-16 [:not([disabled],[aria-disabled]):focus-visible>&]:outline-thick [:not([disabled],[aria-disabled]):focus-visible>&]:outline-solid [:not([disabled],[aria-disabled]):focus-visible>&]:-outline-offset-thick [:not([disabled],[aria-disabled]):focus-visible>&]:outline-accent-primary-default font-inherit transition-background duration-snappy ease-snappy text-color-default custom-pointer-capable:cursor-pointer interactive-radius-default bg-surface border border-surface-border-regular disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:cursor-not-allowed custom-focus-visible-active:transition-none custom-focus-visible-active:outline-accent-primary-default custom-focus-not-focus-visible:outline-transparent [[data-rui-diagnostics]_&:not([data-ruic])]:outline-offset-2! [[data-rui-diagnostics]_&:not([data-ruic])]:[outline:2px_solid_var(--accent-negative-default)]! _sdz_surface _sdz_custom-hover:shades-up-2 _sdz_custom-pressed:shades-up-3 ${
                          activePill === '3D Game' ? 'bg-[#18191B] text-white' : ''
                        }`}
                        style={{ '--interactive2-border-radius': '16px' } as any}
                      >
                        <svg
                          preserveAspectRatio="xMidYMin"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="Icon-module__wMmReq__icon"
                          style={{ '--Icon--size': '16px', '--Icon--rotate': '0deg', width: '16px', height: '16px' } as any}
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{ __html: "<path fill-rule=\"evenodd\" d=\"M12 2.25a3.75 3.75 0 0 1 .75 7.425v4.575H19A2.75 2.75 0 0 1 21.75 17v2A2.75 2.75 0 0 1 19 21.75H5A2.75 2.75 0 0 1 2.25 19v-2A2.75 2.75 0 0 1 5 14.25h.25V13a.75.75 0 0 1 1.5 0v1.25h4.5V9.675A3.751 3.751 0 0 1 12 2.25m-7 13.5A1.25 1.25 0 0 0 3.75 17v2l.006.124A1.25 1.25 0 0 0 5 20.25h14A1.25 1.25 0 0 0 20.25 19v-2A1.25 1.25 0 0 0 19 15.75zm7-12a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5\" clip-rule=\"evenodd\"></path>" }}
                        />
                      </div>
                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 pt-100 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                        <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs max-w-full text-ellipsis whitespace-nowrap wrap-break-word inline-block overflow-hidden text-color-default">
                          3D Game
                        </span>
                      </div>
                    </button>
                  </div>
                  <div key="Document" className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 justify-center items-center w-2400 snap-start">
                    <button
                      type="button"
                      tabIndex={0}
                      onClick={() => setActivePill(activePill === 'Document' ? null : 'Document')}
                      className="flex box-border min-h-0 min-w-0 border-0 view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative m-0 size-1200 cursor-pointer border-none background-transparent p-0 font-inherit"
                    >
                      <div
                        className={`flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col shrink-0 h-full w-full items-center justify-center [:not([disabled],[aria-disabled]):focus-visible>&]:rounded-16 [:not([disabled],[aria-disabled]):focus-visible>&]:outline-thick [:not([disabled],[aria-disabled]):focus-visible>&]:outline-solid [:not([disabled],[aria-disabled]):focus-visible>&]:-outline-offset-thick [:not([disabled],[aria-disabled]):focus-visible>&]:outline-accent-primary-default font-inherit transition-background duration-snappy ease-snappy text-color-default custom-pointer-capable:cursor-pointer interactive-radius-default bg-surface border border-surface-border-regular disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:cursor-not-allowed custom-focus-visible-active:transition-none custom-focus-visible-active:outline-accent-primary-default custom-focus-not-focus-visible:outline-transparent [[data-rui-diagnostics]_&:not([data-ruic])]:outline-offset-2! [[data-rui-diagnostics]_&:not([data-ruic])]:[outline:2px_solid_var(--accent-negative-default)]! _sdz_surface _sdz_custom-hover:shades-up-2 _sdz_custom-pressed:shades-up-3 ${
                          activePill === 'Document' ? 'bg-[#18191B] text-white' : ''
                        }`}
                        style={{ '--interactive2-border-radius': '16px' } as any}
                      >
                        <svg
                          preserveAspectRatio="xMidYMin"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="Icon-module__wMmReq__icon"
                          style={{ '--Icon--size': '16px', '--Icon--rotate': '0deg', width: '16px', height: '16px' } as any}
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{ __html: "<path d=\"M14.202 17.537a.75.75 0 0 1 0 1.5H7.058a.75.75 0 0 1 0-1.5zM16.942 14.123a.75.75 0 0 1 0 1.5H7.058a.75.75 0 1 1 0-1.5zM16.942 10.709a.75.75 0 0 1 0 1.5H7.058a.75.75 0 0 1 0-1.5z\"></path><path fill-rule=\"evenodd\" d=\"M14.038 1.251a3.15 3.15 0 0 1 2.196.925l3.586 3.586A3.16 3.16 0 0 1 20.75 8v12A2.75 2.75 0 0 1 18 22.75H6A2.75 2.75 0 0 1 3.25 20V4A2.75 2.75 0 0 1 6 1.25h8zM6 2.75A1.25 1.25 0 0 0 4.75 4v16A1.25 1.25 0 0 0 6 21.25h12A1.25 1.25 0 0 0 19.25 20V8.75H15A1.75 1.75 0 0 1 13.25 7V2.75zM14.75 7a.25.25 0 0 0 .25.25h4.07a1.7 1.7 0 0 0-.306-.424l-3.591-3.59a1.7 1.7 0 0 0-.423-.306z\" clip-rule=\"evenodd\"></path>" }}
                        />
                      </div>
                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 pt-100 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                        <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs max-w-full text-ellipsis whitespace-nowrap wrap-break-word inline-block overflow-hidden text-color-default">
                          Document
                        </span>
                      </div>
                    </button>
                  </div>
                  <div key="Spreadsheet" className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 justify-center items-center w-2400 snap-start [@media(width<=480px)]:last:pr-(--RequestedOutputsOptions--bleed)">
                    <button
                      type="button"
                      tabIndex={0}
                      onClick={() => setActivePill(activePill === 'Spreadsheet' ? null : 'Spreadsheet')}
                      className="flex box-border min-h-0 min-w-0 border-0 view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative m-0 size-1200 cursor-pointer border-none background-transparent p-0 font-inherit"
                    >
                      <div
                        className={`flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col shrink-0 h-full w-full items-center justify-center [:not([disabled],[aria-disabled]):focus-visible>&]:rounded-16 [:not([disabled],[aria-disabled]):focus-visible>&]:outline-thick [:not([disabled],[aria-disabled]):focus-visible>&]:outline-solid [:not([disabled],[aria-disabled]):focus-visible>&]:-outline-offset-thick [:not([disabled],[aria-disabled]):focus-visible>&]:outline-accent-primary-default font-inherit transition-background duration-snappy ease-snappy text-color-default custom-pointer-capable:cursor-pointer interactive-radius-default bg-surface border border-surface-border-regular disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:cursor-not-allowed custom-focus-visible-active:transition-none custom-focus-visible-active:outline-accent-primary-default custom-focus-not-focus-visible:outline-transparent [[data-rui-diagnostics]_&:not([data-ruic])]:outline-offset-2! [[data-rui-diagnostics]_&:not([data-ruic])]:[outline:2px_solid_var(--accent-negative-default)]! _sdz_surface _sdz_custom-hover:shades-up-2 _sdz_custom-pressed:shades-up-3 ${
                          activePill === 'Spreadsheet' ? 'bg-[#18191B] text-white' : ''
                        }`}
                        style={{ '--interactive2-border-radius': '16px' } as any}
                      >
                        <svg
                          preserveAspectRatio="xMidYMin"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="Icon-module__wMmReq__icon"
                          style={{ '--Icon--size': '16px', '--Icon--rotate': '0deg', width: '16px', height: '16px' } as any}
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{ __html: "<path fill-rule=\"evenodd\" d=\"M18 2.25A3.75 3.75 0 0 1 21.75 6v12A3.75 3.75 0 0 1 18 21.75H6A3.75 3.75 0 0 1 2.25 18V6A3.75 3.75 0 0 1 6 2.25zM3.75 15.75V18A2.25 2.25 0 0 0 6 20.25h2.25v-4.5zm6 0v4.5H18A2.25 2.25 0 0 0 20.25 18v-2.25zm-6-6v4.5h4.5v-4.5zm6 0v4.5h10.5v-4.5zM6 3.75A2.25 2.25 0 0 0 3.75 6v2.25h4.5v-4.5zm3.75 0v4.5h10.5V6A2.25 2.25 0 0 0 18 3.75z\" clip-rule=\"evenodd\"></path>" }}
                        />
                      </div>
                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 pt-100 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                        <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs max-w-full text-ellipsis whitespace-nowrap wrap-break-word inline-block overflow-hidden text-color-default">
                          Spreadsheet
                        </span>
                      </div>
                    </button>
                  </div>
                        </div>
                      </div>

                      <button
                        data-ruic="IconButton"
                        data-analytics-instrumented=""
                        type="button"
                        aria-label="Next"
                        onClick={() => scrollPills('right')}
                        className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center w-(--icon-button-size) h-(--icon-button-size) rounded-6 [[data-rui-diagnostics]_&:not([data-ruic])]:outline-offset-2! [[data-rui-diagnostics]_&:not([data-ruic])]:[outline:2px_solid_var(--accent-negative-default)]! text-color-default appearance-none border-0 border-solid border-transparent transition-background-color duration-snappy ease-snappy custom-focus-not-focus-visible:outline-transparent custom-focus-visible-active:transition-none custom-focus-visible-active:outline-accent-primary-default custom-disabled:cursor-not-allowed custom-disabled:opacity-50 select-none cursor-pointer bg-surface forced-colors:outline-regular forced-colors:outline-solid forced-colors:-outline-offset-regular _sdz_custom-pressed:shades-up-2 _sdz_custom-hover:shades-up-2 _sdz_custom-pressed:shades-up-3 custom-focus:outline-thick custom-focus:outline-solid custom-focus:-outline-offset-thin custom-focus:outline-accent-primary-default custom-focus:forced-colors:outline-[Highlight] z-1 -translate-y-250"
                        style={{ '--icon-button-size': '32px' } as any}
                      >
                        <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="Icon-module__wMmReq__icon" aria-hidden="true" style={{ '--Icon--size': '16px', '--Icon--rotate': '0deg', width: '16px', height: '16px' } as any}>
                          <path fillRule="evenodd" d="M19.53 11.47a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 1 1-1.06-1.06l5.72-5.72H5a.75.75 0 0 1 0-1.5h12.19l-5.72-5.72a.75.75 0 0 1 1.06-1.06z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sibling Prompt Suggestions directly inside invisible container */}
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 _sdz_theme-text-input _sdz_surface _sdz_switch-theme">
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 [@media_screen_and_(width<=768px)]:hidden">
                    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start shrink-0 items-center gap-300 pb-200">
                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-200 relative h-500">
                        <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs wrap-break-word inline text-color-tertiary">
                          Try an example prompt
                        </span>
                        <button
                          data-ruic="IconButton"
                          data-analytics-instrumented=""
                          type="button"
                          aria-label="Reshuffle"
                          onClick={handleReshuffle}
                          className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center w-(--icon-button-size) h-(--icon-button-size) rounded-6 [[data-rui-diagnostics]_&:not([data-ruic])]:outline-offset-2! [[data-rui-diagnostics]_&:not([data-ruic])]:[outline:2px_solid_var(--accent-negative-default)]! text-color-tertiary appearance-none border-0 border-solid border-transparent transition-background-color duration-snappy ease-snappy custom-focus-not-focus-visible:outline-transparent custom-focus-visible-active:transition-none custom-focus-visible-active:outline-accent-primary-default custom-disabled:cursor-not-allowed custom-disabled:opacity-50 select-none cursor-pointer bg-transparent forced-colors:outline-regular forced-colors:outline-solid forced-colors:-outline-offset-regular _sdz_surface _sdz_custom-hover:shades-up-2 _sdz_custom-pressed:shades-up-3 custom-focus:outline-thick custom-focus:outline-solid custom-focus:-outline-offset-thin custom-focus:outline-accent-primary-default custom-focus:forced-colors:outline-[Highlight]"
                          style={{ '--icon-button-size': '24px' } as any}
                        >
                          <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="Icon-module__wMmReq__icon" style={{ '--Icon--size': '16px', '--Icon--rotate': '0deg', width: '16px', height: '16px' } as any} aria-hidden="true">
                            <path d="M12.003 2.25A9.75 9.75 0 0 1 21.75 12a.75.75 0 0 1-1.5 0 8.25 8.25 0 0 0-8.247-8.25A8.25 8.25 0 0 0 4.7 6.425l.89.825H8.75a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75V2.25a.75.75 0 0 1 1.5 0v3.084A9.75 9.75 0 0 1 12.003 2.25zM12 21.75a9.75 9.75 0 0 1-9.747-9.75.75.75 0 0 1 1.5 0 8.25 8.25 0 0 0 8.247 8.25 8.25 8.25 0 0 0 7.303-4.425l-.89-.825H15.25a.75.75 0 0 1 0-1.5h5.75a.75.75 0 0 1 .75.75v5.75a.75.75 0 0 1-1.5 0v-3.084A9.75 9.75 0 0 1 12 21.75z" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none items-stretch shrink-0 flex-row justify-center gap-200 flex-wrap">
                        {currentExamples.map((item) => (
                          <div key={item.shortPrompt} style={{ opacity: 1, transform: 'none' }}>
                            <button
                              data-ruic="Button"
                              data-analytics-instrumented=""
                              type="button"
                              tabIndex={0}
                              onClick={() => setPromptText(item.prompt)}
                              className="[[data-rui-diagnostics]_&:not([data-ruic])]:outline-offset-2! [[data-rui-diagnostics]_&:not([data-ruic])]:[outline:2px_solid_var(--accent-negative-default)]! text-color-default appearance-none border-0 border-solid border-transparent transition-background-color duration-snappy ease-snappy custom-focus-not-focus-visible:outline-transparent custom-focus-visible-active:transition-none custom-focus-visible-active:outline-accent-primary-default custom-disabled:cursor-not-allowed custom-disabled:opacity-50 select-none shadow-control bg-surface inset-ring inset-ring-surface-border-regular forced-colors:outline-regular forced-colors:outline-solid forced-colors:-outline-offset-regular _sdz_surface-2 _sdz_custom-hover:shades-up-2 _sdz_custom-pressed:shades-up-3 custom-focus:outline-thick custom-focus:outline-solid custom-focus:-outline-offset-thin custom-focus:outline-accent-primary-default custom-focus:forced-colors:outline-[Highlight] flex min-h-0 min-w-0 basis-auto cursor-pointer flex-row items-center shrink-0 self-auto justify-center h-800 gap-50 rounded-6 px-200"
                            >
                              <span className="flex min-w-0 items-center gap-200 px-100 text-label-l-control">
                                <span className="min-w-0 grow truncate text-left">{item.shortPrompt}</span>
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPromptBuilder;
