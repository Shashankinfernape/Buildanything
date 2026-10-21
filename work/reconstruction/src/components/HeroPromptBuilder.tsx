import React, { useState, useEffect, useRef } from 'react';

const placeholders = [
  "Create a personal finance dashboard with interactive budget tracking...",
  "Create a minimalist habit tracker with streak tracking and dark mode...",
  "Build a collaborative canvas for brainstorming with real-time sync...",
  "Create a SaaS landing page with animated pricing cards and FAQ..."
];

const taglines = [
  "Turn ideas into apps in minutes — no coding needed",
  "You can always make changes later.",
  "Your first prompt is free. No credit consumption."
];

export const HeroPromptBuilder: React.FC = () => {
  const [promptText, setPromptText] = useState('');
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [placeholderText, setPlaceholderText] = useState('');
  const [activePill, setActivePill] = useState<string | null>(null);

  const pillsContainerRef = useRef<HTMLDivElement>(null);

  // Typewriter placeholder effect
  useEffect(() => {
    let pIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timeout: any;

    const tick = () => {
      const currentFull = placeholders[pIdx];
      if (!isDeleting) {
        setPlaceholderText(currentFull.slice(0, charIdx + 1));
        charIdx++;
        if (charIdx === currentFull.length) {
          isDeleting = true;
          timeout = setTimeout(tick, 2500);
          return;
        }
        timeout = setTimeout(tick, 45);
      } else {
        setPlaceholderText(currentFull.slice(0, charIdx - 1));
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          pIdx = (pIdx + 1) % placeholders.length;
          timeout = setTimeout(tick, 600);
          return;
        }
        timeout = setTimeout(tick, 20);
      }
    };

    timeout = setTimeout(tick, 500);
    return () => clearTimeout(timeout);
  }, []);

  // Tagline cycle effect
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
              <div className="relative isolate [&_textarea]:[box-shadow:none] [&_input]:[box-shadow:none] [&_button]:rounded-[100px] before:absolute before:-z-1 before:-inset-250 before:pointer-events-none before:rounded-8 before:blur-[50px] before:bg-[rgb(253_84_2_/_7.5%)] before:content-['']">
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

              {/* Category Output Pills & Arrow Scroll */}
              <div className="[html[data-slides-bias-hint]_&]:invisible">
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 -m-400">
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row justify-center items-center gap-300 flex-wrap pt-800">
                    <div className="flex box-border min-h-0 border-0 border-solid view-outline-none flex-row gap-(--useView--gap) justify-center items-center pb-(--useView--pb) min-w-0 max-w-full grow shrink basis-full" style={{ '--useView--gap': '8px', '--useView--pb': '32px', '--RequestedOutputsOptions--bleed': '0px' } as any}>
                      <button
                        data-ruic="IconButton"
                        type="button"
                        aria-label="Previous"
                        onClick={() => scrollPills('left')}
                        className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center w-(--icon-button-size) h-(--icon-button-size) rounded-6 text-color-default appearance-none border-0 border-solid border-transparent transition-background-color duration-snappy ease-snappy select-none cursor-pointer bg-surface hover:bg-[rgba(0,0,0,0.05)] border border-surface-border-regular z-1 -translate-y-250"
                        style={{ '--icon-button-size': '32px' } as any}
                      >
                        <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="Icon-module__wMmReq__icon" aria-hidden="true" style={{ '--Icon--size': '16px', '--Icon--rotate': '0deg', width: '16px', height: '16px' } as any}>
                          <path fillRule="evenodd" d="M4.47 11.47a.75.75 0 0 0 0 1.06l7 7a.75.75 0 1 0 1.06-1.06l-5.72-5.72H19a.75.75 0 0 0 0-1.5H6.81l5.72-5.72a.75.75 0 0 0-1.06-1.06z" clipRule="evenodd" />
                        </svg>
                      </button>

                      <div
                        ref={pillsContainerRef}
                        className="flex box-border min-h-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch min-w-0 shrink overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-auto snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden"
                        style={{ maxWidth: '496px' }}
                      >
                        <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start items-stretch shrink-0 flex-row w-max pb-500 gap-(--requested-output-option-gap)" style={{ '--requested-output-option-gap': '4px' } as any}>
                          {[
                            { id: 'website', label: 'Website' },
                            { id: 'mobile', label: 'Mobile' },
                            { id: 'slides', label: 'Slides' },
                            { id: 'animation', label: 'Animation' },
                            { id: 'data-vis', label: 'Data Visualization' },
                            { id: '3d-game', label: '3D Game' },
                            { id: 'document', label: 'Document' },
                            { id: 'spreadsheet', label: 'Spreadsheet' }
                          ].map((pill) => {
                            const isSel = activePill === pill.id;
                            return (
                              <div key={pill.id} className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 justify-center items-center w-2400 snap-start">
                                <button
                                  type="button"
                                  onClick={() => setActivePill(isSel ? null : pill.id)}
                                  className="flex box-border min-h-0 min-w-0 border-0 view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative m-0 size-1200 cursor-pointer border-none background-transparent p-0 font-inherit"
                                >
                                  <div
                                    className={`flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col shrink-0 h-full w-full items-center justify-center font-inherit transition-background duration-snappy ease-snappy text-color-default custom-pointer-capable:cursor-pointer interactive-radius-default border border-surface-border-regular _sdz_surface ${
                                      isSel ? 'bg-[#18191B] text-white' : 'bg-surface hover:bg-[rgba(0,0,0,0.04)]'
                                    }`}
                                    style={{ '--interactive2-border-radius': '16px' } as any}
                                  >
                                    <span className="block font-brand text-[13px] font-medium">{pill.label}</span>
                                  </div>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        data-ruic="IconButton"
                        type="button"
                        aria-label="Next"
                        onClick={() => scrollPills('right')}
                        className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center w-(--icon-button-size) h-(--icon-button-size) rounded-6 text-color-default appearance-none border-0 border-solid border-transparent transition-background-color duration-snappy ease-snappy select-none cursor-pointer bg-surface hover:bg-[rgba(0,0,0,0.05)] border border-surface-border-regular z-1 -translate-y-250"
                        style={{ '--icon-button-size': '32px' } as any}
                      >
                        <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="Icon-module__wMmReq__icon" aria-hidden="true" style={{ '--Icon--size': '16px', '--Icon--rotate': '0deg', width: '16px', height: '16px' } as any}>
                          <path fillRule="evenodd" d="M19.53 11.47a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 1 1-1.06-1.06l5.72-5.72H5a.75.75 0 0 1 0-1.5h12.19l-5.72-5.72a.75.75 0 0 1 1.06-1.06z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Suggested Prompts */}
                  <div className="_sdz_theme-text-input flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col items-center justify-center pt-200">
                    <span className="text-[#666d79] text-[12px] font-brand mb-200 tracking-[0.2px]">
                      Try an example prompt
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-200">
                      {[
                        'B2B project management app',
                        'SaaS KPI dashboard',
                        'Student budget tracker'
                      ].map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => setPromptText(prompt)}
                          className="px-300 py-150 rounded-[100px] border border-surface-border-regular bg-surface text-color-default text-[13px] font-brand hover:bg-[rgba(0,0,0,0.04)] transition-colors cursor-pointer"
                        >
                          {prompt}
                        </button>
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
  );
};

export default HeroPromptBuilder;
