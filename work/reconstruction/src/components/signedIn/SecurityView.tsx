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

            {/* Clean Status Banner */}
            <div className="flex box-border min-h-0 min-w-0 border-solid view-outline-none justify-logical-start grow shrink flex-row items-center gap-100 px-300 py-200 rounded-8 _sdz_theme-success _sdz_surface bg-surface border border-surface-border-regular _sdz_switch-theme">
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink flex-row items-logical-start gap-200 grow">
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col items-stretch shrink-0 justify-center h-[calc(var(--font-size-default)_*_var(--line-height-default))]">
                  <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="Icon-module__wMmReq__icon" style={{ width: '16px', height: '16px' }} aria-hidden="true">
                    <path d="M19.25 6a.25.25 0 0 0-.25-.25c-2.24 0-4.895-1.3-6.727-2.9a.42.42 0 0 0-.546 0C10.02 4.34 7.57 5.585 5.426 5.735L5 5.75a.25.25 0 0 0-.25.25v7c0 2.301.797 3.99 2.058 5.28 1.12 1.15 2.636 2.01 4.357 2.677l.75.274.017.006.084.016a.3.3 0 0 0 .08-.013c2.025-.706 3.818-1.644 5.097-2.957C18.453 16.99 19.25 15.3 19.25 13zm1.5 7c0 2.698-.954 4.76-2.483 6.33-1.51 1.548-3.547 2.584-5.68 3.328l-.006.003a1.75 1.75 0 0 1-1.156-.013c-2.14-.739-4.18-1.772-5.69-3.32C4.202 17.76 3.25 15.699 3.25 13V6A1.75 1.75 0 0 1 5 4.25l.336-.012c1.71-.125 3.856-1.165 5.41-2.523l.007-.005.135-.105a1.92 1.92 0 0 1 2.224 0l.135.105.007.005.32.269C15.207 3.304 17.351 4.25 19 4.25A1.75 1.75 0 0 1 20.75 6z" />
                    <path d="M14.526 9.418a.75.75 0 0 1 1.056 1.056l-.052.056-4 4a.75.75 0 0 1-1.06 0l-2-2-.052-.056a.75.75 0 0 1 1.056-1.056l.056.052L11 12.94l3.47-3.47z" />
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

            {/* Filter and Dropdowns Row */}
            <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-200">
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-400 flex-wrap">
                {/* Search Input */}
                <div className="flex box-border min-h-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 max-w-8000 min-w-[280px]">
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch relative shrink">
                    <input
                      data-ruic="Input"
                      placeholder="Search by project name or CVE"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="cursor-text outline-none text-color-default placeholder:text-(--foreground-dimmest) shadow-interactive-input bg-surface border border-surface-border-strong rounded-6 px-250 py-200 text-[14px] leading-[1.2] h-800 pr-800 _sdz_switch-theme _sdz_theme-text-input min-h-800 w-full"
                    />
                    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 pointer-events-none absolute right-0 top-0 h-full items-center justify-center p-200">
                      <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ width: '16px', height: '16px' }}>
                        <path fillRule="evenodd" d="M11 2.25a8.75 8.75 0 0 1 6.693 14.383l3.837 3.837a.75.75 0 0 1-1.06 1.06l-3.837-3.837A8.75 8.75 0 1 1 11 2.25m0 1.5a7.25 7.25 0 1 0 0 14.5 7.25 7.25 0 0 0 0-14.5" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Dropdown 1: Severity level */}
                <button
                  type="button"
                  data-ruic="MultiSelectDropdown"
                  aria-label="Severity level"
                  className="relative max-w-full text-color-default appearance-none border-0 border-solid border-transparent shadow-control bg-surface inset-ring inset-ring-surface-border-strong flex min-w-0 basis-auto cursor-pointer flex-row items-center shrink-0 self-auto justify-center h-800 gap-50 rounded-6 px-200 min-h-600"
                >
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink flex-row items-center gap-100">
                    <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs wrap-break-word inline text-color-default">
                      Severity level
                    </span>
                  </div>
                  <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ width: '16px', height: '16px' }}>
                    <path fillRule="evenodd" d="M12.53 15.53a.75.75 0 0 1-1.06 0l-6-6a.75.75 0 0 1 1.06-1.06L12 13.94l5.47-5.47a.75.75 0 1 1 1.06 1.06z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Dropdown 2: Publishing status */}
                <button
                  type="button"
                  data-ruic="MultiSelectDropdown"
                  aria-label="Publishing status"
                  className="relative max-w-full text-color-default appearance-none border-0 border-solid border-transparent shadow-control bg-surface inset-ring inset-ring-surface-border-strong flex min-w-0 basis-auto cursor-pointer flex-row items-center shrink-0 self-auto justify-center h-800 gap-50 rounded-6 px-200 min-h-600"
                >
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink flex-row items-center gap-100">
                    <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs wrap-break-word inline text-color-default">
                      Publishing status
                    </span>
                  </div>
                  <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ width: '16px', height: '16px' }}>
                    <path fillRule="evenodd" d="M12.53 15.53a.75.75 0 0 1-1.06 0l-6-6a.75.75 0 0 1 1.06-1.06L12 13.94l5.47-5.47a.75.75 0 1 1 1.06 1.06z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Dropdown 3: Publish visibility */}
                <button
                  type="button"
                  data-ruic="MultiSelectDropdown"
                  aria-label="Publish visibility"
                  className="relative max-w-full text-color-default appearance-none border-0 border-solid border-transparent shadow-control bg-surface inset-ring inset-ring-surface-border-strong flex min-w-0 basis-auto cursor-pointer flex-row items-center shrink-0 self-auto justify-center h-800 gap-50 rounded-6 px-200 min-h-600"
                >
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink flex-row items-center gap-100">
                    <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs wrap-break-word inline text-color-default">
                      Publish visibility
                    </span>
                  </div>
                  <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ width: '16px', height: '16px' }}>
                    <path fillRule="evenodd" d="M12.53 15.53a.75.75 0 0 1-1.06 0l-6-6a.75.75 0 0 1 1.06-1.06L12 13.94l5.47-5.47a.75.75 0 1 1 1.06 1.06z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Status Row */}
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-row gap-[8px] justify-between items-center shrink-0 flex-wrap pt-[16px] _sdz_surface-2">
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-200 flex-wrap">
                  <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs wrap-break-word inline text-color-secondary">
                    Showing 0 projects
                  </span>
                </div>
              </div>

              {/* Vulnerabilities Table */}
              <div className="flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col justify-logical-start items-stretch relative grow shrink overflow-y-auto scrollbar-thin rounded-8 _sdz_surface-2 border border-surface-border-regular">
                <div className="react-aria-ResizableTableContainer">
                  <table data-ruic="Table" className="max-w-full min-w-full outline-none border-spacing-px self-logical-start border-spacing-x-0 border-spacing-y-px" style={{ tableLayout: 'fixed' }}>
                    <thead className="text-left text-(--foreground-dimmer) sticky top-0 z-1 [&_tr_th]:font-normal [&_tr_th]:h-[34px] [&_tr_th]:text-[12px] _sdz_surface bg-surface">
                      <tr role="row">
                        <th className="text-left items-center whitespace-nowrap break-word px-300 py-150" style={{ width: '200px' }}>Project</th>
                        <th className="text-left items-center whitespace-nowrap break-word px-300 py-150" style={{ width: '230px' }}>Vulnerabilities</th>
                        <th className="text-left items-center whitespace-nowrap break-word px-300 py-150" style={{ width: '150px' }}>Project owner</th>
                        <th className="text-left items-center whitespace-nowrap break-word px-300 py-150" style={{ width: '150px' }}>Published</th>
                        <th className="text-left items-center whitespace-nowrap break-word px-300 py-150" style={{ width: '150px' }}>Status</th>
                        <th className="text-left items-center whitespace-nowrap break-word px-300 py-150" style={{ width: '200px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="max-h-full">
                      <tr role="row">
                        <td colSpan={6}>
                          <div className="flex box-border min-w-0 border-0 border-solid view-outline-none flex-col gap-[12px] justify-center items-center shrink-0 text-center py-800 min-h-[200px]">
                            <div className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 block text-(--foreground-dimmer)">
                              <svg width="124" height="83" viewBox="0 0 124 83" fill="none" aria-hidden="true" className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 block text-(--accent-positive-default)">
                                <g className="transform-view origin-[62.5px_41.5px]">
                                  <rect x="0.5" y="0.5" width="123" height="82" rx="5.5" className="stroke-current fill-(--background-root) [stroke-opacity:0.2]" />
                                  <path d="M1.5 6C1.5 3.23858 3.73858 1 6.5 1H118C120.761 1 123 3.23858 123 6V11H1.5V6Z" className="fill-current [fill-opacity:0.12]" />
                                  <rect x="18.5" y="20" width="88" height="5" rx="2.5" className="fill-current [fill-opacity:0.12]" />
                                  <rect x="18.5" y="29" width="88" height="5" rx="2.5" className="fill-current [fill-opacity:0.12]" />
                                  <rect x="18.5" y="38" width="88" height="5" rx="2.5" className="fill-current [fill-opacity:0.12]" />
                                  <rect x="18.5" y="47" width="88" height="5" rx="2.5" className="fill-current [fill-opacity:0.12]" />
                                </g>
                                <g className="transform-view origin-[62.5px_41.5px]">
                                  <rect x="46" y="24.5" width="33" height="34" rx="7.5" className="stroke-current fill-(--background-root) [stroke-opacity:0.2]" />
                                </g>
                                <path d="M69.75 35C69.7499 34.9339 69.7235 34.87 69.6768 34.8232C69.6299 34.7765 69.5662 34.75 69.5 34.75C67.2602 34.75 64.6051 33.4498 62.7725 31.8496C62.6964 31.7848 62.5999 31.75 62.5 31.75C62.4001 31.75 62.3036 31.7857 62.2275 31.8506C60.5195 33.3406 58.0702 34.5855 55.9248 34.7354L55.5 34.75C55.4338 34.75 55.3701 34.7765 55.3232 34.8232C55.2765 34.87 55.2501 34.9339 55.25 35V42C55.25 44.3018 56.0467 45.9898 57.3076 47.2812C58.4289 48.4296 59.9435 49.2901 61.665 49.957L62.415 50.2314L62.4316 50.2373L62.5156 50.2529C62.543 50.2533 62.5703 50.2489 62.5967 50.2402C64.6215 49.5341 66.4135 48.5963 67.6934 47.2832C68.9535 45.9902 69.75 44.3018 69.75 42V35ZM71.25 42C71.25 44.6981 70.2964 46.7606 68.7666 48.3301C67.2573 49.8785 65.2204 50.9145 63.0869 51.6582L63.0811 51.6611C62.7053 51.7885 62.2976 51.7831 61.9248 51.6484C59.7857 50.9097 57.7453 49.8766 56.2344 48.3291C54.7031 46.7606 53.75 44.6979 53.75 42V35C53.7501 34.536 53.9346 34.0908 54.2627 33.7627C54.5909 33.4346 55.036 33.25 55.5 33.25L55.8359 33.2383C57.546 33.1136 59.6919 32.0734 61.2461 30.7158L61.2529 30.71L61.3877 30.6055C61.7115 30.3752 62.0999 30.25 62.5 30.25C62.9001 30.25 63.2885 30.3752 63.6123 30.6055L63.7471 30.71L63.7539 30.7158L64.0732 30.9844C65.7084 32.3038 67.8519 33.25 69.5 33.25C69.964 33.25 70.4091 33.4346 70.7373 33.7627C71.0654 34.0908 71.2499 34.536 71.25 35V42Z" className="fill-current transform-view origin-[62.5px_41.5px]" />
                                <path d="M59.7 41.4L61.5 43L65.7 38.8" strokeWidth="1.6" className="fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round]" />
                              </svg>
                            </div>
                            <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 justify-center items-center gap-100">
                              <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-base font-medium wrap-break-word inline text-color-default text-center">
                                Your workspace is secure
                              </span>
                              <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-sm wrap-break-word inline text-color-tertiary max-w-[48ch]">
                                No project dependency vulnerabilities found.
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </main>
  );
};
