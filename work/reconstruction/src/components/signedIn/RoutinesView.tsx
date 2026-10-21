import React from 'react';

export const RoutinesView: React.FC = () => {
  const sampleRoutines = [
    {
      title: 'Check my calendar each morning and tell me what to prepare for',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 16H5V10h14z" />
        </svg>
      ),
      isDimmed: false
    },
    {
      title: 'Go through my inbox every couple of days and pull out the emails that need a reply',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5-8-5V6l8 5 8-5z" />
        </svg>
      ),
      isDimmed: false
    },
    {
      title: 'Catch me up every Friday on the Slack messages I missed',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6 15a2 2 0 0 1-2-2 2 2 0 0 1 2-2h2v2a2 2 0 0 1-2 2m1 0a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5a2 2 0 0 1-2 2 2 2 0 0 1-2-2zm2-8a2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2v2zm0 1a2 2 0 0 1 2 2 2 2 0 0 1-2 2H4a2 2 0 0 1-2-2 2 2 0 0 1 2-2zm8 2a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-2v-2a2 2 0 0 1 2-2m-1 0a2 2 0 0 1-2 2 2 2 0 0 1-2-2V7a2 2 0 0 1 2-2 2 2 0 0 1 2 2zm-2 8a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2zm0-1a2 2 0 0 1-2-2 2 2 0 0 1 2-2h5a2 2 0 0 1 2 2 2 2 0 0 1-2 2z" />
        </svg>
      ),
      isDimmed: false
    },
    {
      title: 'Schedule a routine that ...',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2.75a9.25 9.25 0 1 0 0 18.5 9.25 9.25 0 0 0 0-18.5M1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12 17.937 22.75 12 22.75 1.25 17.937 1.25 12M12 6.25a.75.75 0 0 1 .75.75v4.932l3.666 2.444a.75.75 0 1 1-.832 1.248l-4-2.667a.75.75 0 0 1-.334-.624V7a.75.75 0 0 1 .75-.75" clipRule="evenodd" />
        </svg>
      ),
      isDimmed: true
    }
  ];

  return (
    <main
      id="main-content"
      className="relative flex flex-col shrink basis-0 min-h-0 grow max-tablet-min:overflow-x-hidden max-tablet-min:pt-(--AppLayout--header-height) z-1 overflow-y-auto"
    >
      <div className="box-border mx-auto w-full min-w-0 px-400 pt-[72px] tablet-min:px-2000 tablet-min:max-w-[1184px]">
        <div data-analytics-id="routines_page" className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 pb-800">
          
          {/* Header */}
          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-100">
            <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-200">
              <h1 className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-2xl font-medium wrap-break-word inline text-color-default">
                Routines
              </h1>
            </div>
            <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-sm wrap-break-word inline text-color-secondary">
              Run Replit on a schedule
            </span>
          </div>

          {/* Subheader */}
          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start shrink-0 items-logical-start gap-300 pt-800">
            <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-base font-medium wrap-break-word inline text-color-default">
              Put recurring work on autopilot
            </span>
            <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-sm wrap-break-word inline text-color-secondary">
              Upgrade to Replit Core to schedule Agent tasks that run for you, even when you're away.
            </span>
          </div>

          {/* Routine suggestion pills (4 authentic pills directly cited from routines_main_outer.html) */}
          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start shrink-0 items-logical-start gap-200 pt-400">
            {sampleRoutines.map((r, i) => (
              <button
                key={i}
                data-ruic="Button"
                data-analytics-id="routines_sample_upgrade_button"
                aria-label={r.title}
                type="button"
                className="text-color-default appearance-none border-0 border-solid border-transparent select-none shadow-control bg-surface inset-ring inset-ring-surface-border-regular _sdz_custom-hover:shades-up-2 _sdz_custom-pressed:shades-up-3 _sdz_switch-theme _sdz_theme-text-input flex min-w-0 basis-auto cursor-pointer flex-row items-center shrink self-auto justify-logical-start gap-50 px-200 max-w-full h-auto min-h-800 rounded-full [&_span]:whitespace-normal [&_span]:h-auto py-[10px]"
              >
                <span className="flex min-w-0 items-center gap-200 px-100 text-label-l-control">
                  <span className="min-w-0 grow truncate text-left">
                    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-200">
                      <span aria-hidden="true" className="inline-flex size-500 shrink-0 items-center justify-center text-(--foreground-dimmest)">
                        {r.icon}
                      </span>
                      <span className={`box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink text-sm wrap-break-word inline text-left ${
                        r.isDimmed ? 'text-color-tertiary' : 'text-color-default'
                      }`}>
                        {r.title}
                      </span>
                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-color-default">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7 7.75a.75.75 0 0 1 0-1.5h10a.75.75 0 0 1 .75.75v10a.75.75 0 0 1-1.5 0V8.81l-8.72 8.72a.75.75 0 0 1-1.06-1.06l8.72-8.72z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </span>
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
};
