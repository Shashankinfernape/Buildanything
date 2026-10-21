import React, { useState } from 'react';
import { ProjectItem, UserProfile } from '../../fixtures/signedInFixtures';

interface GlobalSidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  projects: ProjectItem[];
  user: UserProfile;
  onOpenCreate: () => void;
  onOpenSettings: () => void;
  activeProjectId?: string;
  onSelectProject: (id: string) => void;
}

export const GlobalSidebar: React.FC<GlobalSidebarProps> = ({
  currentScreen,
  onNavigate,
  projects,
  user,
  onOpenCreate,
  onOpenSettings,
  activeProjectId,
  onSelectProject
}) => {
  const [isRecentCollapsed, setIsRecentCollapsed] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <nav
      className="replit-sidebar box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start items-stretch shrink-0 pointer-events-auto flex h-full w-[240px] flex-col visible select-none border-r border-[#2B2B2D] bg-[#18191B] text-[#E9EAEA] font-brand"
      style={{ minWidth: '240px', maxWidth: '240px', backgroundColor: '#18191B', color: '#E9EAEA' }}
    >
      {/* Top Header & Workspace Switcher */}
      <div className="flex items-center justify-between p-200 border-b border-[#2B2B2D]/60 gap-100">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-200 px-200 py-150 rounded-6 hover:bg-white/5 transition-colors grow text-left cursor-pointer border-0 bg-transparent text-[#E9EAEA]"
        >
          <div className="w-[20px] h-[20px] rounded-4 bg-[#ff3c00] flex items-center justify-center text-white text-[11px] font-bold">
            R
          </div>
          <span className="font-brand font-medium text-[13px] text-[#E9EAEA] truncate grow">
            Personal workspace
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-[#9CA3AF]">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Search"
          className="p-150 rounded-6 hover:bg-white/5 text-[#9CA3AF] hover:text-[#E9EAEA] transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 2a8 8 0 015.293 13.998l4.854 4.853a1 1 0 01-1.414 1.414l-4.853-4.854A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z" />
          </svg>
        </button>
      </div>

      {/* Primary Navigation Links */}
      <div className="flex flex-col gap-50 px-200 py-200 border-b border-[#2B2B2D]/60">
        <button
          type="button"
          onClick={onOpenCreate}
          className="flex items-center gap-200 px-200 py-150 rounded-8 bg-white/10 hover:bg-white/15 font-brand font-medium text-[13px] text-white transition-colors cursor-pointer border-0 w-full text-left"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#ff3c00]">
            <path fillRule="evenodd" d="M12 1.25c5.937 0 10.75 4.813 10.75 10.75S17.937 22.75 12 22.75 1.25 17.937 1.25 12 6.063 1.25 12 1.25M11.996 6a.75.75 0 0 0-.75.75v4.504H6.75a.75.75 0 0 0 0 1.5h4.496v4.496a.75.75 0 0 0 1.5 0v-4.496h4.504a.75.75 0 0 0 0-1.5h-4.504V6.75a.75.75 0 0 0-.75-.75" clipRule="evenodd" />
          </svg>
          <span>New</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('home')}
          className={`flex items-center gap-200 px-200 py-150 rounded-8 font-brand text-[13px] transition-colors cursor-pointer border-0 w-full text-left ${
            currentScreen === 'home' ? 'bg-white/10 font-semibold text-white' : 'hover:bg-white/5 text-[#9CA3AF] hover:text-[#E9EAEA]'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.1l9 8.1-1.34 1.5L18 10.2V20a1 1 0 01-1 1h-4v-6h-2v6H7a1 1 0 01-1-1v-9.8l-1.66 1.5L3 10.2l9-8.1z" />
          </svg>
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('projects')}
          className={`flex items-center gap-200 px-200 py-150 rounded-8 font-brand text-[13px] transition-colors cursor-pointer border-0 w-full text-left ${
            currentScreen === 'projects' ? 'bg-white/10 font-semibold text-white' : 'hover:bg-white/5 text-[#9CA3AF] hover:text-[#E9EAEA]'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M3 4.75A2.75 2.75 0 015.75 2h12.5A2.75 2.75 0 0121 4.75v14.5A2.75 2.75 0 0118.25 22H5.75A2.75 2.75 0 013 19.25V4.75zm2.75-1.25c-.69 0-1.25.56-1.25 1.25v14.5c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V4.75c0-.69-.56-1.25-1.25-1.25H5.75z" clipRule="evenodd" />
          </svg>
          <span>Library</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('deployments')}
          className={`flex items-center gap-200 px-200 py-150 rounded-8 font-brand text-[13px] transition-colors cursor-pointer border-0 w-full text-left ${
            currentScreen === 'deployments' ? 'bg-white/10 font-semibold text-white' : 'hover:bg-white/5 text-[#9CA3AF] hover:text-[#E9EAEA]'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span>Deployments</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('teams')}
          className={`flex items-center gap-200 px-200 py-150 rounded-8 font-brand text-[13px] transition-colors cursor-pointer border-0 w-full text-left ${
            currentScreen === 'teams' ? 'bg-white/10 font-semibold text-white' : 'hover:bg-white/5 text-[#9CA3AF] hover:text-[#E9EAEA]'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
          <span>Teams</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('integrations')}
          className={`flex items-center gap-200 px-200 py-150 rounded-8 font-brand text-[13px] transition-colors cursor-pointer border-0 w-full text-left ${
            currentScreen === 'integrations' ? 'bg-white/10 font-semibold text-white' : 'hover:bg-white/5 text-[#9CA3AF] hover:text-[#E9EAEA]'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5z" />
          </svg>
          <span>Integrations</span>
        </button>
      </div>

      {/* Recent Projects Section */}
      <div className="flex-1 overflow-y-auto px-200 py-200 flex flex-col gap-100">
        <div className="flex items-center justify-between px-100 py-50 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
          <span>Recent</span>
          <button
            type="button"
            onClick={() => setIsRecentCollapsed(!isRecentCollapsed)}
            className="text-[#9CA3AF] hover:text-[#E9EAEA] cursor-pointer border-0 bg-transparent p-0 flex items-center"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`transform transition-transform ${isRecentCollapsed ? '-rotate-90' : 'rotate-0'}`}
            >
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>
        </div>

        {!isRecentCollapsed && (
          <div className="flex flex-col gap-50">
            {projects.slice(0, 5).map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => onSelectProject(project.id)}
                className={`flex items-center gap-150 px-200 py-150 rounded-6 text-[13px] font-brand transition-colors cursor-pointer border-0 w-full text-left ${
                  activeProjectId === project.id
                    ? 'bg-white/10 font-medium text-white'
                    : 'text-[#D1D5DB] hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="w-150 h-150 rounded-full bg-[#ff3c00]/30 border border-[#ff3c00]/60 shrink-0 flex items-center justify-center text-[9px] font-bold text-[#ff3c00]">
                  •
                </span>
                <span className="truncate grow">{project.title}</span>
                <span className="text-[11px] text-[#9CA3AF] shrink-0 font-mono">{project.language}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade Banner Card */}
      <div className="p-200 m-200 rounded-8 bg-[#252627] border border-[#3E3E41] flex flex-col gap-100">
        <div className="flex items-center justify-between">
          <span className="font-brand font-semibold text-[12px] text-white">Core Plan</span>
          <span className="text-[10px] bg-[#ff3c00]/20 text-[#ff3c00] px-100 py-25 rounded-full font-bold">
            PRO
          </span>
        </div>
        <p className="m-0 text-[11px] text-[#9CA3AF] leading-snug">
          Unlimited Cloud Agent workflows, private deployments & higher compute.
        </p>
        <button
          type="button"
          onClick={onOpenSettings}
          className="mt-50 py-100 px-200 rounded-6 bg-white/10 hover:bg-white/15 text-[11px] font-medium text-white text-center cursor-pointer border-0 transition-colors"
        >
          Manage Plan
        </button>
      </div>

      {/* User Profile Bar */}
      <div className="flex items-center justify-between p-200 border-t border-[#2B2B2D]/60 gap-150 bg-[#141516]/40">
        <div className="flex items-center gap-150 min-w-0 grow">
          <div className="w-[28px] h-[28px] rounded-full bg-[#ff3c00]/20 border border-[#ff3c00]/50 flex items-center justify-center text-[#ff3c00] text-[12px] font-bold shrink-0">
            {user.initials}
          </div>
          <div className="flex flex-col min-w-0 grow">
            <span className="font-brand font-medium text-[12px] text-white truncate">
              {user.name}
            </span>
            <span className="font-brand text-[11px] text-[#9CA3AF] truncate">
              @{user.username}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="User Settings"
          className="p-100 rounded-6 hover:bg-white/10 text-[#9CA3AF] hover:text-white transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </svg>
        </button>
      </div>
    </nav>
  );
};
