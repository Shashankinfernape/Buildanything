import React from 'react';

interface ImportViewProps {
  onOpenCreate?: (template?: string) => void;
}

export const ImportView: React.FC<ImportViewProps> = ({ onOpenCreate }) => {
  const cards = [
    {
      cy: 'import-card-github',
      title: 'Github',
      desc: 'Import any repository or existing app. Agent may be less predictable.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12" clipRule="evenodd" />
        </svg>
      )
    },
    {
      cy: 'import-card-bitbucket',
      title: 'Bitbucket',
      desc: 'Import a repository or existing app. Agent support may be limited.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.75 2.5a.75.75 0 0 0-.742.868l3.415 17.5a.75.75 0 0 0 .736.607h15.682a.75.75 0 0 0 .736-.607l3.415-17.5A.75.75 0 0 0 23.25 2.5zm13.784 12.355H9.466l-1.07-5.71h7.208z" />
        </svg>
      )
    },
    {
      cy: 'import-card-figma',
      title: 'Figma Design',
      desc: 'Convert your designs into live Apps using Replit Agent',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 12a3 3 0 1 1 6 0v6a3 3 0 1 1-6 0zm0-6a3 3 0 1 1 6 0v6H6zm6 0h6a3 3 0 1 1-6 0zm0 6h6a3 3 0 1 1-6 0z" />
        </svg>
      )
    },
    {
      cy: 'import-card-lovable',
      title: 'Lovable',
      desc: 'Migrate your site to make it production-ready',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )
    },
    {
      cy: 'import-card-bolt',
      title: 'Bolt',
      desc: 'Migrate your prototype to make it production-ready',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.9 17.5 11 21 11 21z" />
        </svg>
      )
    },
    {
      cy: 'import-card-base44',
      title: 'Base44',
      desc: 'Migrate your site to make it production-ready',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="4" />
        </svg>
      )
    },
    {
      cy: 'import-card-vercel',
      title: 'Vercel',
      desc: 'Migrate your site to make it production-ready',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="m12 1 12 21H0z" />
        </svg>
      )
    },
    {
      cy: 'import-card-spreadsheet',
      title: 'Spreadsheet',
      desc: 'Create an app from Excel, CSV, or Google Sheets data',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-2 10h-4v-2h4zm0-4h-4V7h4zm-6 4H7v-2h4zm0-4H7V7h4zm-4 6h4v2H7zm6 2v-2h4v2z" />
        </svg>
      )
    },
    {
      cy: 'import-card-zip',
      title: 'Zip file',
      desc: 'Import from a .zip file.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8zm-2 16h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V8h2z" />
        </svg>
      )
    },
    {
      cy: 'import-card-empty',
      title: 'Empty',
      desc: 'Start from a completely empty project without Agent setup or scaffolding.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
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
        <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-800 pb-800">
          
          {/* Header */}
          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-100">
            <h1 className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-2xl font-medium wrap-break-word inline text-color-default">
              Import to Replit
            </h1>
            <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-sm wrap-break-word inline text-color-secondary">
              Migrate data, code, and designs from other apps into Replit
            </span>
          </div>

          {/* Cards Grid */}
          <div className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start shrink-0 gap-400 grid items-stretch grid-cols-[repeat(2,_1fr)] [@media_screen_and_(width<768px)]:grid-cols-[1fr]">
            {cards.map((c) => (
              <div
                key={c.cy}
                data-cy={c.cy}
                onClick={() => onOpenCreate?.(c.title)}
                className="cursor-pointer"
              >
                <div
                  className="flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-row justify-logical-start items-center shrink-0 w-full h-full font-inherit transition-background duration-snappy ease-snappy text-color-default select-none border border-surface-border-regular _sdz_surface _sdz_custom-hover:shades-up-2 bg-surface hover:bg-[#252627]"
                  style={{
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: 'var(--border-radius-8, 8px)'
                  }}
                >
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-[#9CA3AF]">
                    {c.icon}
                  </div>
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch grow shrink">
                    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-200">
                      <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-sm wrap-break-word inline text-color-default font-medium">
                        {c.title}
                      </span>
                    </div>
                    <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs wrap-break-word inline text-color-secondary">
                      {c.desc}
                    </span>
                  </div>
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-color-tertiary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M19.53 11.47a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 1 1-1.06-1.06l5.72-5.72H5a.75.75 0 0 1 0-1.5h12.19l-5.72-5.72a.75.75 0 0 1 1.06-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
};
