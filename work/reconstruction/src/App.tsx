import React, { useState, useEffect } from 'react';
import { MegaNav } from './components/MegaNav';
import { HeroPromptBuilder } from './components/HeroPromptBuilder';
import { HeroBentoGrid } from './components/HeroBentoGrid';
import { TemplateGallery } from './components/TemplateGallery';
import { PlatformInfrastructure } from './components/PlatformInfrastructure';
import { TestimonialCarousel } from './components/TestimonialCarousel';
import { PricingSection } from './components/PricingSection';
import { PartnerLogoBlock } from './components/PartnerLogoBlock';
import { FooterCta, MarketingFooter } from './components/MarketingFooter';

// Signed-In App Components
import { GlobalSidebar } from './components/signedIn/GlobalSidebar';
import { HomeDashboard } from './components/signedIn/HomeDashboard';
import { ProjectsList } from './components/signedIn/ProjectsList';
import { ImportView } from './components/signedIn/ImportView';
import { RoutinesView } from './components/signedIn/RoutinesView';
import { SecurityView } from './components/signedIn/SecurityView';
import { Workspace } from './components/signedIn/Workspace';
import { WorkspaceSettingsView } from './components/signedIn/WorkspaceSettingsView';
import { CreateAppModal } from './components/signedIn/CreateAppModal';
import { SettingsModal } from './components/signedIn/SettingsModal';

import {
  initialProjects,
  initialUserProfile,
  initialDeployments,
  initialTeamMembers,
  ProjectItem,
  UserProfile,
  TeamMember
} from './fixtures/signedInFixtures';

