import fs from 'fs';

const heroHtml = fs.readFileSync('work/analysis/section2-hero-snapshot.html', 'utf8');

// We turn this exact ground-truth HTML into a fully interactive React component HeroPromptBuilder.tsx
const tsx = `import React, { useState, useEffect, useRef } from 'react';

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
    let timeout: NodeJS.Timeout;

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

          {/* Interactive Agent Input Box */}
          <div className="my-0 mx-auto w-full max-w-[650px] [&_textarea]:max-h-[200px]">
            <div className="w-full max-w-[800px]" data-agent-input2-root="">
              <div className="relative isolate [&_textarea]:[box-shadow:none] [&_input]:[box-shadow:none] [&_button]:rounded-[100px] before:absolute before:-z-1 before:-inset-250 before:pointer-events-none before:rounded-8 before:blur-[50px] before:bg-[rgb(253_84_2_/_7.5%)] before:content-['']">
                <div className="_sdz_theme-text-input">
                  <div
                    className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative transition-[border-color,box-shadow,background-color] duration-snappy ease-snappy [background-color:var(--text-input-surface-color-900)] [border-radius:20px] [box-shadow:0_4px_16px_rgb(0_0_0_/_6%)]"
                    style={{
                      border: '1px solid #e2e2e2'
                    }}
                  >
                    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 pt-[12px] pr-[12px] pb-[48px] pl-[12px]">
                      <textarea
                        data-ruic="MultiLineInput"
                        placeholder={placeholderText}
                        rows={1}
                        value={promptText}
                        onChange={(e) => setPromptText(e.target.value)}
                        className="cursor-text [outline:0_none] font-inherit transition-background duration-snappy ease-snappy bg-transparent border-none py-200 box-border min-w-0 max-w-full w-full resize-none px-150 pt-150 pb-0 text-(--foreground-default) placeholder:text-(--foreground-dimmest) [&:focus]:view-outline-none"
                        style={{
                          overflow: 'hidden',
                          overflowWrap: 'break-word',
                          textAlign: 'start',
                          height: '36px',
                          fontSize: '15px',
                          color: '#040404'
                        }}
                      />
                    </div>

                    {/* Bottom toolbar inside input box */}
                    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row justify-between items-logical-end px-200 absolute bottom-200 left-0 w-full h-0">
                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-200">
                        <button
                          data-ruic="IconButton"
                          type="button"
                          aria-label="Add attachment"
                          className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center rounded-6 cursor-pointer bg-surface hover:bg-[rgba(0,0,0,0.05)] transition-colors"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.25a.75.75 0 0 1 .75.75v6.25H19a.75.75 0 0 1 0 1.5h-6.25V19a.75.75 0 0 1-1.5 0v-6.25H5a.75.75 0 0 1 0-1.5h6.25V5a.75.75 0 0 1 .75-.75" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-row justify-logical-start items-center grow-0 basis-auto shrink" style={{ gap: '8px' }}>
                        <button
                          type="button"
                          data-cy="ai-prompt-submit"
                          disabled={!promptText.trim()}
                          onClick={() => {
                            if (promptText.trim()) {
                              alert(\`Starting agent with: "\${promptText}"\`);
                            }
                          }}
                          className={\`flex h-800 cursor-pointer items-center justify-center text-center font-brand font-regular not-italic border-0 p-200 rounded-[100px] text-[14px] transition-all \${
                            promptText.trim()
                              ? 'bg-[#ff3c00] text-white hover:opacity-90 w-auto px-400 gap-100'
                              : 'bg-[#ff3c00] text-white opacity-40 cursor-default w-800'
                          }\`}
                        >
                          {promptText.trim() && <span className="inline-block whitespace-nowrap">Start</span>}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M19.53 11.47a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 1 1-1.06-1.06l5.72-5.72H5a.75.75 0 0 1 0-1.5h12.19l-5.72-5.72a.75.75 0 0 1 1.06-1.06z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Output Pills & Arrow Scroll */}
              <div className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 -m-400 mt-400">
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row justify-center items-center gap-300 flex-wrap pt-800">
                  <div className="flex box-border min-h-0 border-0 border-solid view-outline-none flex-row justify-center items-center pb-500 min-w-0 max-w-full grow shrink basis-full" style={{ gap: '8px' }}>
                    <button
                      type="button"
                      aria-label="Previous"
                      onClick={() => scrollPills('left')}
                      className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center rounded-6 cursor-pointer bg-surface hover:bg-[rgba(0,0,0,0.05)] border border-surface-border-regular z-1 -translate-y-250 transition-colors"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M4.47 11.47a.75.75 0 0 0 0 1.06l7 7a.75.75 0 1 0 1.06-1.06l-5.72-5.72H19a.75.75 0 0 0 0-1.5H6.81l5.72-5.72a.75.75 0 0 0-1.06-1.06z" clipRule="evenodd" />
                      </svg>
                    </button>

                    <div
                      ref={pillsContainerRef}
                      className="flex box-border min-h-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch min-w-0 shrink overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-auto snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden"
                      style={{ maxWidth: '496px' }}
                    >
                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start items-stretch shrink-0 flex-row w-max pb-500 gap-[6px]">
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
                            <button
                              key={pill.id}
                              type="button"
                              onClick={() => setActivePill(isSel ? null : pill.id)}
                              className={\`flex items-center justify-center px-300 py-150 rounded-[100px] text-[13px] font-brand transition-all cursor-pointer border \${
                                isSel
                                  ? 'bg-[#040404] text-white border-transparent'
                                  : 'bg-white text-[#040404] border-[#e2e2e2] hover:bg-[#f6f5f4]'
                              }\`}
                            >
                              <span>{pill.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Next"
                      onClick={() => scrollPills('right')}
                      className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center rounded-6 cursor-pointer bg-surface hover:bg-[rgba(0,0,0,0.05)] border border-surface-border-regular z-1 -translate-y-250 transition-colors"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M19.53 11.47a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 1 1-1.06-1.06l5.72-5.72H5a.75.75 0 0 1 0-1.5h12.19l-5.72-5.72a.75.75 0 0 1 1.06-1.06z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Example Suggested Prompts */}
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col items-center justify-center pt-200">
                  <span className="text-[#666d79] text-[12px] font-brand mb-200 tracking-[0.2px]">
                    Try an example prompt
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-200">
                    {[
                      'B2B project management app',
                      'SaaS KPI dashboard',
                      'Student budget tracker'
                    ].map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => setPromptText(example)}
                        className="px-300 py-150 rounded-[100px] border border-[#e2e2e2] bg-white text-[#040404] text-[13px] font-brand hover:bg-[#f6f5f4] transition-colors cursor-pointer"
                      >
                        {example}
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
  );
};

export default HeroPromptBuilder;
`;

fs.writeFileSync('work/reconstruction/src/components/HeroPromptBuilder.tsx', tsx, 'utf8');
console.log('HeroPromptBuilder.tsx written successfully!');
