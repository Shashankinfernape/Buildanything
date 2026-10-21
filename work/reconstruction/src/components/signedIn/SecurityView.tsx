import React, { useState } from 'react';

export const SecurityView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main
      id="main-content"
      className="relative flex flex-col shrink basis-0 min-h-0 grow max-tablet-min:overflow-x-hidden max-tablet-min:pt-(--AppLayout--header-height) z-1 overflow-y-auto"
    >
      <div className="box-border mx-auto w-full min-w-0 px-400 pt-[72px] tablet-min:px-2000 tablet-min:max-w-[1184px]">
        <div data-analytics-id="security_page" data-analytics-product-area="security" className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-100 pb-800">
          
          {/* Header */}
          <h1 className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-2xl font-medium wrap-break-word inline text-color-default">
            Security
          </h1>

          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-600">
            
            {/* Description */}
            <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row justify-between items-logical-start gap-200">
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch gap-100 grow shrink">
                <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-sm wrap-break-word text-color-secondary inline-block max-w-[640px]">
                  Dependency scans run automatically, multiple times a day and catch security issues with third party packages in your project. Results from Security Agent scans are not included here.
                </span>
              </div>
            </div>

            {/* Clean Status Box */}
            <div className="flex box-border min-h-0 min-w-0 border-solid view-outline-none justify-logical-start grow shrink flex-row items-center gap-100 px-300 py-200 rounded-8 _sdz_theme-success _sdz_surface bg-surface border border-surface-border-regular _sdz_switch-theme">
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink flex-row items-logical-start gap-200 grow">
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col items-stretch shrink-0 justify-center h-full text-green-500">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9z" />
                  </svg>
                </div>
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink grow">
                  <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-sm wrap-break-word inline text-color-default font-bold">
                    No vulnerabilities detected
                  </span>
                  <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs wrap-break-word inline text-color-default">
                    Your workspace is clean. No security findings were found.
                  </span>
                </div>
              </div>
            </div>

            {/* Search Input Filter */}
            <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-200">
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-400 flex-wrap">
                <div className="flex box-border min-h-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 max-w-8000 min-w-[280px]">
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch relative shrink">
                    <input
                      data-ruic="Input"
                      placeholder="Search by project name or CVE..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="cursor-text outline-none text-color-default placeholder:text-(--foreground-dimmest) shadow-interactive-input bg-surface border border-surface-border-strong rounded-6 px-250 py-200 text-[14px] leading-[1.2] h-800 pr-800 _sdz_theme-text-input _sdz_switch-theme w-full"
                      style={{ height: '32px' }}
                    />
                    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 pointer-events-none absolute right-0 top-0 h-full items-center justify-center p-200">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M11 2.25a8.75 8.75 0 0 1 6.693 14.383l3.837 3.837a.75.75 0 0 1-1.06 1.06l-3.837-3.837A8.75 8.75 0 1 1 11 2.25m0 1.5a7.25 7.25 0 1 0 0 14.5 7.25 7.25 0 0 0 0-14.5" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
};
