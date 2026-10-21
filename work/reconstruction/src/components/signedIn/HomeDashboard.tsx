import React, { useState } from 'react';
import { ProjectItem, UserProfile } from '../../fixtures/signedInFixtures';

interface HomeDashboardProps {
  user: UserProfile;
  projects: ProjectItem[];
  onOpenProject: (projectId: string) => void;
  onOpenCreate: (initialTemplate?: string) => void;
  onNavigate: (screen: string) => void;
}

const suggestedPrompts = [
  "Turn my notes into a slide deck",
  "Build a modern portfolio with Tailwind and React",
  "Create an interactive 3D scene with Three.js",
  "Generate a REST API with FastAPI and SQLite",
  "Build a full-stack SaaS app with Stripe"
];

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  user,
  projects,
  onOpenProject,
  onOpenCreate,
  onNavigate
}) => {
  const [promptText, setPromptText] = useState('');
  const [promptOffset, setPromptOffset] = useState(0);

  const handleShuffle = () => {
    setPromptOffset((prev) => (prev + 2) % suggestedPrompts.length);
  };

  const currentPrompts = [
    suggestedPrompts[promptOffset % suggestedPrompts.length],
    suggestedPrompts[(promptOffset + 1) % suggestedPrompts.length]
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptText.trim()) return;
    onOpenCreate(promptText.trim());
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col items-center bg-[#1E1E1F] min-h-screen text-[#E9EAEA] px-600 py-400 font-brand select-none">
      <div className="w-full max-w-[752px] flex flex-col gap-600">
        
        {/* Top: Recent projects Section (Matches Live DOM layout) */}
        <div className="flex flex-col gap-300 w-full">
          <div className="flex items-center justify-between">
            <h2 className="m-0 text-sm font-medium text-[#9CA3AF] tracking-tight">
              Recent projects
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="text-xs text-[#9CA3AF] hover:text-white transition-colors cursor-pointer border-0 bg-transparent"
            >
              View all
            </button>
          </div>

          <div className="grid grid-cols-3 gap-300 w-full">
            {projects.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                onClick={() => onOpenProject(proj.id)}
                className="flex flex-col p-300 rounded-8 bg-[#252627] border border-[#3E3E41] hover:border-[#52545A] hover:bg-[#2A2B2D] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-150 mb-100">
                  <span className="w-150 h-150 rounded-full bg-[#ff3c00]/30 border border-[#ff3c00]/60 shrink-0" />
                  <span className="text-sm font-medium text-white truncate grow group-hover:text-[#ff3c00] transition-colors">
                    {proj.title}
                  </span>
                </div>
                <div className="flex items-center gap-100 text-xs text-[#9CA3AF]">
                  <span className="font-mono">{proj.language}</span>
                  <span>·</span>
                  <span>{proj.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Agent Greeting (Matches Live DOM layout) */}
        <div className="flex flex-col items-center text-center mt-600 gap-400">
          <h1 className="m-0 text-[32px] font-medium text-white tracking-tight">
            {user.name.split(' ')[0]}, what are we working on today?
          </h1>

          {/* Suggested Prompt Chips */}
          <div className="flex items-center justify-center gap-200 flex-wrap">
            <span className="text-[12px] text-[#9CA3AF]">Suggested for you:</span>
            {currentPrompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPromptText(p)}
                className="flex items-center gap-150 px-300 py-100 rounded-full bg-[#252627] hover:bg-[#2F3033] border border-[#3E3E41] text-[12px] text-white transition-colors cursor-pointer"
              >
                <span>{p}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={handleShuffle}
              className="p-100 rounded-full hover:bg-white/10 text-[#9CA3AF] hover:text-white transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"
              title="Shuffle suggestions"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
              </svg>
            </button>
          </div>

          {/* Main Agent Prompt Card with Notice (Matches Live Replit Glass Surface) */}
          <div className="w-full flex flex-col rounded-12 bg-[#252627]/80 backdrop-blur-md border border-white/15 shadow-xl overflow-hidden p-300 transition-all focus-within:border-white/30">
            {/* "Did you know?" notice box (Live DOM match) */}
            <div className="flex items-center gap-200 px-300 py-200 rounded-8 bg-[#152337] border border-[#203653] mb-200 text-left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#38bdf8] shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              <div className="flex flex-col text-xs">
                <span className="font-bold text-white">Did you know?</span>
                <span className="text-[#9CA3AF]">You can chat with Agent to analyze this text, research a topic, or explore ideas</span>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-200">
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Ask Agent to build, refine, or explain something..."
                rows={3}
                className="w-full bg-transparent border-0 outline-none text-[15px] font-brand text-white placeholder:text-[#6B7280] resize-none leading-relaxed p-100"
              />

              {/* Controls bar */}
              <div className="flex items-center justify-between pt-200 border-t border-[#3E3E41]/60">
                <div className="flex items-center gap-200">
                  <button
                    type="button"
                    className="flex items-center gap-100 px-200 py-100 rounded-6 hover:bg-white/5 text-xs text-[#9CA3AF] hover:text-white transition-colors cursor-pointer border-0 bg-transparent"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 015 0v10.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V6H9v9.5a3 3 0 006 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
                    </svg>
                    <span>Attach</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-100 px-200 py-100 rounded-6 hover:bg-white/5 text-xs text-[#9CA3AF] hover:text-white transition-colors cursor-pointer border-0 bg-transparent"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                    <span>Web search</span>
                  </button>
                </div>

                <div className="flex items-center gap-200">
                  <div className="flex items-center gap-100 px-200 py-100 rounded-6 bg-white/5 text-xs font-mono text-[#9CA3AF]">
                    <span>Output</span>
                  </div>
                  <div className="flex items-center gap-100 px-200 py-100 rounded-6 bg-white/5 text-xs font-semibold text-white">
                    <span>Free</span>
                  </div>
                  <button
                    type="submit"
                    disabled={!promptText.trim()}
                    aria-label="Submit prompt"
                    className={`w-[32px] h-[32px] rounded-full flex items-center justify-center transition-all cursor-pointer border-0 ${
                      promptText.trim()
                        ? 'bg-[#ff3c00] text-white hover:bg-[#e03500] shadow-md'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
