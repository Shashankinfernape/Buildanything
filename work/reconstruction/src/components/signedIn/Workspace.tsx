import React, { useState } from 'react';
import { ProjectItem, cannedAgentReplies } from '../../fixtures/signedInFixtures';

interface WorkspaceProps {
  project: ProjectItem;
  onUpdateProject: (updated: ProjectItem) => void;
  onBackToDashboard: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [agentInput, setAgentInput] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  // Active file
  const activeFileName = project.activeFile || Object.keys(project.files)[0] || 'Main.java';
  const activeCode = project.files[activeFileName] || `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Replit!");
    }
}`;

  // Agent chat submit
  const handleSendAgentMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!agentInput.trim()) return;

    const userText = agentInput.trim();
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: 'Just now'
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setAgentInput('');
    setIsAgentTyping(true);

    setTimeout(() => {
      let reply = cannedAgentReplies.default;
      const lower = userText.toLowerCase();
      if (lower.includes('landing') || lower.includes('ui') || lower.includes('page')) {
        reply = cannedAgentReplies.landing;
      } else if (lower.includes('error') || lower.includes('bug') || lower.includes('fix')) {
        reply = cannedAgentReplies.error;
      } else if (lower.includes('api') || lower.includes('route')) {
        reply = cannedAgentReplies.api;
      } else if (lower.includes('database') || lower.includes('sql')) {
        reply = cannedAgentReplies.database;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg_${Date.now() + 1}`,
          sender: 'agent',
          text: reply,
          timestamp: 'Just now'
        }
      ]);
      setIsAgentTyping(false);
    }, 600);
  };

  // Run / Stop handler
  const handleToggleRun = () => {
    if (isRunning) {
      setIsRunning(false);
      setConsoleLogs((prev) => [...prev, '[Process stopped]']);
    } else {
      setIsRunning(true);
      setConsoleLogs((prev) => [
        ...prev,
        '> javac Main.java && java Main',
        'Hello, Replit!',
        '[Process finished with exit code 0]'
      ]);
      setRightTab('console');
    }
  };

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
              onClick={handleToggleRun}
              className={`flex items-center gap-100 px-250 py-75 rounded-6 text-xs font-semibold cursor-pointer border-0 ${
                isRunning ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-[#00c950] hover:bg-[#00b046] text-black font-bold'
              }`}
            >
              <span>{isRunning ? 'Stop' : 'Run'}</span>
            </button>
          </div>
        </div>

        {/* Chat Feed / Welcome State */}
        <div className="flex-1 overflow-y-auto p-400 flex flex-col justify-between">
          {chatMessages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-400">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-300 text-[#ff3c00]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25m-.75 6.75a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-1.5 0zm.75 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-base font-semibold text-white m-0 mb-100">
                Start chatting or describe a task
              </h4>
              <p className="text-xs text-gray-400 m-0 max-w-[280px]">
                I can help you build features, fix bugs, or explain how this project works.
              </p>

              {/* Suggestion Chips */}
              <div className="flex flex-col gap-150 w-full mt-500">
                <button
                  type="button"
                  onClick={() => { setAgentInput('Explain how this project works'); }}
                  className="px-300 py-150 rounded-8 bg-surface border border-white/10 hover:border-white/20 text-xs text-left text-gray-300 hover:text-white cursor-pointer transition-colors"
                >
                  💡 Explain how this project works
                </button>
                <button
                  type="button"
                  onClick={() => { setAgentInput('Add a REST API endpoint'); }}
                  className="px-300 py-150 rounded-8 bg-surface border border-white/10 hover:border-white/20 text-xs text-left text-gray-300 hover:text-white cursor-pointer transition-colors"
                >
                  ⚡ Add a REST API endpoint
                </button>
                <button
                  type="button"
                  onClick={() => { setAgentInput('Check for potential bugs'); }}
                  className="px-300 py-150 rounded-8 bg-surface border border-white/10 hover:border-white/20 text-xs text-left text-gray-300 hover:text-white cursor-pointer transition-colors"
                >
                  🔍 Check for potential bugs
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-300">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-50 max-w-[90%] rounded-8 p-300 text-xs ${
                    msg.sender === 'user'
                      ? 'ml-auto bg-[#ff3c00]/10 text-white border border-[#ff3c00]/30'
                      : 'mr-auto bg-surface text-gray-200 border border-white/10'
                  }`}
                >
                  <span className="font-semibold text-[11px] text-gray-400">
                    {msg.sender === 'user' ? 'You' : 'Agent'}
                  </span>
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                </div>
              ))}
              {isAgentTyping && (
                <div className="mr-auto bg-surface text-gray-400 rounded-8 p-250 text-xs border border-white/10 animate-pulse">
                  Agent is thinking...
                </div>
              )}
            </div>
          )}

          {/* Prompt Box */}
          <form onSubmit={handleSendAgentMessage} className="mt-400">
            <div className="relative rounded-12 bg-surface border border-surface-border-strong p-200 flex flex-col gap-150 focus-within:border-white/30">
              <textarea
                rows={2}
                value={agentInput}
                onChange={(e) => setAgentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendAgentMessage();
                  }
                }}
                placeholder="Start chatting or describe a task..."
                className="w-full bg-transparent border-0 outline-none text-xs text-white placeholder:text-gray-500 resize-none font-brand"
              />
              <div className="flex items-center justify-between pt-100 border-t border-white/5">
                <div className="flex items-center gap-100">
                  <button type="button" className="p-75 rounded hover:bg-white/10 text-gray-400 hover:text-white border-0 bg-transparent cursor-pointer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M12 4.25a.75.75 0 0 1 .75.75v6.25H19a.75.75 0 0 1 0 1.5h-6.25V19a.75.75 0 0 1-1.5 0v-6.25H5a.75.75 0 0 1 0-1.5h6.25V5a.75.75 0 0 1 .75-.75" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="text-[11px] text-gray-400 px-150 py-50 rounded bg-white/5">Free</span>
                </div>
                <button
                  type="submit"
                  disabled={!agentInput.trim()}
                  className="p-100 rounded-full bg-[#ff3c00] disabled:bg-gray-700 text-white border-0 cursor-pointer disabled:cursor-not-allowed"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M11.47 4.47a.75.75 0 0 1 1.06 0l7 7a.75.75 0 0 1-1.06 1.06L13 7.06V20a.75.75 0 0 1-1.5 0V7.06L6.03 12.53a.75.75 0 0 1-1.06-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
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
            className={`flex items-center gap-150 px-300 h-[28px] rounded-6 text-xs font-medium cursor-pointer border-0 transition-colors ${
              centerTab === 'editor' ? 'bg-[#28282a] text-white shadow-xs' : 'bg-transparent text-gray-400 hover:text-white'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M5.25 3A2.25 2.25 0 0 0 3 5.25v13.5A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V5.25A2.25 2.25 0 0 0 18.75 3zm1.5 3h10.5v1.5H6.75zm0 3h10.5v1.5H6.75zm0 3h6v1.5H6.75z" clipRule="evenodd" />
            </svg>
            <span>{activeFileName}</span>
            <span className="text-gray-500 hover:text-white ml-50">×</span>
          </button>

          <button
            type="button"
            aria-label="Tools & files"
            className="p-100 ml-auto rounded hover:bg-white/10 text-gray-400 hover:text-white border-0 bg-transparent cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M12 4.25a.75.75 0 0 1 .75.75v6.25H19a.75.75 0 0 1 0 1.5h-6.25V19a.75.75 0 0 1-1.5 0v-6.25H5a.75.75 0 0 1 0-1.5h6.25V5a.75.75 0 0 1 .75-.75" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Center Panel Content */}
        {centerTab === 'tools' ? (
          <div className="flex-1 overflow-y-auto p-400 flex flex-col gap-400">
            {/* Replit Cloud Header */}
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Replit Cloud</span>
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

            {/* Setup Header */}
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Setup</span>
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