export const App: React.FC = () => {
  // App view mode: 'landing' vs 'signed_in'
  const [appMode, setAppMode] = useState<'landing' | 'signed_in'>('signed_in');

  // Signed-in screen state: 'home' | 'projects' | 'workspace' | 'deployments' | 'teams' | 'integrations'
  const [currentScreen, setCurrentScreen] = useState<string>('home');

  // Local fixture state
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [activeProjectId, setActiveProjectId] = useState<string>('proj_demo');
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [deployments, setDeployments] = useState(initialDeployments);
  const [teams, setTeams] = useState<TeamMember[]>(initialTeamMembers);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createInitialTemplate, setCreateInitialTemplate] = useState<string | undefined>(undefined);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Listen to hash / URL for automated test navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const search = window.location.search;
      if (path === '/' && !search.includes('signed_in')) {
        setAppMode('landing');
      } else if (path.startsWith('/~') || path.startsWith('/@') || path === '/routines' || path === '/import' || path === '/repls' || path.startsWith('/settings') || search.includes('signed_in')) {
        setAppMode('signed_in');
        if (path === '/repls') setCurrentScreen('projects');
        else if (path === '/routines' || path === '/~/routines') setCurrentScreen('routines');
        else if (path === '/security' || path === '/~/security') setCurrentScreen('security');
        else if (path === '/import') setCurrentScreen('import');
        else if (path.startsWith('/@')) setCurrentScreen('workspace');
        else if (path.startsWith('/settings')) setCurrentScreen('settings');
        else if (path.includes('/teams')) setCurrentScreen('teams');
        else if (path.includes('/deployments')) setCurrentScreen('deployments');
        else setCurrentScreen('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    handlePopState();

    // Dev test hooks guarded by import.meta.env.DEV
    if (import.meta.env.DEV) {
      (window as any).__setReconScreen = (s: string) => setCurrentScreen(s);
      (window as any).__setReconAppMode = (m: 'landing' | 'signed_in') => setAppMode(m);
      (window as any).__openCreateModal = (open: boolean) => setIsCreateOpen(open);
      (window as any).__openSettingsModal = (open: boolean) => setIsSettingsOpen(open);
      (window as any).__openProject = (id: string) => handleOpenProject(id);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync body and document theme with current app mode
  useEffect(() => {
    if (appMode === 'signed_in') {
      document.body.className = '_sdz_dark';
      document.body.style.backgroundColor = 'rgb(30, 30, 31)';
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.body.className = '';
      document.body.style.backgroundColor = 'rgb(246, 245, 244)';
      document.documentElement.style.colorScheme = 'light';
    }
  }, [appMode]);

  // Action handlers
  const handleOpenProject = (projectId: string) => {
    setActiveProjectId(projectId);
    setCurrentScreen('workspace');
  };

  const handleUpdateProject = (updated: ProjectItem) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (activeProjectId === projectId) {
      setActiveProjectId(projects[0]?.id || '');
    }
  };

  const handleCreateProject = (newProject: ProjectItem) => {
    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    setCurrentScreen('workspace');
  };

  const handleOpenCreateWithTemplate = (tmpl?: string) => {
    setCreateInitialTemplate(tmpl);
    setIsCreateOpen(true);
  };

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const showDevSwitcher = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('dev') === '1';

  return (
    <div className="relative w-full h-full min-h-screen">
      {/* Floating Mode Switcher (Guarded behind dev flag: only visible with ?dev=1) */}
      {showDevSwitcher && (
        <div id="dev-mode-switcher" className="fixed top-200 right-300 z-50 flex items-center bg-black/80 backdrop-blur-md rounded-full p-50 border border-white/20 shadow-xl text-[12px] font-brand">
          <button
            type="button"
            onClick={() => setAppMode('landing')}
            className={`px-300 py-100 rounded-full transition-all cursor-pointer border-0 font-medium ${
              appMode === 'landing' ? 'bg-[#ff3c00] text-white shadow-xs' : 'text-gray-300 hover:text-white bg-transparent'
            }`}
          >
            Landing Page
          </button>
          <button
            type="button"
            onClick={() => setAppMode('signed_in')}
            className={`px-300 py-100 rounded-full transition-all cursor-pointer border-0 font-medium ${
              appMode === 'signed_in' ? 'bg-[#ff3c00] text-white shadow-xs' : 'text-gray-300 hover:text-white bg-transparent'
            }`}
          >
            Signed-In App
          </button>
        </div>
      )}

      {/* VIEW MODE 1: LANDING PAGE */}
      {appMode === 'landing' ? (
        <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 overflow-x-clip overscroll-x-none font-brand [background-color:#faf6f1]! [&_header]:[--surface-color:var(--brand-off-white-surface-color-100)]! [&_header]:[background-color:#faf6f1]! _sdz_theme-default _sdz_surface bg-surface _sdz_switch-theme min-h-screen">
          <MegaNav />
          <HeroPromptBuilder />
          <div aria-hidden="true" />
          <HeroBentoGrid />
          <TemplateGallery />
          <PlatformInfrastructure />
          <TestimonialCarousel />
          <PricingSection />
          <PartnerLogoBlock />
          <FooterCta />
          <MarketingFooter />
        </div>
      ) : (
        /* VIEW MODE 2: SIGNED-IN REPLIT APPLICATION */
        <div
          className="flex box-border min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 w-full ease-chill h-dvh min-h-dvh max-h-dvh transition-[padding-left] _sdz_theme-default _sdz_surface _sdz_switch-theme relative"
          style={{
            paddingLeft: currentScreen === 'settings' ? '0px' : '240px',
            visibility: 'visible',
            opacity: 1,
            backgroundColor: 'transparent'
          }}
        >
          {/* Main Global Navigation Sidebar (collapses inside settings) */}
          {currentScreen !== 'settings' && (
            <GlobalSidebar
              currentScreen={currentScreen}
              onNavigate={(s) => setCurrentScreen(s)}
              projects={projects}
              user={user}
              onOpenCreate={() => setIsCreateOpen(true)}
              onOpenSettings={() => setCurrentScreen('settings')}
              activeProjectId={activeProjectId}
              onSelectProject={handleOpenProject}
            />
          )}

          {/* Active Screen Content */}
          {currentScreen === 'home' && (
            <HomeDashboard
              user={user}
              projects={projects}
              onOpenProject={handleOpenProject}
              onOpenCreate={handleOpenCreateWithTemplate}
              onNavigate={(s) => setCurrentScreen(s)}
            />
          )}

          {currentScreen === 'projects' && (
            <ProjectsList
              projects={projects}
              onOpenProject={handleOpenProject}
              onDeleteProject={handleDeleteProject}
              onOpenCreate={() => setIsCreateOpen(true)}
            />
          )}

          {currentScreen === 'workspace' && activeProject && (
            <Workspace
              project={activeProject}
              onUpdateProject={handleUpdateProject}
              onBackToDashboard={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'import' && (
            <ImportView onOpenCreate={handleOpenCreateWithTemplate} />
          )}

          {currentScreen === 'routines' && (
            <RoutinesView />
          )}

          {currentScreen === 'security' && (
            <SecurityView />
          )}

          {currentScreen === 'settings' && (
            <WorkspaceSettingsView
              user={user}
              onBackToApp={() => setCurrentScreen('home')}
            />
          )}

          {/* Global Modals */}
          <CreateAppModal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onCreate={handleCreateProject}
            initialTemplate={createInitialTemplate}
          />

          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            user={user}
            onUpdateUser={setUser}
          />
        </div>
      )}
    </div>
  );
};

export default App;
