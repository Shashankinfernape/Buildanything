import React from 'react';

export const RoutinesView: React.FC = () => {
  const sampleRoutines = [
    {
      title: 'Check my calendar each morning and tell me what to prepare for',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 16H5V10h14z" />
        </svg>
      )
    },
    {
      title: 'Audit my code for security issues every week',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
        </svg>
      )
    },
    {
      title: 'Summarize unread emails and draft responses',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5-8-5V6l8 5 8-5z" />
        </svg>
      )
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
            <h1 className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-2xl font-medium wrap-break-word inline text-color-default">
              Routines
            </h1>
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

          {/* Routine suggestion pills */}
          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start shrink-0 items-logical-start gap-200 pt-400">
            {sampleRoutines.map((r, i) => (
              <button
                key={i}
                type="button"
                className="text-color-default appearance-none border-0 border-solid border-transparent select-none bg-surface shadow-control inset-ring inset-ring-surface-border-regular _sdz_custom-hover:shades-up-2 flex min-w-0 basis-auto cursor-pointer flex-row items-center shrink self-auto justify-logical-start gap-50 px-200 max-w-full h-auto min-h-800 rounded-full py-150"
              >
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-200">
                  <span aria-hidden="true" className="inline-flex size-500 shrink-0 items-center justify-center text-[#9CA3AF]">
                    {r.icon}
                  </span>
                  <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch text-sm wrap-break-word inline text-left text-color-default">
                    {r.title}
                  </span>
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
};
