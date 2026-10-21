import React, { useState } from 'react';
import { ProjectItem, UserProfile } from '../../fixtures/signedInFixtures';

interface GlobalSidebarProps {
  currentScreen?: string;
  onNavigate?: (screen: string) => void;
  projects: ProjectItem[];
  user: UserProfile;
  onOpenCreate?: () => void;
  onOpenSettings?: () => void;
  activeProjectId?: string;
  onSelectProject?: (id: string) => void;
}

export const GlobalSidebar: React.FC<GlobalSidebarProps> = ({
  currentScreen = 'home',
  onNavigate,
  projects,
  user,
  onOpenCreate,
  onOpenSettings,
  activeProjectId,
  onSelectProject
}) => {
  const [isRecentCollapsed, setIsRecentCollapsed] = useState(false);

  // 4 authentic recent projects
  const recentList = [
    { id: 'proj_vision', title: 'VisionMart' },
    { id: 'proj_pet', title: 'PetCareConnect' },
    { id: 'proj_wait', title: 'WaitlistWizard' },
    { id: 'proj_misrac', title: 'DeficientPlumpMisrac' }
  ];

  return (
    <nav
      aria-label="Main navigation"
      data-analytics-id="global_sidebar"
      data-global-sidebar-root="true"
      data-global-sidebar-viewport="desktop"
      data-global-sidebar-open="true"
      className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start items-stretch shrink-0 pointer-events-auto absolute top-0 left-0 flex h-full flex-col visible select-none z-10 [background:color-mix(in_srgb,var(--surface-color)_50%,transparent_50%)] _sdz_theme-default _sdz_surface _sdz_switch-theme"
      style={{
        width: '240px',
        boxShadow: 'var(--shadow-subtle-overlay-border)'
      }}
    >
      <div className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 contents">
        
        {/* 1. TOP BAR: Search button (h: 48px) */}
        <div
          className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-row justify-logical-end items-center shrink-0 pr-(--useView--pr) pl-(--useView--pl)"
          style={{ paddingLeft: '6px', paddingRight: '6px', height: '48px' }}
        >
          <button
            type="button"
            aria-label="Search"
            className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center rounded-6 text-color-default appearance-none border-0 border-solid border-transparent select-none cursor-pointer bg-surface hover:shades-up-2 p-0"
            style={{ width: '32px', height: '32px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M11 2.25a8.75 8.75 0 0 1 6.693 14.383l3.837 3.837a.75.75 0 0 1-1.06 1.06l-3.837-3.837A8.75 8.75 0 1 1 11 2.25m0 1.5a7.25 7.25 0 1 0 0 14.5 7.25 7.25 0 0 0 0-14.5" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* 2. WORKSPACE SWITCHER PILL (h: 32px, px: 6px) */}
        <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 py-100 px-150">
          <button
            type="button"
            aria-label="Workspace menu"
            className="text-color-default appearance-none border-0 border-solid border-transparent select-none shadow-control bg-surface inset-ring inset-ring-surface-border-regular _sdz_custom-hover:shades-up-2 _sdz_switch-theme _sdz_theme-text-input flex min-h-0 min-w-0 basis-auto cursor-pointer flex-row items-center shrink-0 self-stretch justify-between h-800 gap-50 px-200 rounded-full"
            style={{ height: '32px' }}
          >
            <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 -ml-100">
              <div
                className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative inline-flex isolate overflow-hidden bg-surface rounded-full _sdz_surface-2"
                style={{ width: '24px', height: '24px' }}
              >
                <div className="size-full flex items-center justify-center font-medium text-xs bg-[#4E4438] text-[#F3A536]">A</div>
              </div>
            </div>
            <span className="flex min-w-0 items-center gap-200 grow justify-between px-100 text-label-l-control">
              <span className="min-w-0 grow truncate text-left text-sm font-normal">Personal workspace</span>
            </span>
            <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12.53 15.53a.75.75 0 0 1-1.06 0l-6-6a.75.75 0 0 1 1.06-1.06L12 13.94l5.47-5.47a.75.75 0 1 1 1.06 1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </button>
        </div>

        {/* 3. WIDE "NEW" BUTTON */}
        <div className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 grid grid-cols-1">
          <div className="flex box-border min-w-0 border-0 border-solid view-outline-none flex-col items-stretch shrink-0 justify-logical-end min-h-0 overflow-clip">
            <ul className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 m-0 list-none py-100 px-150">
              <li
                className="flex box-border min-h-0 min-w-0 border-0 border-solid flex-col justify-logical-start items-stretch shrink-0 _sdz_theme-text-input bg-surface _sdz_switch-theme overflow-visible shadow-flat rounded-8 outline outline-surface-border-regular -outline-offset-1"
                style={{ borderRadius: '8px' }}
              >
                <button
                  type="button"
                  onClick={onOpenCreate}
                  className="text-color-default appearance-none border-0 border-solid border-transparent select-none flex min-h-0 basis-auto cursor-pointer flex-row items-center shrink-0 self-stretch justify-center h-800 px-200 bg-transparent min-w-800 gap-0 overflow-hidden rounded-8 p-0"
                  style={{ height: '32px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M12 1.25c5.937 0 10.75 4.813 10.75 10.75S17.937 22.75 12 22.75 1.25 17.937 1.25 12 6.063 1.25 12 1.25M11.996 6a.75.75 0 0 0-.75.75v4.504H6.75a.75.75 0 0 0 0 1.5h4.496v4.496a.75.75 0 0 0 1.5 0v-4.496h4.504a.75.75 0 0 0 0-1.5h-4.504V6.75a.75.75 0 0 0-.75-.75" clipRule="evenodd" />
                  </svg>
                  <span className="flex min-w-0 items-center gap-200 text-label-l-control px-0 overflow-hidden">
                    <span className="min-w-0 grow truncate text-left"><span className="pl-150 font-medium text-sm">New</span></span>
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* 4. SCROLLABLE NAVIGATION & RECENT SECTION */}
        <div
          data-global-sidebar-scroll="true"
          className="flex box-border min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch grow shrink overflow-x-hidden overflow-y-auto scrollbar-none min-h-0"
        >
          {/* Main Navigation Rows (Import, Library, Routines, Integrations, Security, More) */}
          <div className="flex box-border min-w-0 border-0 border-solid view-outline-none flex-col items-stretch shrink-0 justify-logical-end min-h-0">
            <ul className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-100 pt-100 px-150 pb-150 m-0 list-none">
              
              {/* Import */}
              <li className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 rounded-8">
                <button
                  type="button"
                  onClick={() => onNavigate?.('import')}
                  className="text-color-default appearance-none border-solid border-transparent select-none flex h-800 w-full min-w-0 shrink-0 cursor-pointer flex-row items-center border text-left text-label-l-list-item pl-[calc(var(--spacing-100)-var(--border-width-regular))] pr-[calc(var(--spacing-200)-var(--border-width-regular))] rounded-8 bg-transparent hover:bg-surface"
                  style={{ height: '32px' }}
                >
                  <span className="mr-100 flex w-600 shrink-0 items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v10.19l3.72-3.72a.75.75 0 1 1 1.06 1.06l-5 5a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 1 1 1.06-1.06l3.72 3.72V3a.75.75 0 0 1 .75-.75m-9 12a.75.75 0 0 1 .75.75v4A1.25 1.25 0 0 0 5 20.25h14A1.25 1.25 0 0 0 20.25 19v-4a.75.75 0 0 1 1.5 0v4A2.75 2.75 0 0 1 19 21.75H5A2.75 2.75 0 0 1 2.25 19v-4a.75.75 0 0 1 .75-.75" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="min-w-0 grow truncate text-sm font-normal">Import</span>
                </button>
              </li>

              {/* Library */}
              <li className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 rounded-8">
                <button
                  type="button"
                  onClick={() => onNavigate?.('projects')}
                  className="text-color-default appearance-none border-solid border-transparent select-none flex h-800 w-full min-w-0 shrink-0 cursor-pointer flex-row items-center border text-left text-label-l-list-item pl-[calc(var(--spacing-100)-var(--border-width-regular))] pr-[calc(var(--spacing-200)-var(--border-width-regular))] rounded-8 bg-transparent hover:bg-surface"
                  style={{ height: '32px' }}
                >
                  <span className="mr-100 flex w-600 shrink-0 items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.25 18A3.75 3.75 0 0 0 9 17.25H3a.25.25 0 0 1-.245-.201L2.75 17V4A.25.25 0 0 1 3 3.75h5A3.25 3.25 0 0 1 11.25 7zm1.5 0V7A3.25 3.25 0 0 1 16 3.75h5a.25.25 0 0 1 .25.25v13a.25.25 0 0 1-.25.25h-6a3.75 3.75 0 0 0-2.25.75M12 21.75a.75.75 0 0 0 .75-.75A2.25 2.25 0 0 1 15 18.75h6A1.75 1.75 0 0 0 22.75 17V4A1.75 1.75 0 0 0 21 2.25h-5a4.75 4.75 0 0 0-4 2.19 4.74 4.74 0 0 0-4-2.19H3A1.75 1.75 0 0 0 1.25 4v13A1.75 1.75 0 0 0 3 18.75h6l.223.01A2.25 2.25 0 0 1 11.25 21c0 .414.336.75.75.75" />
                    </svg>
                  </span>
                  <span className="min-w-0 grow truncate text-sm font-normal">Library</span>
                </button>
              </li>

              {/* Routines */}
              <li className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 rounded-8">
                <button
                  type="button"
                  onClick={() => onNavigate?.('routines')}
                  className="text-color-default appearance-none border-solid border-transparent select-none flex h-800 w-full min-w-0 shrink-0 cursor-pointer flex-row items-center border text-left text-label-l-list-item pl-[calc(var(--spacing-100)-var(--border-width-regular))] pr-[calc(var(--spacing-200)-var(--border-width-regular))] rounded-8 bg-transparent hover:bg-surface"
                  style={{ height: '32px' }}
                >
                  <span className="mr-100 flex w-600 shrink-0 items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M12 2.75a9.25 9.25 0 1 0 0 18.5 9.25 9.25 0 0 0 0-18.5M1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12 17.937 22.75 12 22.75 1.25 17.937 1.25 12M12 6.25a.75.75 0 0 1 .75.75v4.932l3.666 2.444a.75.75 0 1 1-.832 1.248l-4-2.667a.75.75 0 0 1-.334-.624V7a.75.75 0 0 1 .75-.75" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="min-w-0 grow truncate text-sm font-normal">Routines</span>
                </button>
              </li>

              {/* Integrations */}
              <li className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 rounded-8">
                <button
                  type="button"
                  onClick={() => onNavigate?.('integrations')}
                  className="text-color-default appearance-none border-solid border-transparent select-none flex h-800 w-full min-w-0 shrink-0 cursor-pointer flex-row items-center border text-left text-label-l-list-item pl-[calc(var(--spacing-100)-var(--border-width-regular))] pr-[calc(var(--spacing-200)-var(--border-width-regular))] rounded-8 bg-transparent hover:bg-surface"
                  style={{ height: '32px' }}
                >
                  <span className="mr-100 flex w-600 shrink-0 items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21.994 16.25a.75.75 0 0 1 .756.744 1.75 1.75 0 0 1-1.032 1.61h-.001l-8.576 3.899a2.76 2.76 0 0 1-2.27 0h-.002l-8.6-3.91-.004-.002a1.75 1.75 0 0 1-1.015-1.593.75.75 0 0 1 1.5.004.25.25 0 0 0 .144.227l8.594 3.908a1.25 1.25 0 0 0 1.033 0l8.579-3.9h.002a.25.25 0 0 0 .148-.231.75.75 0 0 1 .744-.756" />
                      <path d="M21.994 11.25a.75.75 0 0 1 .756.744 1.75 1.75 0 0 1-1.032 1.61h-.001l-8.576 3.899a2.76 2.76 0 0 1-2.27 0h-.002l-8.6-3.91-.004-.002a1.75 1.75 0 0 1-1.015-1.593.75.75 0 0 1 1.5.004.25.25 0 0 0 .144.226l8.594 3.909a1.25 1.25 0 0 0 1.033 0l8.579-3.9h.002a.25.25 0 0 0 .148-.231.75.75 0 0 1 .744-.756" />
                      <path fillRule="evenodd" d="M12 1.25c.394 0 .784.085 1.142.248l8.59 3.91a1.75 1.75 0 0 1 .751 2.553 1.75 1.75 0 0 1-.753.642l-8.58 3.899h.001a2.75 2.75 0 0 1-2.282 0l-8.58-3.91a1.75 1.75 0 0 1-1.035-1.597A1.75 1.75 0 0 1 2.29 5.397l8.57-3.899.135-.058c.32-.125.66-.19 1.005-.19m0 1.5c-.179 0-.356.038-.518.112l-8.57 3.9-.009.005a.25.25 0 0 0-.061.419l.061.038.008.004 8.58 3.91a1.26 1.26 0 0 0 1.038 0l8.581-3.9.008-.004a.25.25 0 0 0 .149-.23.25.25 0 0 0-.149-.228l-.009-.003-8.59-3.91A1.3 1.3 0 0 0 12 2.75" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="min-w-0 grow truncate text-sm font-normal">Integrations</span>
                </button>
              </li>

              {/* Security */}
              <li className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 rounded-8">
                <button
                  type="button"
                  onClick={() => onNavigate?.('security')}
                  className="text-color-default appearance-none border-solid border-transparent select-none flex h-800 w-full min-w-0 shrink-0 cursor-pointer flex-row items-center border text-left text-label-l-list-item pl-[calc(var(--spacing-100)-var(--border-width-regular))] pr-[calc(var(--spacing-200)-var(--border-width-regular))] rounded-8 bg-transparent hover:bg-surface"
                  style={{ height: '32px' }}
                >
                  <span className="mr-100 flex w-600 shrink-0 items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.25 6a.25.25 0 0 0-.25-.25c-2.24 0-4.895-1.3-6.727-2.9a.42.42 0 0 0-.546 0C10.02 4.34 7.57 5.585 5.426 5.735L5 5.75a.25.25 0 0 0-.25.25v7c0 2.301.797 3.99 2.058 5.28 1.12 1.15 2.636 2.01 4.357 2.677l.75.274.017.006.084.016a.3.3 0 0 0 .08-.013c2.025-.706 3.818-1.644 5.097-2.957C18.453 16.99 19.25 15.3 19.25 13zm1.5 7c0 2.698-.954 4.76-2.483 6.33-1.51 1.548-3.547 2.584-5.68 3.328l-.006.003a1.75 1.75 0 0 1-1.156-.013c-2.14-.739-4.18-1.772-5.69-3.32C4.202 17.76 3.25 15.699 3.25 13V6A1.75 1.75 0 0 1 5 4.25l.336-.012c1.71-.125 3.856-1.165 5.41-2.523l.007-.005.135-.105a1.92 1.92 0 0 1 2.224 0l.135.105.007.005.32.269C15.207 3.304 17.351 4.25 19 4.25A1.75 1.75 0 0 1 20.75 6z" />
                      <path d="M14.526 9.418a.75.75 0 0 1 1.056 1.056l-.052.056-4 4a.75.75 0 0 1-1.06 0l-2-2-.052-.056a.75.75 0 0 1 1.056-1.056l.056.052L11 12.94l3.47-3.47z" />
                    </svg>
                  </span>
                  <span className="min-w-0 grow truncate text-sm font-normal">Security</span>
                </button>
              </li>

              {/* More */}
              <li className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 rounded-8">
                <button
                  type="button"
                  className="text-color-default appearance-none border-solid border-transparent select-none flex h-800 w-full min-w-0 shrink-0 cursor-pointer flex-row items-center border text-left text-label-l-list-item pl-[calc(var(--spacing-100)-var(--border-width-regular))] pr-[calc(var(--spacing-200)-var(--border-width-regular))] rounded-8 bg-transparent hover:bg-surface"
                  style={{ height: '32px' }}
                >
                  <span className="mr-100 flex w-600 shrink-0 items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M3.25 12a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0m7 0a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0m7 0a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="min-w-0 grow truncate text-sm font-normal">More</span>
                </button>
              </li>

            </ul>
          </div>

          {/* Recent projects list */}
          <div className="flex box-border min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch grow shrink min-h-0 px-150">
            <nav aria-label="Chats and Projects" className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch grow shrink">
              
              {/* Header */}
              <div className="flex box-border min-h-0 border-0 border-solid view-outline-none shrink-0 relative min-w-0 flex-row items-center justify-between pl-200 pb-50 pt-300 mb-0">
                <div className="flex box-border min-h-0 border-0 border-solid view-outline-none justify-logical-start relative flex-row items-center gap-50 grow shrink min-w-0">
                  <h2 className="m-0 min-w-0 whitespace-nowrap text-label-m-group-header text-color-secondary">
                    <button
                      type="button"
                      onClick={() => setIsRecentCollapsed(!isRecentCollapsed)}
                      className="appearance-none border-0 bg-transparent flex items-center p-0 no-underline text-label-m-group-header text-color-secondary gap-1 cursor-pointer"
                    >
                      <span className="overflow-hidden text-clip whitespace-nowrap font-medium text-xs">Recent</span>
                      <span className="flex flex-none justify-center items-center text-color-secondary">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M12.53 15.53a.75.75 0 0 1-1.06 0l-6-6a.75.75 0 0 1 1.06-1.06L12 13.94l5.47-5.47a.75.75 0 1 1 1.06 1.06z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </button>
                  </h2>
                </div>
                
                <div className="flex items-center gap-100">
                  <button
                    type="button"
                    aria-label="New chat in Recent"
                    className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center rounded-6 text-color-default appearance-none border-0 border-solid border-transparent select-none cursor-pointer bg-surface p-0"
                    style={{ width: '24px', height: '24px' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.25a.75.75 0 0 1 .75.75v6.25H19a.75.75 0 0 1 0 1.5h-6.25V19a.75.75 0 0 1-1.5 0v-6.25H5a.75.75 0 0 1 0-1.5h6.25V5a.75.75 0 0 1 .75-.75" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Section options"
                    className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center rounded-6 text-color-default appearance-none border-0 border-solid border-transparent select-none cursor-pointer bg-surface p-0"
                    style={{ width: '24px', height: '24px' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M10.25 5a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0m0 7a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0m0 7a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Items */}
              {!isRecentCollapsed && (
                <div role="list" className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative w-full pt-100">
                  {recentList.map((item) => (
                    <div key={item.id} className="flex flex-col pb-150">
                      {/* Project Row */}
                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center rounded-8 group/sidebar-row hover:bg-surface/50">
                        <button
                          type="button"
                          onClick={() => onSelectProject?.(item.id)}
                          className="flex flex-1 items-center pl-100 min-w-0 text-color-default min-h-800 rounded-[inherit] bg-transparent border-0 cursor-pointer text-left"
                          style={{ height: '32px' }}
                        >
                          <span className="flex items-center justify-center mr-100 w-600 text-(--foreground-dimmer)">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path fillRule="evenodd" d="M8.927 8.054a2.334 2.334 0 0 1 2.858-1.65l9.416 2.523a2.334 2.334 0 0 1 1.65 2.858l-2.523 9.416a2.334 2.334 0 0 1-2.858 1.65l-9.416-2.523a2.334 2.334 0 0 1-1.65-2.858zm2.491-.28a.915.915 0 0 0-1.121.647l-2.524 9.416c-.13.488.16.99.648 1.121l9.416 2.523c.488.131.99-.159 1.121-.647l2.523-9.416a.916.916 0 0 0-.647-1.121z" clipRule="evenodd" />
                              <path d="M13.232 1.15a2.334 2.334 0 0 1 2.334 2.334V4.89a.71.71 0 0 1-1.418 0V3.484a.916.916 0 0 0-.916-.916H3.484a.916.916 0 0 0-.916.916v9.748c0 .506.41.916.916.916H4.89a.71.71 0 1 1 0 1.418H3.484a2.334 2.334 0 0 1-2.334-2.334V3.484A2.334 2.334 0 0 1 3.484 1.15z" />
                            </svg>
                          </span>
                          <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-sm max-w-full whitespace-nowrap wrap-break-word overflow-hidden text-color-default block text-clip font-normal">
                            {item.title}
                          </span>
                        </button>

                        <div className="flex items-center gap-1 opacity-0 group-hover/sidebar-row:opacity-100 pr-100">
                          <button
                            type="button"
                            aria-label={`New task in ${item.title}`}
                            className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center rounded-6 text-color-default appearance-none border-0 border-solid border-transparent select-none cursor-pointer bg-surface p-0"
                            style={{ width: '24px', height: '24px' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 4.25a.75.75 0 0 1 .75.75v6.25H19a.75.75 0 0 1 0 1.5h-6.25V19a.75.75 0 0 1-1.5 0v-6.25H5a.75.75 0 0 1 0-1.5h6.25V5a.75.75 0 0 1 .75-.75" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Sub-row: New task pill */}
                      <div className="pl-800 pr-200 pt-50 pb-50">
                        <button
                          type="button"
                          className="appearance-none border-0 border-solid border-transparent select-none bg-surface flex min-h-0 basis-auto cursor-pointer flex-row items-center self-auto justify-center h-600 gap-50 px-150 shrink-0 min-w-600 rounded-full"
                          style={{ height: '24px' }}
                        >
                          <span className="flex items-center gap-100 text-xs text-color-tertiary">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 4.25a.75.75 0 0 1 .75.75v6.25H19a.75.75 0 0 1 0 1.5h-6.25V19a.75.75 0 0 1-1.5 0v-6.25H5a.75.75 0 0 1 0-1.5h6.25V5a.75.75 0 0 1 .75-.75" />
                            </svg>
                            <span className="whitespace-nowrap leading-none font-normal">New task</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </nav>
          </div>
        </div>

        {/* 5. BOTTOM ANCHORED SECTION (Upgrade, Learn more, User row) */}
        <div data-global-sidebar-deferred="true" className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0">
          
          {/* Upgrade your plan card */}
          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 py-100 px-150">
            <div
              className="flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 rounded-8 group/upgrade-card overflow-hidden bg-(--text-input-surface-color-100) _sdz_theme-popup _sdz_surface border border-surface-border-regular _sdz_switch-theme"
              style={{ borderRadius: '8px' }}
            >
              <button
                type="button"
                className="rounded-6 appearance-none border-0 border-solid border-transparent select-none bg-transparent flex min-h-0 min-w-0 basis-auto cursor-pointer flex-row items-center shrink-0 self-stretch justify-between h-auto px-0 gap-200 text-left"
              >
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-200 p-300 w-full">
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row justify-between items-center gap-200">
                    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink">
                      <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-sm wrap-break-word inline text-left text-color-default font-medium whitespace-normal">
                        Upgrade your plan
                      </span>
                      <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs wrap-break-word inline text-left text-color-tertiary whitespace-normal font-normal">
                        Unlock more credits
                      </span>
                    </div>
                    <div
                      className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-center items-center shrink-0 rounded-8 _sdz_theme-primary bg-surface _sdz_switch-theme"
                      style={{ padding: '6px', borderRadius: '8px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--white)">
                        <path d="M12.554.492c.49 3.288 1.307 7.363 2.448 8.505s5.22 1.959 8.51 2.449c.651.097.65 1.01 0 1.107-3.29.49-7.367 1.307-8.51 2.448-1.143 1.143-1.96 5.227-2.45 8.518-.096.642-1.009.641-1.104 0-.49-3.291-1.308-7.374-2.45-8.517S3.78 13.043.491 12.552a.558.558 0 0 1 0-1.107c3.289-.49 7.363-1.307 8.505-2.448s1.959-5.216 2.45-8.505a.558.558 0 0 1 1.107 0" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Learn more */}
          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 px-150 pb-100">
            <button
              type="button"
              className="text-color-default appearance-none border-0 border-solid border-transparent select-none bg-surface flex min-h-0 min-w-0 basis-auto cursor-pointer flex-row items-center shrink-0 self-stretch justify-logical-start h-800 gap-50 rounded-6 px-200"
              style={{ height: '32px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 21.25a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1 0-1.5zM15 17.25a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5zM12 1.25A6.75 6.75 0 0 1 18.75 8c0 1.473-.562 2.972-1.72 4.03-.75.75-1.136 1.324-1.295 2.118a.75.75 0 0 1-1.47-.296c.241-1.206.855-2.033 1.705-2.882l.028-.028c.823-.74 1.252-1.827 1.252-2.942a5.25 5.25 0 0 0-10.5 0l.009.326c.045.777.286 1.658 1.271 2.644.742.742 1.463 1.67 1.705 2.882a.75.75 0 0 1-1.47.296c-.158-.788-.637-1.46-1.295-2.118C5.68 10.741 5.33 9.5 5.264 8.442L5.25 8A6.75 6.75 0 0 1 12 1.25" />
              </svg>
              <span className="flex min-w-0 items-center gap-200 px-100 text-label-l-control">
                <span className="min-w-0 grow truncate text-left text-sm font-normal">Learn more</span>
              </span>
            </button>
          </div>

          {/* User row */}
          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start flex-row items-center gap-100 py-200 px-150 shrink-0">
            <div
              className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-row justify-logical-start items-center grow shrink relative rounded-full [background:color-mix(in_srgb,var(--surface-color)_50%,transparent_50%)] _sdz_surface"
            >
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch grow shrink h-800">
                <button
                  type="button"
                  aria-label="Account menu"
                  className="text-color-default appearance-none border-0 border-solid border-transparent select-none shadow-control bg-surface inset-ring inset-ring-surface-border-regular _sdz_custom-hover:shades-up-2 _sdz_switch-theme _sdz_theme-text-input flex min-h-0 min-w-0 basis-auto cursor-pointer flex-row items-center shrink-0 self-stretch justify-between h-800 gap-50 px-200 rounded-full"
                  style={{ height: '32px' }}
                >
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 -ml-50">
                    <div
                      className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative inline-flex isolate overflow-hidden bg-surface rounded-full _sdz_surface-2"
                      style={{ width: '20px', height: '20px' }}
                    >
                      <div className="size-full flex items-center justify-center font-medium text-[10px] bg-[#4E4438] text-[#F3A536]">A</div>
                    </div>
                  </div>
                  <span className="flex min-w-0 items-center gap-200 grow justify-between px-100 text-label-l-control">
                    <span className="min-w-0 grow truncate text-left text-sm font-normal">Alex</span>
                  </span>
                  <div className="size-600 shrink-0" />
                </button>
              </div>

              {/* Settings link */}
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 absolute right-100">
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 rounded-full">
                  <button
                    type="button"
                    onClick={onOpenSettings}
                    aria-label="Settings"
                    className="flex justify-center items-center rounded-full text-color-default appearance-none border-0 bg-surface select-none cursor-pointer p-0"
                    style={{ width: '24px', height: '24px' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <title>Settings</title>
                      <path fillRule="evenodd" d="M12 8.25a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5m0 1.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M12.287 1.281a3.09 3.09 0 0 1 2.75 2.5l.04.284v.005a1.59 1.59 0 0 0 2.256 1.301l.006-.003a3.093 3.093 0 0 1 3.953 1.268 3.09 3.09 0 0 1-.876 4.058l-.006.004a1.59 1.59 0 0 0-.15 2.484l.15.119.006.005a3.09 3.09 0 0 1-3.077 5.325l-.006-.003a1.594 1.594 0 0 0-2.013.586c-.137.215-.22.461-.243.716v.004a3.091 3.091 0 0 1-6.152 0l-.001-.005a1.59 1.59 0 0 0-2.256-1.301l-.007.003a3.09 3.09 0 0 1-3.076-5.325l.006-.005a1.592 1.592 0 0 0 0-2.603l-.007-.005a3.09 3.09 0 0 1 2.81-5.431l.265.106.008.003a1.6 1.6 0 0 0 1.466-.064 1.6 1.6 0 0 0 .789-1.237 1 1 0 0 1 .016-.096A3.09 3.09 0 0 1 12 1.267zm-.286 1.486a1.593 1.593 0 0 0-1.583 1.44 1 1 0 0 1-.013.08 3.09 3.09 0 0 1-1.522 2.32 3.09 3.09 0 0 1-2.85.124 1.59 1.59 0 0 0-2.024.657 1.59 1.59 0 0 0 .45 2.086 3.092 3.092 0 0 1-.007 5.055 1.59 1.59 0 0 0 1.59 2.736 3.09 3.09 0 0 1 2.842.127 3.09 3.09 0 0 1 1.533 2.4 1.592 1.592 0 0 0 2.653 1.026c.293-.266.477-.632.514-1.026a3.09 3.09 0 0 1 2.942-2.81 3.1 3.1 0 0 1 1.433.284l.138.054a1.593 1.593 0 0 0 2.074-1.839 1.6 1.6 0 0 0-.622-.952l-.15-.111a3.09 3.09 0 0 1-.817-3.844c.229-.44.56-.82.967-1.104a1.59 1.59 0 0 0-1.59-2.736 3.09 3.09 0 0 1-4.376-2.532 1.593 1.593 0 0 0-1.582-1.435" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </nav>
  );
};
