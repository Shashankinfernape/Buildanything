import React, { useState } from 'react';
import { UserProfile } from '../../fixtures/signedInFixtures';

interface WorkspaceSettingsViewProps {
  user: UserProfile;
  onBackToApp: () => void;
  initialTab?: string;
}

export const WorkspaceSettingsView: React.FC<WorkspaceSettingsViewProps> = ({
  user,
  onBackToApp,
  initialTab = 'workspaceOverview'
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  const navSections = [
    {
      title: 'Workspace',
      items: [
        {
          id: 'workspaceOverview',
          label: 'Workspace overview',
          href: '/settings/workspaceOverview',
          svg: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M12 10.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6m0 1.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9M6.75 19.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6m0 1.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9M17.25 19.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6m0 1.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9" clipRule="evenodd" />
            </svg>
          )
        },
        {
          id: 'invitedUsers',
          label: 'Workspace collaborators',
          href: '/settings/invitedUsers',
          svg: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14.25A4.75 4.75 0 0 1 16.75 19v2a.75.75 0 0 1-1.5 0v-2a3.25 3.25 0 0 0-3.089-3.246L12 15.75H6A3.25 3.25 0 0 0 2.75 19v2a.75.75 0 0 1-1.5 0v-2A4.75 4.75 0 0 1 6 14.25zM18.273 14.942a.75.75 0 0 1 .915-.539A4.75 4.75 0 0 1 22.75 19V21a.75.75 0 0 1-1.5 0v-2a3.25 3.25 0 0 0-2.437-3.144.75.75 0 0 1-.54-.914" />
              <path fillRule="evenodd" d="M9 2.25a4.75 4.75 0 1 1 0 9.5 4.75 4.75 0 0 1 0-9.5m0 1.5a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5" clipRule="evenodd" />
              <path d="M15.274 2.94a.75.75 0 0 1 .915-.538 4.75 4.75 0 0 1 0 9.196.75.75 0 0 1-.377-1.453 3.25 3.25 0 0 0 0-6.291.75.75 0 0 1-.538-.915" />
            </svg>
          )
        },
        {
          id: 'integrations',
          label: 'Integrations',
          href: '/settings/integrations',
          svg: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.994 16.25a.75.75 0 0 1 .756.744 1.75 1.75 0 0 1-1.032 1.61h-.001l-8.576 3.899a2.76 2.76 0 0 1-2.27 0h-.002l-8.6-3.91-.004-.002a1.75 1.75 0 0 1-1.015-1.593.75.75 0 0 1 1.5.004.25.25 0 0 0 .144.227l8.594 3.908a1.25 1.25 0 0 0 1.033 0l8.579-3.9h.002a.25.25 0 0 0 .148-.231.75.75 0 0 1 .744-.756" />
              <path d="M21.994 11.25a.75.75 0 0 1 .756.744 1.75 1.75 0 0 1-1.032 1.61h-.001l-8.576 3.899a2.76 2.76 0 0 1-2.27 0h-.002l-8.6-3.91-.004-.002a1.75 1.75 0 0 1-1.015-1.593.75.75 0 0 1 1.5.004.25.25 0 0 0 .144.226l8.594 3.909a1.25 1.25 0 0 0 1.033 0l8.579-3.9h.002a.25.25 0 0 0 .148-.231.75.75 0 0 1 .744-.756" />
              <path fillRule="evenodd" d="M12 1.25c.394 0 .784.085 1.142.248l8.59 3.91a1.75 1.75 0 0 1 .751 2.553 1.75 1.75 0 0 1-.753.642l-8.58 3.899h.001a2.75 2.75 0 0 1-2.282 0l-8.58-3.91a1.75 1.75 0 0 1-1.035-1.597A1.75 1.75 0 0 1 2.29 5.397l8.57-3.899.135-.058c.32-.125.66-.19 1.005-.19m0 1.5c-.179 0-.356.038-.518.112l-8.57 3.9-.009.005a.25.25 0 0 0-.061.419l.061.038.008.004 8.58 3.91a1.26 1.26 0 0 0 1.038 0l8.581-3.9.008-.004a.25.25 0 0 0 .149-.23.25.25 0 0 0-.149-.228l-.009-.003-8.59-3.91A1.3 1.3 0 0 0 12 2.75" clipRule="evenodd" />
            </svg>
          )
        },
        {
          id: 'knowledge',
          label: 'Customization',
          href: '/settings/knowledge',
          svg: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.25 18A3.75 3.75 0 0 0 9 17.25H3a.25.25 0 0 1-.245-.201L2.75 17V4A.25.25 0 0 1 3 3.75h5A3.25 3.25 0 0 1 11.25 7zm1.5 0V7A3.25 3.25 0 0 1 16 3.75h5a.25.25 0 0 1 .25.25v13a.25.25 0 0 1-.25.25h-6a3.75 3.75 0 0 0-2.25.75M12 21.75a.75.75 0 0 0 .75-.75A2.25 2.25 0 0 1 15 18.75h6A1.75 1.75 0 0 0 22.75 17V4A1.75 1.75 0 0 0 21 2.25h-5a4.75 4.75 0 0 0-4 2.19 4.74 4.74 0 0 0-4-2.19H3A1.75 1.75 0 0 0 1.25 4v13A1.75 1.75 0 0 0 3 18.75h6l.223.01A2.25 2.25 0 0 1 11.25 21c0 .414.336.75.75.75" />
            </svg>
          )
        },
        {
          id: 'designSystems',
          label: 'Design systems',
          href: '/settings/designSystems',
          svg: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.01 16.25a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1 0-1.5z" />
              <path fillRule="evenodd" d="M9 2.25A2.75 2.75 0 0 1 11.75 5v1.19l1.02-1.02a3.15 3.15 0 0 1 4.467.006l1.894 1.893a3.15 3.15 0 0 1 .026 4.494l-.684.687H19A2.75 2.75 0 0 1 21.75 15v4A2.75 2.75 0 0 1 19 21.75H7A4.75 4.75 0 0 1 2.25 17V5A2.75 2.75 0 0 1 5 2.25zm-4 1.5A1.25 1.25 0 0 0 3.75 5v12a3.25 3.25 0 0 0 6.5 0V5A1.25 1.25 0 0 0 9 3.75zm5.51 16.5H19A1.25 1.25 0 0 0 20.25 19v-4A1.25 1.25 0 0 0 19 13.75h-2.02zm4.492-14.506a1.65 1.65 0 0 0-1.17.485L11.75 8.311v8.567l6.345-6.373.004-.004a1.65 1.65 0 0 0-.019-2.36l-1.908-1.909a1.65 1.65 0 0 0-1.17-.488" clipRule="evenodd" />
            </svg>
          )
        },
        {
          id: 'slidesTemplates',
          label: 'Slides templates',
          href: '/settings/slidesTemplates',
          svg: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M19 9.25A2.75 2.75 0 0 1 21.75 12v8A2.75 2.75 0 0 1 19 22.75H5A2.75 2.75 0 0 1 2.25 20v-8A2.75 2.75 0 0 1 5 9.25zm-14 1.5c-.69 0-1.25.56-1.25 1.25v8c0 .69.56 1.25 1.25 1.25h14c.69 0 1.25-.56 1.25-1.25v-8c0-.69-.56-1.25-1.25-1.25z" clipRule="evenodd" />
              <path d="M19 5.25a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1 0-1.5zM17 1.25a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1 0-1.5z" />
            </svg>
          )
        }
      ]
    },
    {
      title: 'Account',
      items: [
        {
          id: 'billing',
          label: 'Billing',
          href: '/settings/billing',
          svg: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M20 4.25A2.75 2.75 0 0 1 22.75 7v10A2.75 2.75 0 0 1 20 19.75H4A2.75 2.75 0 0 1 1.25 17V7A2.75 2.75 0 0 1 4 4.25zM2.75 17c0 .69.56 1.25 1.25 1.25h16c.69 0 1.25-.56 1.25-1.25v-6.25H2.75zM4 5.75c-.69 0-1.25.56-1.25 1.25v2.25h18.5V7c0-.69-.56-1.25-1.25-1.25z" clipRule="evenodd" />
            </svg>
          )
        }
      ]
    },
    {
      title: 'User',
      items: [
        {
          id: 'profile',
          label: 'Profile',
          href: '/settings/profile',
          svg: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 14.25A4.75 4.75 0 0 1 19.75 19v2a.75.75 0 0 1-1.5 0v-2a3.25 3.25 0 0 0-3.089-3.246L15 15.75H9A3.25 3.25 0 0 0 5.75 19v2a.75.75 0 0 1-1.5 0v-2A4.75 4.75 0 0 1 9 14.25z" />
              <path fillRule="evenodd" d="M12 2.25a4.75 4.75 0 1 1 0 9.5 4.75 4.75 0 0 1 0-9.5m0 1.5a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5" clipRule="evenodd" />
            </svg>
          )
        },
        {
          id: 'promotionsReferrals',
          label: 'Promotions & Referrals',
          href: '/settings/promotionsReferrals',
          svg: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M16.5 2.25a3.25 3.25 0 0 1 2.737 5H20l.179.01A1.75 1.75 0 0 1 21.75 9v2A1.75 1.75 0 0 1 20 12.75h-.25V19A2.75 2.75 0 0 1 17 21.75H7A2.75 2.75 0 0 1 4.25 19v-6.25H4A1.75 1.75 0 0 1 2.25 11V9c0-.966.784-1.75 1.75-1.75h.763a3.25 3.25 0 0 1 .44-4.048A3.25 3.25 0 0 1 7.5 2.25v.001c1.228-.017 2.364.583 3.27 1.59.48.532.89 1.174 1.23 1.893.34-.72.75-1.36 1.23-1.893.906-1.007 2.042-1.607 3.27-1.59zM5.75 19l.006.125A1.25 1.25 0 0 0 7 20.25h4.25v-7.5h-5.5zm7 1.25H17A1.25 1.25 0 0 0 18.25 19v-6.25h-5.5zM4 8.75a.25.25 0 0 0-.25.25v2c0 .138.112.25.25.25h7.25v-2.5zm8.75 2.5H20a.25.25 0 0 0 .25-.25V9a.25.25 0 0 0-.2-.245L20 8.75h-7.25zM7.5 3.75a1.75 1.75 0 1 0 0 3.5h3.498c-.341-.985-.804-1.806-1.343-2.405C8.96 4.072 8.21 3.737 7.513 3.75zm8.987 0c-.696-.013-1.446.322-2.142 1.095-.539.599-1.002 1.42-1.343 2.405H16.5a1.75 1.75 0 1 0 0-3.5z" clipRule="evenodd" />
            </svg>
          )
        },
        {
          id: 'personalization',
          label: 'Personalization',
          href: '/settings/personalization',
          svg: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.147 1.896a1.45 1.45 0 0 1 .967.502l.112.15.009.013 3.702 5.942-.003.001a1.45 1.45 0 0 1 .078 1.465 1.45 1.45 0 0 1-1.281.781H8.3v-.002a1.45 1.45 0 0 1-1.49-1.482l.02-.198a1.45 1.45 0 0 1 .21-.546L10.764 2.6h.001c.12-.202.287-.374.488-.497l.165-.087c.17-.076.354-.12.541-.126zM8.353 9.25h7.282l-3.623-5.815zM9.25 15a.25.25 0 0 0-.25-.25H4a.25.25 0 0 0-.25.25v5c0 .138.112.25.25.25h5a.25.25 0 0 0 .25-.25zm1.5 5A1.75 1.75 0 0 1 9 21.75H4A1.75 1.75 0 0 1 2.25 20v-5c0-.966.784-1.75 1.75-1.75h5c.966 0 1.75.784 1.75 1.75zM20.25 17.5a2.75 2.75 0 1 0-5.5 0 2.75 2.75 0 0 0 5.5 0m1.5 0a4.25 4.25 0 1 1-8.5 0 4.25 4.25 0 0 1 8.5 0" />
            </svg>
          )
        },
        {
          id: 'notifications',
          label: 'Notifications',
          href: '/settings/notifications',
          svg: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.083 20.625a.75.75 0 0 1 1.298.75 2.75 2.75 0 0 1-4.762 0 .75.75 0 0 1 1.299-.75 1.25 1.25 0 0 0 2.165 0" />
              <path fillRule="evenodd" d="M12 1.25A6.75 6.75 0 0 1 18.75 8c0 2.17.34 3.544.8 4.517s1.063 1.602 1.728 2.288l.016.017a1.749 1.749 0 0 1-1.168 2.923L20 17.75H4a1.752 1.752 0 0 1-1.291-2.93l.015-.016c.664-.686 1.268-1.315 1.728-2.288.43-.912.756-2.175.795-4.119L5.249 8A6.75 6.75 0 0 1 12 1.25m0 1.5A5.25 5.25 0 0 0 6.75 8c0 2.328-.366 3.933-.944 5.156-.572 1.212-1.331 1.995-1.99 2.675l-.04.06a.25.25 0 0 0 .225.36h16a.25.25 0 0 0 .228-.15.25.25 0 0 0-.044-.269c-.66-.68-1.42-1.463-1.992-2.675-.578-1.223-.944-2.83-.944-5.157A5.25 5.25 0 0 0 12 2.75" clipRule="evenodd" />
            </svg>
          )
        }
      ]
    }
  ];

  return (
    <div className="relative w-full min-h-screen font-brand select-none bg-[#1e1e1f] text-color-default flex flex-row">
      {/* 1. SETTINGS NAVIGATION SIDEBAR (w: 240px) */}
      <nav
        aria-label="Main navigation"
        data-analytics-id="global_sidebar"
        data-global-sidebar-root="true"
        data-global-sidebar-viewport="desktop"
        data-global-sidebar-open="true"
        className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start items-stretch shrink-0 pointer-events-auto absolute top-0 left-0 flex h-full flex-col visible [box-shadow:1px_0_0_var(--outline-dimmest)] _sdz_theme-default _sdz_surface-2 bg-surface _sdz_switch-theme z-10"
        style={{ width: '240px', backgroundColor: 'rgb(37, 37, 39)' }}
      >
        <div className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 contents">
          
          {/* Back to app button (h: 48px) */}
          <div
            className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-row justify-logical-end items-center shrink-0 pr-(--useView--pr) pl-(--useView--pl)"
            style={{ paddingLeft: '6px', paddingRight: '6px', height: '48px' }}
          >
            <div data-analytics-product-area="settings" className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 grow">
              <button
                type="button"
                data-analytics-id="settings_back_to_app_button"
                onClick={onBackToApp}
                className="text-color-default appearance-none border-0 border-solid border-transparent select-none bg-surface flex min-h-0 min-w-0 basis-auto cursor-pointer flex-row items-center shrink-0 self-stretch justify-logical-start h-800 gap-50 rounded-6 px-200 hover:bg-white/5"
                style={{ height: '32px' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M4.47 11.47a.75.75 0 0 0 0 1.06l7 7a.75.75 0 1 0 1.06-1.06l-5.72-5.72H19a.75.75 0 0 0 0-1.5H6.81l5.72-5.72a.75.75 0 0 0-1.06-1.06z" clipRule="evenodd" />
                </svg>
                <span className="flex min-w-0 items-center gap-200 px-100 text-label-l-control">
                  <span className="min-w-0 grow truncate text-left text-sm font-normal">Back to app</span>
                </span>
              </button>
            </div>
          </div>

          {/* Workspace switcher (h: 32px) */}
          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 py-100 px-150">
            <button
              type="button"
              className="text-color-default appearance-none border-0 border-solid border-transparent select-none shadow-control bg-surface inset-ring inset-ring-surface-border-regular flex min-h-0 min-w-0 basis-auto cursor-pointer flex-row items-center shrink-0 self-stretch justify-between h-800 gap-50 px-200 rounded-full"
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12.53 15.53a.75.75 0 0 1-1.06 0l-6-6a.75.75 0 0 1 1.06-1.06L12 13.94l5.47-5.47a.75.75 0 1 1 1.06 1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Search settings input */}
          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 px-150" style={{ paddingTop: '12px', paddingBottom: '6px' }}>
            <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch relative shrink">
              <input
                data-ruic="Input"
                type="search"
                id="settings-navigation-search"
                placeholder="Search settings"
                aria-label="Search settings"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cursor-text outline-none text-color-default placeholder:text-gray-500 shadow-interactive-input bg-surface border border-surface-border-strong rounded-6 px-250 py-200 text-[14px] leading-[1.2] pr-800 w-full"
                style={{ height: '32px' }}
              />
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 pointer-events-none absolute right-0 top-0 h-full items-center justify-center p-200 text-gray-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M11 2.25a8.75 8.75 0 0 1 6.693 14.383l3.837 3.837a.75.75 0 0 1-1.06 1.06l-3.837-3.837A8.75 8.75 0 1 1 11 2.25m0 1.5a7.25 7.25 0 1 0 0 14.5 7.25 7.25 0 0 0 0-14.5" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Navigation sections */}
          <ul className="flex box-border min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch grow shrink px-150 m-0 min-h-0 list-none overflow-y-auto" style={{ paddingTop: '4px' }}>
            <li data-analytics-product-area="settings" data-settings-sidebar-navigation="true" className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0">
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-300">
                {navSections.map((sec) => (
                  <div key={sec.title} className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-100">
                    <span className="px-200 text-xs font-medium text-color-secondary uppercase tracking-wider text-gray-400">{sec.title}</span>
                    <ul className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 m-0 p-0 list-none" style={{ gap: '4px' }}>
                      {sec.items.map((item) => {
                        const isSelected = activeTab === item.id;
                        return (
                          <li key={item.id} className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 rounded-8">
                            <button
                              type="button"
                              onClick={() => setActiveTab(item.id)}
                              className={`text-color-default appearance-none border-solid border-transparent select-none flex h-800 w-full min-w-0 shrink-0 cursor-pointer flex-row items-center border text-left text-label-l-list-item pl-[calc(var(--spacing-100)-var(--border-width-regular))] pr-[calc(var(--spacing-200)-var(--border-width-regular))] rounded-8 ${
                                isSelected ? 'bg-surface shades-up-2 font-medium text-white shadow-xs' : 'bg-transparent hover:bg-surface text-gray-300'
                              }`}
                              style={{ height: '32px' }}
                            >
                              <span className="mr-100 flex w-600 shrink-0 items-center justify-center">
                                {item.svg}
                              </span>
                              <span className="min-w-0 grow truncate text-sm">{item.label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}

                {/* Join Community link */}
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 pt-200">
                  <a
                    href="https://replit.com/community"
                    target="_blank"
                    rel="noreferrer"
                    className="text-color-default appearance-none border-solid border-transparent select-none flex h-800 w-full min-w-0 shrink-0 cursor-pointer flex-row items-center border text-left text-label-l-list-item pl-[calc(var(--spacing-100)-var(--border-width-regular))] pr-[calc(var(--spacing-200)-var(--border-width-regular))] rounded-8 bg-transparent hover:bg-surface text-gray-300 no-underline"
                    style={{ height: '32px' }}
                  >
                    <span className="mr-100 flex w-600 shrink-0 items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M15.034 3.41A6.24 6.24 0 0 1 22.75 9.5l-.005.244c-.103 2.506-1.772 4.344-3.215 5.787l-.009.008-5.481 5.302a2.75 2.75 0 0 1-3.156.672 2.75 2.75 0 0 1-.912-.656l-5.493-5.319-.01-.008c-1.442-1.442-3.111-3.27-3.214-5.785L1.25 9.5a6.25 6.25 0 0 1 4.014-5.836 6.25 6.25 0 0 1 6.735 1.497 6.24 6.24 0 0 1 3.035-1.75m3.172 1.637a4.74 4.74 0 0 0-5.236 1.275l-.013.014a1.3 1.3 0 0 1-.823.408L12 6.751a1.3 1.3 0 0 1-.957-.415l-.01-.01A4.751 4.751 0 0 0 2.75 9.5l.015.362c.145 1.783 1.349 3.19 2.765 4.607l5.5 5.324.037.04a1.25 1.25 0 0 0 1.875-.012l.044-.047 5.484-5.305.553-.566c1.254-1.328 2.227-2.698 2.227-4.403v-.004a4.74 4.74 0 0 0-3.044-4.449" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="min-w-0 grow truncate text-sm">Join the Community</span>
                    <span className="ml-100 flex shrink-0 items-center opacity-60">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M7 7.75a.75.75 0 0 1 0-1.5h10a.75.75 0 0 1 .75.75v10a.75.75 0 0 1-1.5 0V8.81l-8.72 8.72a.75.75 0 0 1-1.06-1.06l8.72-8.72z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
            </li>
          </ul>

          {/* Bottom Upgrade Card */}
          <div data-global-sidebar-deferred="true" className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0">
            <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 py-100 px-150">
              <div
                data-analytics-id="global_sidebar_starter_plan_usage_card"
                className="flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 rounded-8 overflow-hidden p-200 border border-white/10"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
              >
                <div className="flex flex-row items-center justify-between">
                  <span className="text-xs font-medium text-white">Unlock more credits</span>
                  <span className="text-[11px] text-gray-400">Replit Core</span>
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full my-150 overflow-hidden">
                  <div className="bg-[#ff3c00] h-full w-[20%]"></div>
                </div>
                <div className="flex flex-row justify-between text-[11px] text-gray-400">
                  <span>0 / 10 used</span>
                  <a href="/pricing" className="text-gray-300 hover:text-white no-underline font-medium">Upgrade</a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </nav>

      {/* 2. SETTINGS MAIN VIEW (paddingLeft: 240px) */}
      <main id="main-content" className="relative grow min-w-0 min-h-screen" style={{ marginLeft: '240px' }}>
        <div data-analytics-id="settings_page" data-analytics-product-area="settings" className="flex box-border min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 min-h-screen">
          <div className="flex box-border border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 grow min-w-0 min-h-screen">
            <h1 style={{ border: 0, clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', height: '1px', margin: '-1px', overflow: 'hidden', padding: 0, position: 'absolute', width: '1px', whiteSpace: 'nowrap' }}>Settings</h1>
            
            <div data-settings-layout="compact" className="box-border border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch flex grow shrink isolate pb-800 overscroll-x-none min-w-0 min-h-screen overflow-visible basis-[0%] bg-surface">
              <div className="box-border w-[960px] min-w-0" style={{ paddingLeft: '80px', paddingRight: '80px', paddingTop: '72px', maxWidth: '960px', marginLeft: 0 }}>
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch w-full grow-0 basis-auto shrink max-w-none">
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 grow w-full">
                    
                    {/* Header */}
                    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row justify-between items-logical-start gap-400 flex-wrap w-full">
                      <div className="flex box-border min-h-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch gap-100 grow shrink basis-0 min-w-[min(100%,200px)]">
                        <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-100 w-fit max-w-full">
                          <div className="flex box-border min-h-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink min-w-0">
                            <h3 className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-2xl font-medium wrap-break-word inline text-color-default m-0">
                              Workspace overview
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 py-400">
                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0">
                        <div className="box-border min-h-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex flex-row items-logical-start gap-600 w-full min-w-0">
                          
                          {/* Neutral Initial Avatar (128x128) per privacy mandate */}
                          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0">
                            <div
                              className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative inline-flex isolate overflow-hidden rounded-full bg-[#4E4438]"
                              style={{ width: '128px', height: '128px' }}
                            >
                              <div className="size-full flex items-center justify-center font-medium text-4xl text-[#F3A536]">
                                A
                              </div>
                            </div>
                          </div>

                          {/* Workspace Name Input */}
                          <div className="flex box-border min-h-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch gap-600 flex-1 min-w-0">
                            <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-200">
                              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-100 text-pretty">
                                <label className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-[16px] text-color-default font-normal">
                                  Workspace name
                                </label>
                              </div>
                              <div className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex relative flex-row items-center max-w-[600px]">
                                <input
                                  disabled
                                  className="cursor-text outline-none shadow-interactive-input border disabled:opacity-50 disabled:cursor-not-allowed h-800 min-h-800 rounded-6 px-250 py-200 w-full text-color-default text-sm"
                                  style={{ backgroundColor: 'rgb(37, 38, 39)', borderColor: 'rgb(65, 65, 68)' }}
                                  value="Alex's workspace"
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Divider */}
                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 py-600">
                        <div className="shrink-0 h-px min-h-px bg-[var(--divider-color,_var(--surface-border-color-regular))] opacity-30" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
                      </div>

                      {/* Export Apps */}
                      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row items-center justify-between gap-600">
                        <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink gap-200">
                          <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-base font-medium wrap-break-word inline text-color-default">
                            Export Apps
                          </span>
                          <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-sm wrap-break-word inline text-color-secondary text-gray-400">
                            Bulk export personal Apps. We'll send you a download link when ready.
                          </span>
                        </div>
                        <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0">
                          <button
                            type="button"
                            className="text-color-default appearance-none border-0 border-solid border-transparent select-none shadow-control bg-surface inset-ring inset-ring-surface-border-strong flex min-h-0 min-w-0 basis-auto cursor-pointer flex-row items-center shrink-0 justify-center h-800 gap-50 rounded-6 px-200 hover:bg-white/10"
                            style={{ height: '32px' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v10.19l3.72-3.72a.75.75 0 1 1 1.06 1.06l-5 5a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 1 1 1.06-1.06l3.72 3.72V3a.75.75 0 0 1 .75-.75m-9 12a.75.75 0 0 1 .75.75v4A1.25 1.25 0 0 0 5 20.25h14A1.25 1.25 0 0 0 20.25 19v-4a.75.75 0 0 1 1.5 0v4A2.75 2.75 0 0 1 19 21.75H5A2.75 2.75 0 0 1 2.25 19v-4a.75.75 0 0 1 .75-.75" clipRule="evenodd" />
                            </svg>
                            <span className="flex min-w-0 items-center gap-200 px-100 text-label-l-control">
                              <span className="min-w-0 grow truncate text-left text-sm font-medium">Start Export</span>
                            </span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
