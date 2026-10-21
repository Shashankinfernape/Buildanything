import React, { useState } from 'react';
import { ProjectItem } from '../../fixtures/signedInFixtures';

interface WorkspaceProps {
  project: ProjectItem;
  onUpdateProject: (updated: ProjectItem) => void;
  onBackToDashboard: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  project,
  onUpdateProject,
  onBackToDashboard
}) => {
  // Tabs state
  const [centerTab, setCenterTab] = useState<'tools' | 'editor'>('tools');
  const [rightTab, setRightTab] = useState<'console' | 'shell'>('console');

  // Execution & terminal state
  const [isRunning, setIsRunning] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    'Results of your code will appear here when you run your app.'
  ]);
  const [shellInput, setShellInput] = useState('');
  const [shellHistory, setShellHistory] = useState<string[]>([
    '~/workspace :  bash'
  ]);

  // Agent chat state
  const [agentInput, setAgentInput] = useState('');
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [planMode, setPlanMode] = useState(false);

  // Active file
  const activeFileName = project.activeFile || Object.keys(project.files)[0] || 'Main.java';
  const activeCode = project.files[activeFileName] || `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Replit!");
    }
}`;

  // Shell submit handler
  const handleShellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shellInput.trim()) return;
    const cmd = shellInput.trim();
    setShellHistory((prev) => [
      ...prev,
      `~/workspace :  ${cmd}`,
      cmd === 'ls' ? 'Main.java  README.md  replit.nix' : `Command '${cmd}' completed successfully.`
    ]);
    setShellInput('');
  };

  // Tool categories from workspace_main_outer.html
  const cloudTools = [
    { id: 'publishing', label: 'Publishing', icon: 'M12 2.25a.75.75 0 0 1 .75.75v10.19l3.72-3.72a.75.75 0 1 1 1.06 1.06l-5 5a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 1 1 1.06-1.06l3.72 3.72V3a.75.75 0 0 1 .75-.75' },
    { id: 'domains', label: 'Domains', icon: 'M12 2.75a9.25 9.25 0 1 0 0 18.5 9.25 9.25 0 0 0 0-18.5' },
    { id: 'monitoring', label: 'Monitoring', icon: 'M3 13.25a.75.75 0 0 1 .75-.75h3.25a.75.75 0 0 1 .6.3l2.4 3.2 4.4-8.8a.75.75 0 0 1 1.34.02l2.66 5.33H20a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.67-.42l-2-4-4.66 9.32a.75.75 0 0 1-1.34 0l-2.67-3.55H3.75a.75.75 0 0 1-.75-.75' },
    { id: 'growth', label: 'Growth', icon: 'M12 2.25c.39 0 .78.08 1.14.25l8.59 3.91a1.75 1.75 0 0 1 .75 2.55' },
    { id: 'database', label: 'Database', icon: 'M12 3c-4.97 0-9 1.34-9 3v12c0 1.66 4.03 3 9 3s9-1.34 9-3V6c0-1.66-4.03-3-9-3' },
    { id: 'auth', label: 'Users & Auth', icon: 'M12 14.25A4.75 4.75 0 0 1 16.75 19v2a.75.75 0 0 1-1.5 0v-2' },
    { id: 'security', label: 'Security Center', icon: 'M12 1.25a.75.75 0 0 1 .75.75v10.19' },
    { id: 'storage', label: 'App Storage', icon: 'M21.99 16.25a.75.75 0 0 1 .75.74 1.75 1.75 0 0 1-1.03 1.61' }
  ];

  const setupTools = [
    { id: 'integrations', label: 'Integrations', icon: 'M21.99 11.25a.75.75 0 0 1 .75.74' },
    { id: 'git', label: 'Git', icon: 'M12 1.25a3.75 3.75 0 0 0-3.75 3.75c0 1.6.99 2.97 2.4 3.51v7.48' },
    { id: 'secrets', label: 'Secrets', icon: 'M12 1.25c3.73 0 6.75 3.02 6.75 6.75 0 2.25-1.1 4.25-2.8 5.48' },
    { id: 'skills', label: 'Agent Skills', icon: 'M12 2.25a9.75 9.75 0 1 0 9.75 9.75' }
  ];

  return (
    <div className="flex-1 flex flex-row h-screen bg-[#1e1e1f] text-color-default overflow-hidden select-none font-brand">
      
      {/* ========================================================= */}
      {/* PANE 1: REPLIT AGENT CHAT PANE (w: 451px, x: 240..691)   */}
      {/* ========================================================= */}
      <div className="flex flex-col border-r border-[#2B2B2D] bg-[#1e1e1f]" style={{ width: '451px' }}>
        
        {/* Chat Header (h: 40px) */}
        <div className="h-[40px] px-300 border-b border-[#2B2B2D] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-150">
            <button
              type="button"
              className="flex items-center gap-100 px-200 py-75 rounded-6 bg-white/5 hover:bg-white/10 text-white text-xs font-medium cursor-pointer border border-white/10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 4.25a.75.75 0 0 1 .75.75v6.25H19a.75.75 0 0 1 0 1.5h-6.25V19a.75.75 0 0 1-1.5 0v-6.25H5a.75.75 0 0 1 0-1.5h6.25V5a.75.75 0 0 1 .75-.75" clipRule="evenodd" />
              </svg>
              <span>New chat</span>
            </button>
          </div>
          <div className="flex items-center gap-100 text-gray-400">
            <button
              type="button"
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-100 px-250 py-75 rounded-6 text-xs font-semibold cursor-pointer border-0 ${
                isRunning ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-[#00c950] hover:bg-[#00b046] text-black font-bold'
              }`}
            >
              <span>{isRunning ? 'Stop' : 'Run'}</span>
            </button>
          </div>
        </div>

        {/* Chat Feed / Welcome State */}
        <div className="flex-1 overflow-y-auto px-400 pb-300 flex flex-col justify-between">
          <div className="flex-1 flex flex-col items-center justify-center shrink-0 w-full">
            {/* Spinner & Greeting centered in upper half */}
            <div className="flex flex-col items-center gap-[16px] w-full max-w-[600px] my-auto">
              <div data-testid="agent-working-spinner" className="relative w-[64px] h-[64px] flex items-center justify-center">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="var(--brand-accent-default)">
                  <path d="M12.532 7.726c0 .082 0 .123.002.164a1.24 1.24 0 0 0 .392.815c.218.22.515.34.823.34h3.343c.668 0 1.002 0 1.257.131.224.116.407.3.521.527.13.258.13.596.13 1.271v2.04c0 .675 0 1.013-.13 1.27a1.2 1.2 0 0 1-.521.528c-.255.131-.59.131-1.257.131H13.74c-.305 0-.6.119-.815.337-.05.05-.074.074-.101.106a1.24 1.24 0 0 0-.29.709c-.003.041-.003.082-.003.163v2.813c0 .675 0 1.013-.13 1.27a1.2 1.2 0 0 1-.522.528c-.255.131-.589.131-1.257.131H7.908c-.668 0-1.002 0-1.257-.131a1.2 1.2 0 0 1-.521-.527C6 20.084 6 19.746 6 19.07v-2.18c0-.675 0-1.012.13-1.27a1.2 1.2 0 0 1 .521-.527c.255-.132.59-.132 1.257-.132h3.393a1.2 1.2 0 0 0 .81-.339l.017-.017c.058-.059.087-.088.118-.124.16-.19.263-.441.282-.69.004-.046.004-.093.004-.187V10.38c0-.093 0-.14-.004-.187-.02-.248-.123-.5-.282-.69-.03-.035-.06-.065-.118-.124a1.16 1.16 0 0 0-.824-.34H7.908c-.668 0-1.002 0-1.257-.132a1.2 1.2 0 0 1-.521-.527C6 8.121 6 7.784 6 7.11v-2.18c0-.675 0-1.013.13-1.27a1.2 1.2 0 0 1 .521-.528C6.906 3 7.241 3 7.908 3h2.715c.668 0 1.002 0 1.257.131.225.116.407.3.522.527.13.258.13.596.13 1.271z" />
                </svg>
              </div>
              <h1 className="text-xl font-medium text-color-default m-0">New chat</h1>
              <span className="text-sm text-color-tertiary text-center leading-relaxed">
                Start chatting to learn about this project <br />or make changes
              </span>
            </div>
          </div>

          {/* Prompt / Composer Box */}
          <div className="w-full flex flex-col gap-200 mt-auto">
            <div className="flex flex-col rounded-8 border border-surface-border-regular bg-surface shadow-raised focus-within:border-(--accent-primary-default) transition-colors">
              {/* Text input */}
              <div className="p-[12px] min-h-[44px]">
                <textarea
                  rows={1}
                  value={agentInput}
                  onChange={(e) => setAgentInput(e.target.value)}
                  placeholder="Message Agent..."
                  className="w-full bg-transparent border-0 outline-none text-sm text-color-default placeholder:text-color-placeholder resize-none font-brand leading-relaxed"
                />
              </div>

              {/* Footer Controls */}
              <div className="flex items-center justify-between p-[6px] border-t border-surface-border-regular/40">
                <div className="flex items-center gap-[4px]">
                  <button
                    type="button"
                    aria-label="Add attachment"
                    className="w-[24px] h-[24px] flex items-center justify-center rounded-6 bg-surface hover:bg-surface-2 text-color-default border-0 cursor-pointer"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.25a.75.75 0 0 1 .75.75v6.25H19a.75.75 0 0 1 0 1.5h-6.25V19a.75.75 0 0 1-1.5 0v-6.25H5a.75.75 0 0 1 0-1.5h6.25V5a.75.75 0 0 1 .75-.75" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    disabled
                    aria-label="Select element (CtrlU)"
                    className="w-[24px] h-[24px] flex items-center justify-center rounded-6 bg-surface text-color-default opacity-50 cursor-not-allowed border-0"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M11.883 13.42c-.246-1.147.892-2.101 1.978-1.66l7.415 3.012c1.286.522 1.188 2.374-.145 2.757l-2.933.843a.9.9 0 0 0-.555.467l-1.34 2.741c-.61 1.246-2.45 1.022-2.742-.335zm1.468-.402a.104.104 0 0 0-.14.118l1.678 7.825c.02.096.15.111.194.023L16.59 17.9c.173-.354.488-.618.867-.727l3.299-.948a.103.103 0 0 0 .01-.196z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-[4px]">
                  <button
                    type="button"
                    disabled
                    className="flex items-center gap-100 h-[24px] px-[4px] rounded-6 bg-surface text-color-default border-0 cursor-pointer"
                  >
                    <svg width="10" height="10" viewBox="0 0 18 18" fill="none">
                      <circle cx="3.724" cy="3.724" r="1.75" fill="currentColor" opacity="0.2" />
                      <circle cx="9.004" cy="3.724" r="1.75" fill="currentColor" opacity="0.55" />
                      <circle cx="14.285" cy="3.724" r="1.75" fill="currentColor" opacity="1" />
                      <circle cx="3.724" cy="9.004" r="1.75" fill="currentColor" opacity="0.2" />
                      <circle cx="9.004" cy="9.004" r="1.75" fill="currentColor" opacity="0.2" />
                      <circle cx="14.285" cy="9.004" r="1.75" fill="currentColor" opacity="0.55" />
                      <circle cx="3.724" cy="14.285" r="1.75" fill="currentColor" opacity="0.2" />
                      <circle cx="9.004" cy="14.285" r="1.75" fill="currentColor" opacity="0.2" />
                      <circle cx="14.285" cy="14.285" r="1.75" fill="currentColor" opacity="0.2" />
                    </svg>
                    <span className="text-xs text-color-default">Free</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--foreground-dimmest)">
                      <path fillRule="evenodd" d="M12.53 15.53a.75.75 0 0 1-1.06 0l-6-6a.75.75 0 0 1 1.06-1.06L12 13.94l5.47-5.47a.75.75 0 1 1 1.06 1.06z" clipRule="evenodd" />
                    </svg>
                  </button>

                  <label className="flex items-center gap-[4px] h-[24px] px-[4px] rounded-6 bg-surface cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={planMode}
                      onChange={(e) => setPlanMode(e.target.checked)}
                      className="w-[12px] h-[12px] rounded-2 border border-surface-border-strong cursor-pointer"
                    />
                    <span className="text-xs text-color-default">Plan</span>
                  </label>

                  <button
                    type="button"
                    aria-label="Start voice input"
                    className="w-[24px] h-[24px] flex items-center justify-center rounded-6 bg-surface hover:bg-surface-2 text-color-default border-0 cursor-pointer"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 9.25a.75.75 0 0 1 .75.75v2a7.75 7.75 0 0 1-7 7.713V22a.75.75 0 0 1-1.5 0v-2.287a7.75 7.75 0 0 1-6.99-7.328L4.25 12v-2a.75.75 0 0 1 1.5 0v2l.008.31A6.25 6.25 0 0 0 12 18.25l.31-.008a6.25 6.25 0 0 0 5.932-5.932l.008-.31v-2a.75.75 0 0 1 .75-.75" />
                      <path fillRule="evenodd" d="M12 1.25A3.75 3.75 0 0 1 15.75 5v7a3.75 3.75 0 1 1-7.5 0V5A3.75 3.75 0 0 1 12 1.25m0 1.5A2.25 2.25 0 0 0 9.75 5v7a2.25 2.25 0 0 0 4.5 0V5A2.25 2.25 0 0 0 12 2.75" clipRule="evenodd" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    disabled={!agentInput.trim()}
                    aria-label="Send"
                    className="w-[24px] h-[24px] flex items-center justify-center rounded-6 bg-surface-2 text-color-default disabled:opacity-50 border-0 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M11.47 4.47a.75.75 0 0 1 1.06 0l7 7a.75.75 0 1 1-1.06 1.06l-5.72-5.72V19a.75.75 0 0 1-1.5 0V6.81l-5.72 5.72a.75.75 0 0 1-1.06-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PANE 2: TOOLS & CODE SPLIT PANE (w: 411px, x: 691..1102) */}
      {/* ========================================================= */}
      <div className="flex flex-col border-r border-[#2B2B2D] bg-[#1e1e1f]" style={{ width: '411px' }}>
        
        {/* Tab Bar (h: 36px) */}
        <div className="h-[36px] bg-[#1a1a1b] border-b border-[#2B2B2D] flex items-center px-100 shrink-0">
          <button
            type="button"
            onClick={() => setCenterTab('tools')}
            className={`flex items-center gap-150 px-300 h-[28px] rounded-6 text-xs font-medium cursor-pointer border-0 transition-colors ${
              centerTab === 'tools' ? 'bg-[#28282a] text-white shadow-xs' : 'bg-transparent text-gray-400 hover:text-white'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
            </svg>
            <span>Tools</span>
          </button>

          <button
            type="button"
            onClick={() => setCenterTab('editor')}
            className={`flex items-center gap-150 px-300 h-[28px] rounded-6 text-xs font-medium cursor-pointer border-0 transition-colors ml-100 ${
              centerTab === 'editor' ? 'bg-[#28282a] text-white shadow-xs' : 'bg-transparent text-gray-400 hover:text-white'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h9.5A2.25 2.25 0 0 1 17 4.25v15.5A2.25 2.25 0 0 1 14.75 22h-9.5A2.25 2.25 0 0 1 3 19.75z" clipRule="evenodd" />
            </svg>
            <span>{activeFileName}</span>
          </button>
        </div>

        {/* Tab Content */}
        {centerTab === 'tools' ? (
          <div className="flex-1 overflow-y-auto p-400 bg-[#1e1e1f] text-color-default">
            {/* Cloud Services */}
            <div className="mb-500">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Cloud Services</span>
              <div className="grid grid-cols-2 gap-200 mt-200">
                {cloudTools.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className="flex flex-col items-start p-250 rounded-8 bg-surface border border-white/5 hover:border-white/20 text-left cursor-pointer transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 mb-150">
                      <path d={t.icon} />
                    </svg>
                    <span className="text-xs font-medium text-white">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Setup */}
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Setup</span>
              <div className="grid grid-cols-2 gap-200 mt-200">
                {setupTools.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className="flex flex-col items-start p-250 rounded-8 bg-surface border border-white/5 hover:border-white/20 text-left cursor-pointer transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 mb-150">
                      <path d={t.icon} />
                    </svg>
                    <span className="text-xs font-medium text-white">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Code Editor view */
          <div className="flex-1 flex flex-col overflow-hidden bg-[#18191b]">
            <div className="flex-1 flex overflow-hidden font-mono text-xs text-gray-200">
              <div className="w-10 bg-[#161617] text-gray-600 text-right pr-200 select-none pt-200 leading-[1.6]">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                value={activeCode}
                onChange={(e) => {
                  onUpdateProject({
                    ...project,
                    files: { ...project.files, [activeFileName]: e.target.value }
                  });
                }}
                className="flex-1 bg-transparent border-0 outline-none p-200 text-gray-200 resize-none font-mono text-xs leading-[1.6]"
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* PANE 3: CONSOLE & SHELL TERMINAL (flex-1 / w: ~338px)     */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col bg-[#141415] overflow-hidden">
        
        {/* Terminal Tab Bar (h: 36px) */}
        <div className="h-[36px] bg-[#1a1a1b] border-b border-[#2B2B2D] flex items-center px-100 justify-between shrink-0">
          <div className="flex items-center gap-100">
            <button
              type="button"
              onClick={() => setRightTab('console')}
              className={`flex items-center gap-150 px-300 h-[28px] rounded-6 text-xs font-medium cursor-pointer border-0 transition-colors ${
                rightTab === 'console' ? 'bg-[#28282a] text-white shadow-xs' : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              <span>Console</span>
            </button>

            <button
              type="button"
              onClick={() => setRightTab('shell')}
              className={`flex items-center gap-150 px-300 h-[28px] rounded-6 text-xs font-medium cursor-pointer border-0 transition-colors ${
                rightTab === 'shell' ? 'bg-[#28282a] text-white shadow-xs' : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              <span>Shell</span>
            </button>
          </div>

          <div className="flex items-center gap-100 pr-100 text-xs text-gray-400">
            <button
              type="button"
              onClick={() => {
                if (rightTab === 'console') setConsoleLogs([]);
                else setShellHistory([]);
              }}
              className="px-200 py-50 rounded hover:bg-white/10 text-gray-400 hover:text-white border-0 bg-transparent cursor-pointer text-xs"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="flex-1 overflow-y-auto p-300 font-mono text-xs leading-relaxed text-gray-300">
          {rightTab === 'console' ? (
            <div className="flex flex-col gap-100">
              {consoleLogs.map((log, i) => (
                <div key={i} className="whitespace-pre-wrap">{log}</div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-100">
              {shellHistory.map((item, i) => (
                <div key={i} className="whitespace-pre-wrap">{item}</div>
              ))}
              <form onSubmit={handleShellSubmit} className="flex items-center gap-100 mt-100">
                <span className="text-emerald-400 font-bold">~/workspace : $</span>
                <input
                  type="text"
                  value={shellInput}
                  onChange={(e) => setShellInput(e.target.value)}
                  className="flex-1 bg-transparent border-0 outline-none text-xs text-white font-mono"
                  autoFocus
                />
              </form>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
