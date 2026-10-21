import React, { useState } from 'react';
import { ProjectItem } from '../../fixtures/signedInFixtures';

interface ProjectsListProps {
  projects: ProjectItem[];
  onOpenProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onOpenCreate: () => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  onOpenProject,
  onDeleteProject,
  onOpenCreate
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'assets'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[#1E1E1F] min-h-screen text-[#E9EAEA] p-600 flex flex-col items-center font-brand select-none">
      <div className="w-full max-w-[1000px] flex flex-col gap-600">
        {/* Top Header & New Button */}
        <div className="flex items-center justify-between border-b border-[#2B2B2D] pb-400">
          <div>
            <h1 className="m-0 font-brand text-[28px] font-semibold text-white tracking-tight">
              Projects
            </h1>
            <p className="m-0 mt-50 font-brand text-[13px] text-[#9CA3AF]">
              Manage and collaborate on your Replit projects and deployments.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCreate}
            className="flex items-center gap-150 px-300 py-150 rounded-8 bg-[#ff3c00] hover:bg-[#e03500] text-white font-brand text-[13px] font-medium transition-colors cursor-pointer border-0 shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            <span>New project</span>
          </button>
        </div>

        {/* Tabs Bar & Filters */}
        <div className="flex items-center justify-between gap-400 flex-wrap">
          <div className="flex items-center gap-100 border-b border-[#2B2B2D]">
            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className={`px-300 py-150 text-[13px] font-brand font-medium transition-colors cursor-pointer border-0 bg-transparent border-b-2 ${
                activeTab === 'projects'
                  ? 'border-[#ff3c00] text-white'
                  : 'border-transparent text-[#9CA3AF] hover:text-white'
              }`}
            >
              Projects ({filteredProjects.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('assets')}
              className={`px-300 py-150 text-[13px] font-brand font-medium transition-colors cursor-pointer border-0 bg-transparent border-b-2 ${
                activeTab === 'assets'
                  ? 'border-[#ff3c00] text-white'
                  : 'border-transparent text-[#9CA3AF] hover:text-white'
              }`}
            >
              Assets (0)
            </button>
          </div>

          {/* Search bar & Filter Pills */}
          <div className="flex items-center gap-200 grow max-w-[400px]">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full bg-[#252627] border border-[#3E3E41] rounded-6 px-300 py-150 text-[13px] text-white placeholder:text-[#6B7280] outline-none focus:border-white/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-200 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white border-0 bg-transparent cursor-pointer text-xs"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="flex items-center gap-100 px-200 py-150 rounded-6 bg-[#252627] border border-[#3E3E41] text-xs text-[#9CA3AF] whitespace-nowrap cursor-pointer">
              <span>All projects</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Projects Grid / List */}
        {activeTab === 'projects' ? (
          filteredProjects.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-1200 text-center gap-200 border border-dashed border-[#3E3E41] rounded-12 bg-[#252627]/40">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#6B7280]">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                <path d="M9 3v18M3 9h18" strokeWidth="2" />
              </svg>
              <p className="m-0 text-[15px] font-medium text-white">No projects found</p>
              <p className="m-0 text-xs text-[#9CA3AF] max-w-[320px]">
                {searchQuery ? `No projects match "${searchQuery}".` : 'Create your first project to get started.'}
              </p>
              <button
                type="button"
                onClick={onOpenCreate}
                className="mt-200 px-300 py-150 rounded-6 bg-[#ff3c00] text-white text-xs font-medium cursor-pointer border-0 hover:bg-[#e03500]"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-300">
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col p-400 rounded-8 bg-[#252627] border border-[#3E3E41] hover:border-[#52545A] hover:bg-[#2A2B2D] transition-all relative group"
                >
                  <div className="flex items-start justify-between gap-200">
                    <div
                      onClick={() => onOpenProject(p.id)}
                      className="cursor-pointer flex items-center gap-200 grow min-w-0"
                    >
                      <div className="w-[32px] h-[32px] rounded-6 bg-[#ff3c00]/20 border border-[#ff3c00]/40 flex items-center justify-center text-[#ff3c00] text-xs font-bold shrink-0">
                        {p.icon || '⌘'}
                      </div>
                      <div className="flex flex-col min-w-0 grow">
                        <span className="font-brand font-medium text-[14px] text-white truncate group-hover:text-[#ff3c00] transition-colors">
                          {p.title}
                        </span>
                        <span className="text-[12px] text-[#9CA3AF] truncate">
                          {p.description}
                        </span>
                      </div>
                    </div>

                    {/* Actions Menu button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}
                        className="p-100 rounded-4 hover:bg-white/10 text-[#9CA3AF] hover:text-white cursor-pointer border-0 bg-transparent"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="5" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="12" cy="19" r="2" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === p.id && (
                        <div className="absolute right-0 top-full mt-50 z-20 w-[140px] rounded-6 bg-[#18191B] border border-[#3E3E41] shadow-xl py-100 flex flex-col">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onOpenProject(p.id);
                            }}
                            className="px-300 py-150 text-left text-xs text-white hover:bg-white/10 cursor-pointer border-0 bg-transparent"
                          >
                            Open in Editor
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDeleteProject(p.id);
                            }}
                            className="px-300 py-150 text-left text-xs text-red-400 hover:bg-red-500/10 cursor-pointer border-0 bg-transparent"
                          >
                            Delete Project
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metadata footer */}
                  <div className="flex items-center gap-200 mt-300 pt-200 border-t border-[#3E3E41]/60 text-xs text-[#9CA3AF]">
                    <span className="font-mono bg-white/5 px-150 py-25 rounded-4 text-[11px] text-[#D1D5DB]">
                      {p.language}
                    </span>
                    <span>·</span>
                    <span>Updated {p.updatedAt}</span>
                    <span className="ml-auto text-[11px] text-[#9CA3AF]">
                      {p.isPrivate ? '🔒 Private' : '🌐 Public'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Assets Empty Tab */
          <div className="flex flex-col items-center justify-center py-1200 text-center gap-200 border border-dashed border-[#3E3E41] rounded-12 bg-[#252627]/40">
            <p className="m-0 text-[15px] font-medium text-white">No uploaded assets</p>
            <p className="m-0 text-xs text-[#9CA3AF]">Uploaded images, audio, and models will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
