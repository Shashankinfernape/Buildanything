import React, { useState } from 'react';
import { ProjectItem } from '../../fixtures/signedInFixtures';

interface ProjectsListProps {
  projects: ProjectItem[];
  onOpenProject: (projectId: string) => void;
  onDeleteProject?: (projectId: string) => void;
  onOpenCreate?: () => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  onOpenProject
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'assets'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Any status');
  const [artifactFilter, setArtifactFilter] = useState('Any artifact type');
  const [ownershipFilter, setOwnershipFilter] = useState('All projects');

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main
      id="main-content"
      className="relative flex flex-col shrink basis-0 min-h-0 grow max-tablet-min:overflow-x-hidden max-tablet-min:pt-(--AppLayout--header-height) z-1 overflow-y-auto"
    >
      <div className="box-border mx-auto w-full min-w-0 px-400 pt-[72px] tablet-min:px-2000 tablet-min:max-w-[1184px]">
        
        {/* TABS CONTAINER */}
        <div data-ruic="Tabs" data-analytics-id="things_section" className="react-aria-Tabs">
          <div style={{ border: 0, clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', height: '1px', margin: '-1px', overflow: 'hidden', padding: 0, position: 'absolute', width: '1px', whiteSpace: 'nowrap' }}>
            <h1 className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-sm font-medium wrap-break-word inline text-color-default">
              Projects
            </h1>
          </div>

          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-400">
            <h2 className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-2xl font-medium wrap-break-word inline text-color-default">
              Library
            </h2>

            {/* TAB LIST */}
            <div
              data-ruic="TabList"
              aria-label="Library"
              role="tablist"
              aria-orientation="horizontal"
              className="flex grow-0 flex-row items-stretch pb-px shadow-[inset_0_-1px_0_var(--outline-dimmest)]"
            >
              {/* Tab 1: Projects */}
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'projects'}
                onClick={() => setActiveTab('projects')}
                className={`relative flex flex-row items-center gap-200 cursor-pointer mx-0 mt-0 -mb-px border-x-0 border-t-0 border-b border-solid rounded-t-6 rounded-b-none px-200 pt-200 select-none font-inherit transition-background duration-snappy ease-snappy bg-transparent ${
                  activeTab === 'projects'
                    ? 'text-(--foreground-default) border-b-(--foreground-default) pb-[7px]'
                    : 'text-(--foreground-dimmer) border-b-transparent pb-[7px] hover:text-(--foreground-default)'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M8.927 8.054a2.334 2.334 0 0 1 2.858-1.65l9.416 2.523a2.334 2.334 0 0 1 1.65 2.858l-2.523 9.416a2.334 2.334 0 0 1-2.858 1.65l-9.416-2.523a2.334 2.334 0 0 1-1.65-2.858zm2.491-.28a.915.915 0 0 0-1.121.647l-2.524 9.416c-.13.488.16.99.648 1.121l9.416 2.523c.488.131.99-.159 1.121-.647l2.523-9.416a.916.916 0 0 0-.647-1.121z" clipRule="evenodd" />
                  <path d="M13.232 1.15a2.334 2.334 0 0 1 2.334 2.334V4.89a.71.71 0 0 1-1.418 0V3.484a.916.916 0 0 0-.916-.916H3.484a.916.916 0 0 0-.916.916v9.748c0 .506.41.916.916.916H4.89a.71.71 0 1 1 0 1.418H3.484a2.334 2.334 0 0 1-2.334-2.334V3.484A2.334 2.334 0 0 1 3.484 1.15z" />
                </svg>
                <span className="inline-block leading-none text-sm font-normal">Projects</span>
              </button>

              {/* Tab 2: Assets */}
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'assets'}
                onClick={() => setActiveTab('assets')}
                className={`relative flex flex-row items-center gap-200 cursor-pointer mx-0 mt-0 -mb-px border-x-0 border-t-0 border-b border-solid rounded-t-6 rounded-b-none px-200 pt-200 select-none font-inherit transition-background duration-snappy ease-snappy bg-transparent ${
                  activeTab === 'assets'
                    ? 'text-(--foreground-default) border-b-(--foreground-default) pb-[7px]'
                    : 'text-(--foreground-dimmer) border-b-transparent pb-[7px] hover:text-(--foreground-default)'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="m14 1.25.038.001a3.15 3.15 0 0 1 2.196.925l3.586 3.586A3.16 3.16 0 0 1 20.75 8v12A2.75 2.75 0 0 1 18 22.75H6A2.75 2.75 0 0 1 3.25 20V4A2.75 2.75 0 0 1 6 1.25zm-8 1.5A1.25 1.25 0 0 0 4.75 4v16A1.25 1.25 0 0 0 6 21.25h12A1.25 1.25 0 0 0 19.25 20V8.75H15A1.75 1.75 0 0 1 13.25 7V2.75zM14.75 7a.25.25 0 0 0 .25.25h4.07a1.7 1.7 0 0 0-.306-.424l-3.591-3.59a1.7 1.7 0 0 0-.423-.306z" clipRule="evenodd" />
                </svg>
                <span className="inline-block leading-none text-sm font-normal">Assets</span>
              </button>
            </div>
          </div>

          {/* TABPANEL CONTENT */}
          {activeTab === 'projects' ? (
            <div role="tabpanel" className="focus-visible:outline-2 focus-visible:outline-solid">
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0" style={{ paddingTop: '32px' }}>
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0">
                  
                  {/* FILTERS TOOLBAR */}
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row justify-between items-center gap-200 flex-wrap pb-400 max-tablet-min:flex-col max-tablet-min:items-stretch">
                    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-200 flex-wrap">
                      
                      {/* Search Input */}
                      <div className="flex box-border min-h-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 grow min-w-3200 max-w-full max-tablet-min:basis-full">
                        <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch relative shrink">
                          <input
                            data-ruic="Input"
                            placeholder="Search"
                            aria-label="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="cursor-text outline-none text-color-default placeholder:text-(--foreground-dimmest) shadow-interactive-input bg-surface border border-surface-border-strong rounded-6 px-250 py-200 text-[14px] leading-[1.2] h-800 pr-800 _sdz_theme-text-input _sdz_switch-theme"
                            style={{ minHeight: '32px', height: '32px' }}
                          />
                          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 pointer-events-none absolute right-0 top-0 h-full items-center justify-center p-200">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path fillRule="evenodd" d="M11 2.25a8.75 8.75 0 0 1 6.693 14.383l3.837 3.837a.75.75 0 0 1-1.06 1.06l-3.837-3.837A8.75 8.75 0 1 1 11 2.25m0 1.5a7.25 7.25 0 1 0 0 14.5 7.25 7.25 0 0 0 0-14.5" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Filter 1: Status */}
                      <button
                        type="button"
                        className="text-color-default appearance-none border-0 border-solid border-transparent select-none bg-surface _sdz_custom-hover:shades-up-2 flex min-h-0 min-w-0 basis-auto cursor-pointer flex-row items-center shrink-0 justify-between h-800 gap-50 rounded-6 px-200"
                        style={{ minWidth: '128px', height: '32px' }}
                      >
                        <span className="flex min-w-0 items-center gap-200 grow justify-between px-100 text-label-l-control">
                          <span className="min-w-0 grow truncate text-left text-xs font-normal">{statusFilter}</span>
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M12.53 15.53a.75.75 0 0 1-1.06 0l-6-6a.75.75 0 0 1 1.06-1.06L12 13.94l5.47-5.47a.75.75 0 1 1 1.06 1.06z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {/* Filter 2: Artifact Type */}
                      <button
                        type="button"
                        className="text-color-default appearance-none border-0 border-solid border-transparent select-none bg-surface _sdz_custom-hover:shades-up-2 flex min-h-0 min-w-0 basis-auto cursor-pointer flex-row items-center shrink-0 justify-between h-800 gap-50 rounded-6 px-200"
                        style={{ minWidth: '128px', height: '32px' }}
                      >
                        <span className="flex min-w-0 items-center gap-200 grow justify-between px-100 text-label-l-control">
                          <span className="min-w-0 grow truncate text-left text-xs font-normal">{artifactFilter}</span>
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M12.53 15.53a.75.75 0 0 1-1.06 0l-6-6a.75.75 0 0 1 1.06-1.06L12 13.94l5.47-5.47a.75.75 0 1 1 1.06 1.06z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {/* Filter 3: Ownership */}
                      <button
                        type="button"
                        className="text-color-default appearance-none border-0 border-solid border-transparent select-none bg-surface _sdz_custom-hover:shades-up-2 flex min-h-0 min-w-0 basis-auto cursor-pointer flex-row items-center shrink-0 justify-between h-800 gap-50 rounded-6 px-200"
                        style={{ minWidth: '128px', height: '32px' }}
                      >
                        <span className="flex min-w-0 items-center gap-200 grow justify-between px-100 text-label-l-control">
                          <span className="min-w-0 grow truncate text-left text-xs font-normal">{ownershipFilter}</span>
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M12.53 15.53a.75.75 0 0 1-1.06 0l-6-6a.75.75 0 0 1 1.06-1.06L12 13.94l5.47-5.47a.75.75 0 1 1 1.06 1.06z" clipRule="evenodd" />
                        </svg>
                      </button>

                    </div>
                  </div>

                  {/* PROJECT CARDS GRID */}
                  <ol className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 grid gap-400 grid-cols-[repeat(auto-fill,minmax(var(--space-256),1fr))] list-none p-0 m-0">
                    {filteredProjects.map((p) => (
                      <li
                        key={p.id}
                        data-react-aria-pressable="true"
                        onClick={() => onOpenProject(p.id)}
                        className="flex box-border min-h-0 min-w-0 view-outline-none flex-col justify-logical-start items-stretch shrink-0 group/repl-card relative overflow-hidden rounded-12 text-color-default appearance-none border-solid transition-background-color duration-snappy ease-snappy bg-surface _sdz_surface _sdz_custom-hover:shades-up-2 border border-surface-border-regular select-text cursor-pointer"
                        style={{ borderRadius: '12px' }}
                      >
                        {/* Top Thumbnail Preview */}
                        <div className="flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative bg-center bg-cover bg-no-repeat aspect-video _sdz_surface bg-surface border-b border-surface-border-regular">
                          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 justify-center items-center absolute inset-0 overflow-hidden">
                            <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-center items-center shrink-0 relative overflow-hidden rounded-8 _sdz_surface bg-surface border border-[#3E3E41]" style={{ width: '64px', height: '64px' }}>
                              <span className="text-2xl">{p.icon || '🐍'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Info & Actions */}
                        <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start grow shrink flex-row gap-300 items-center p-300">
                          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch gap-50 grow shrink">
                            
                            <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row justify-between items-center">
                              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch grow shrink">
                                <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-sm max-w-full text-ellipsis whitespace-nowrap wrap-break-word inline-block overflow-hidden text-color-default font-normal">
                                  {p.title}
                                </span>
                              </div>

                              {/* Hover Action Buttons */}
                              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-100 relative z-3 invisible w-0 overflow-hidden group-hover/repl-card:visible group-hover/repl-card:ml-200 group-hover/repl-card:w-auto group-hover/repl-card:overflow-visible">
                                <button
                                  type="button"
                                  aria-label="Copy link"
                                  onClick={(e) => { e.stopPropagation(); }}
                                  className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center rounded-6 text-color-default appearance-none border-0 select-none cursor-pointer bg-surface hover:shades-up-2 p-0"
                                  style={{ width: '24px', height: '24px' }}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 7.75a4.25 4.25 0 0 0 0 8.5h3a.75.75 0 0 1 0 1.5H6a5.75 5.75 0 1 1 0-11.5h3a.75.75 0 0 1 0 1.5zM14.25 7a.75.75 0 0 1 .75-.75h3a5.75 5.75 0 1 1 0 11.5h-3a.75.75 0 0 1 0-1.5h3a4.25 4.25 0 1 0 0-8.5h-3a.75.75 0 0 1-.75-.75m-7 5a.75.75 0 0 1 .75-.75h8a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  aria-label="App Actions"
                                  onClick={(e) => { e.stopPropagation(); }}
                                  className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center rounded-6 text-color-default appearance-none border-0 select-none cursor-pointer bg-surface hover:shades-up-2 p-0"
                                  style={{ width: '24px', height: '24px' }}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.25 5a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0m0 7a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0m0 7a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Sub-row: Lock Icon & Timestamp */}
                            <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-100 text-(--foreground-dimmer)">
                              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative z-3">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                  <path fillRule="evenodd" d="M12 1.25A5.75 5.75 0 0 1 17.75 7v3.25H19A2.75 2.75 0 0 1 21.75 13v7A2.75 2.75 0 0 1 19 22.75H5A2.75 2.75 0 0 1 2.25 20v-7A2.75 2.75 0 0 1 5 10.25h1.25V7A5.75 5.75 0 0 1 12 1.25m-7 10.5c-.69 0-1.25.56-1.25 1.25v7c0 .69.56 1.25 1.25 1.25h14c.69 0 1.25-.56 1.25-1.25v-7c0-.69-.56-1.25-1.25-1.25zm7-9A4.25 4.25 0 0 0 7.75 7v3.25h8.5V7A4.25 4.25 0 0 0 12 2.75" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs text-color-tertiary">·</span>
                              <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch text-xs text-color-tertiary shrink-0 whitespace-nowrap">
                                6 months ago
                              </span>
                            </div>

                          </div>
                        </div>

                      </li>
                    ))}
                  </ol>

                </div>
              </div>
            </div>
          ) : (
            /* ASSETS EMPTY TAB */
            <div role="tabpanel" className="pt-[48px] text-center text-color-tertiary text-sm">
              <p>No uploaded assets found.</p>
            </div>
          )}

        </div>

      </div>
    </main>
  );
};
