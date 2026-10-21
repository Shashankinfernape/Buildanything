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
  // Panel toggle states
  const [showFileTree, setShowFileTree] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [consoleTab, setConsoleTab] = useState<'console' | 'shell'>('console');
  const [rightPanelTab, setRightPanelTab] = useState<'preview' | 'agent' | 'secrets' | 'deploy'>('agent');
  
  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    'Replit Nix environment initialized (Python 3.11.8).',
    'Ready. Press Run to start server.'
  ]);
  const [shellInput, setShellInput] = useState('');

  // Agent chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_0',
      sender: 'agent',
      text: `Hello! I'm your Replit Agent for ${project.title}. Ask me to generate routes, fix bugs, or build new features.`,
      timestamp: 'Just now'
    }
  ]);
  const [agentInput, setAgentInput] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  // Secrets state
  const [secrets, setSecrets] = useState<{ key: string; value: string }[]>([
    { key: 'PORT', value: '5000' },
    { key: 'FLASK_ENV', value: 'development' }
  ]);
  const [newSecretKey, setNewSecretKey] = useState('');
  const [newSecretVal, setNewSecretVal] = useState('');

  // Active file and tabs
  const activeFileName = project.activeFile || Object.keys(project.files)[0] || 'main.py';
  const activeContent = project.files[activeFileName] || '';

  // Tab & File switching
  const handleSelectFile = (fileName: string) => {
    const tabs = project.openTabs.includes(fileName)
      ? project.openTabs
      : [...project.openTabs, fileName];
    onUpdateProject({
      ...project,
      activeFile: fileName,
      openTabs: tabs
    });
  };

  const handleCloseTab = (e: React.MouseEvent, fileName: string) => {
    e.stopPropagation();
    const newTabs = project.openTabs.filter((t) => t !== fileName);
    const newActive = newTabs.length > 0 ? newTabs[newTabs.length - 1] : Object.keys(project.files)[0];
    onUpdateProject({
      ...project,
      openTabs: newTabs.length > 0 ? newTabs : [newActive],
      activeFile: newActive
    });
  };

  // Editor content updates
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedFiles = {
      ...project.files,
      [activeFileName]: e.target.value
    };
    onUpdateProject({
      ...project,
      files: updatedFiles
    });
  };

  // Run / Stop handler
  const handleToggleRun = () => {
    if (isRunning) {
      setIsRunning(false);
      setConsoleLogs((prev) => [...prev, '[Process stopped by user]']);
    } else {
      setIsRunning(true);
      setConsoleLogs((prev) => [
        ...prev,
        '> python main.py',
        '* Serving Flask app "main"',
        '* Debug mode: on',
        '* Running on http://0.0.0.0:5000 (Press CTRL+C to quit)'
      ]);
      setRightPanelTab('preview');
    }
  };

  // Shell command execution
  const handleShellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shellInput.trim()) return;
    const cmd = shellInput.trim();
    setConsoleLogs((prev) => [...prev, `$ ${cmd}`, `Executed: ${cmd} (exit status 0)`]);
    setShellInput('');
  };

  // Agent message handler
  const handleSendAgentMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: agentInput.trim(),
      timestamp: 'Just now'
    };
    setChatMessages((prev) => [...prev, userMsg]);
    const prompt = agentInput.toLowerCase();
    setAgentInput('');
    setIsAgentTyping(true);

    setTimeout(() => {
      let reply = cannedAgentReplies.default;
      if (prompt.includes('landing') || prompt.includes('page') || prompt.includes('ui')) {
        reply = cannedAgentReplies.landing;
      } else if (prompt.includes('error') || prompt.includes('bug') || prompt.includes('fix')) {
        reply = cannedAgentReplies.error;
      } else if (prompt.includes('api') || prompt.includes('route') || prompt.includes('endpoint')) {
        reply = cannedAgentReplies.api;
      } else if (prompt.includes('database') || prompt.includes('sql')) {
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

  // Add secret handler
  const handleAddSecret = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecretKey.trim()) return;
    setSecrets((prev) => [...prev, { key: newSecretKey.toUpperCase().trim(), value: newSecretVal.trim() }]);
    setNewSecretKey('');
    setNewSecretVal('');
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#18191B] text-[#E4E4E7] overflow-hidden select-none">
      {/* Top Workspace Header Bar */}
      <div className="h-[48px] border-b border-[#2D2E32] bg-[#1C1D20] px-300 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-300">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="flex items-center gap-100 px-200 py-100 rounded-6 hover:bg-[#2D2E32] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer border-0 bg-transparent font-brand text-[12px]"
          >
            <span>← Home</span>
          </button>

          <div className="h-[16px] w-[1px] bg-[#2D2E32]" />

          <div className="flex items-center gap-150">
            <span className="text-[16px]">{project.icon}</span>
            <span className="font-brand font-semibold text-[13px] text-white">
              {project.title}
            </span>
            <span className="px-150 py-25 rounded-[4px] bg-[#2D2E32] text-[#A1A1AA] text-[10px] font-brand">
              {project.isPrivate ? 'Private' : 'Public'}
            </span>
          </div>
        </div>

        {/* Center Run Button */}
        <div className="flex items-center gap-200">
          <button
            type="button"
            onClick={handleToggleRun}
            className={`flex items-center gap-150 px-400 py-100 rounded-8 font-brand text-[13px] font-semibold transition-all cursor-pointer border-0 shadow-sm ${
              isRunning
                ? 'bg-[#DC2626] hover:bg-[#B91C1C] text-white'
                : 'bg-[#10B981] hover:bg-[#059669] text-white'
            }`}
          >
            <span>{isRunning ? '⏹ Stop' : '▶ Run'}</span>
          </button>
        </div>

        {/* Right Tab Switchers & Deploy */}
        <div className="flex items-center gap-150">
          <div className="flex items-center bg-[#25262B] p-50 rounded-6">
            <button
              type="button"
              onClick={() => setRightPanelTab('agent')}
              className={`px-250 py-75 rounded-4 font-brand text-[12px] transition-colors cursor-pointer border-0 ${
                rightPanelTab === 'agent' ? 'bg-[#323338] text-white font-medium shadow-xs' : 'text-[#A1A1AA] hover:text-white bg-transparent'
              }`}
            >
              🤖 Agent
            </button>
            <button
              type="button"
              onClick={() => setRightPanelTab('preview')}
              className={`px-250 py-75 rounded-4 font-brand text-[12px] transition-colors cursor-pointer border-0 ${
                rightPanelTab === 'preview' ? 'bg-[#323338] text-white font-medium shadow-xs' : 'text-[#A1A1AA] hover:text-white bg-transparent'
              }`}
            >
              🌐 Preview
            </button>
            <button
              type="button"
              onClick={() => setRightPanelTab('secrets')}
              className={`px-250 py-75 rounded-4 font-brand text-[12px] transition-colors cursor-pointer border-0 ${
                rightPanelTab === 'secrets' ? 'bg-[#323338] text-white font-medium shadow-xs' : 'text-[#A1A1AA] hover:text-white bg-transparent'
              }`}
            >
              🔒 Secrets
            </button>
            <button
              type="button"
              onClick={() => setRightPanelTab('deploy')}
              className={`px-250 py-75 rounded-4 font-brand text-[12px] transition-colors cursor-pointer border-0 ${
                rightPanelTab === 'deploy' ? 'bg-[#323338] text-white font-medium shadow-xs' : 'text-[#A1A1AA] hover:text-white bg-transparent'
              }`}
            >
              🚀 Deploy
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Body Panes */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: File Tree */}
        {showFileTree && (
          <div className="w-[200px] border-r border-[#2D2E32] bg-[#1A1B1E] flex flex-col shrink-0">
            <div className="h-[36px] px-300 flex items-center justify-between border-b border-[#2D2E32] text-[#A1A1AA] text-[11px] font-brand font-semibold uppercase tracking-[0.5px]">
              <span>Files</span>
              <button
                type="button"
                onClick={() => setShowFileTree(false)}
                title="Collapse file tree"
                className="hover:text-white cursor-pointer border-0 bg-transparent"
              >
                ◀
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-150 flex flex-col gap-25">
              {Object.keys(project.files).map((fileName) => {
                const isSelected = fileName === activeFileName;
                return (
                  <button
                    key={fileName}
                    type="button"
                    onClick={() => handleSelectFile(fileName)}
                    className={`flex items-center gap-150 px-300 py-100 text-left font-brand text-[13px] transition-colors cursor-pointer border-0 w-full ${
                      isSelected
                        ? 'bg-[#2A2B30] text-white font-medium'
                        : 'text-[#A1A1AA] hover:bg-[#222327] hover:text-[#D4D4D8] bg-transparent'
                    }`}
                  >
                    <span className="text-[12px]">📄</span>
                    <span className="truncate">{fileName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Center Pane: Editor + Bottom Console */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-[#2D2E32] bg-[#18191B]">
          {/* Editor Tab Bar */}
          <div className="h-[36px] bg-[#1E1F23] border-b border-[#2D2E32] flex items-center px-100 overflow-x-auto gap-100">
            {!showFileTree && (
              <button
                type="button"
                onClick={() => setShowFileTree(true)}
                title="Show files"
                className="p-100 hover:text-white text-[#A1A1AA] cursor-pointer border-0 bg-transparent text-[11px]"
              >
                ▶ Files
              </button>
            )}

            {project.openTabs.map((tab) => {
              const isActive = tab === activeFileName;
              return (
                <div
                  key={tab}
                  onClick={() => handleSelectFile(tab)}
                  className={`flex items-center gap-150 px-250 py-100 rounded-t-6 font-brand text-[12px] cursor-pointer border-t-2 transition-colors ${
                    isActive
                      ? 'bg-[#18191B] border-[#ff3c00] text-white font-medium'
                      : 'border-transparent text-[#A1A1AA] hover:bg-[#25262B] hover:text-white'
                  }`}
                >
                  <span>{tab}</span>
                  <button
                    type="button"
                    onClick={(e) => handleCloseTab(e, tab)}
                    className="hover:text-red-400 cursor-pointer border-0 bg-transparent text-[10px] ml-50"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          {/* Code Editor Area */}
          <div className="flex-1 flex overflow-hidden font-mono text-[13px] leading-[1.6]">
            {/* Line numbers */}
            <div className="w-[44px] bg-[#161719] py-200 select-none text-[#52525B] text-right pr-200 shrink-0">
              {activeContent.split('\n').map((_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>

            {/* Editable code text area */}
            <textarea
              value={activeContent}
              onChange={handleEditorChange}
              spellCheck={false}
              className="flex-1 p-200 bg-transparent text-[#E4E4E7] resize-none focus:outline-none font-mono text-[13px] leading-[1.6] overflow-auto whitespace-pre"
            />
          </div>

          {/* Bottom Console / Terminal Pane */}
          {showConsole && (
            <div className="h-[200px] border-t border-[#2D2E32] bg-[#141517] flex flex-col shrink-0">
              <div className="h-[30px] px-300 flex items-center justify-between border-b border-[#2D2E32] bg-[#1A1B1E]">
                <div className="flex items-center gap-200">
                  <button
                    type="button"
                    onClick={() => setConsoleTab('console')}
                    className={`font-brand text-[11px] font-semibold uppercase tracking-[0.5px] cursor-pointer border-0 bg-transparent ${
                      consoleTab === 'console' ? 'text-white' : 'text-[#71717A] hover:text-white'
                    }`}
                  >
                    Console
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsoleTab('shell')}
                    className={`font-brand text-[11px] font-semibold uppercase tracking-[0.5px] cursor-pointer border-0 bg-transparent ${
                      consoleTab === 'shell' ? 'text-white' : 'text-[#71717A] hover:text-white'
                    }`}
                  >
                    Shell
                  </button>
                </div>

                <div className="flex items-center gap-200">
                  <button
                    type="button"
                    onClick={() => setConsoleLogs([])}
                    className="text-[11px] text-[#71717A] hover:text-white cursor-pointer border-0 bg-transparent"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConsole(false)}
                    className="text-[11px] text-[#71717A] hover:text-white cursor-pointer border-0 bg-transparent"
                  >
                    ▼
                  </button>
                </div>
              </div>

              <div className="flex-1 p-200 overflow-y-auto font-mono text-[12px] text-[#A1A1AA] flex flex-col gap-25">
                {consoleLogs.map((log, idx) => (
                  <div key={idx} className={log.startsWith('>') ? 'text-[#34D399]' : log.startsWith('$') ? 'text-[#60A5FA]' : ''}>
                    {log}
                  </div>
                ))}
              </div>

              {consoleTab === 'shell' && (
                <form onSubmit={handleShellSubmit} className="flex items-center px-200 py-100 border-t border-[#2D2E32] bg-[#18191B]">
                  <span className="text-[#60A5FA] mr-150 font-mono text-[12px]">$</span>
                  <input
                    type="text"
                    value={shellInput}
                    onChange={(e) => setShellInput(e.target.value)}
                    placeholder="Type bash command..."
                    className="flex-1 bg-transparent border-0 text-[#E4E4E7] font-mono text-[12px] focus:outline-none"
                  />
                </form>
              )}
            </div>
          )}

          {!showConsole && (
            <div className="h-[24px] bg-[#1A1B1E] border-t border-[#2D2E32] px-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowConsole(true)}
                className="text-[11px] text-[#71717A] hover:text-white cursor-pointer border-0 bg-transparent"
              >
                ▲ Show Console
              </button>
            </div>
          )}
        </div>

        {/* Right Pane: Split Tabs (Agent, Preview, Secrets, Deploy) */}
        <div className="w-[360px] bg-[#1A1B1E] flex flex-col shrink-0">
          {rightPanelTab === 'agent' && (
            <div className="flex-1 flex flex-col h-full">
              <div className="h-[36px] px-300 flex items-center justify-between border-b border-[#2D2E32] text-white font-brand font-medium text-[13px]">
                <span>🤖 Replit Agent</span>
                <span className="text-[11px] text-[#10B981]">● Online</span>
              </div>

              {/* Chat Message History */}
              <div className="flex-1 overflow-y-auto p-300 flex flex-col gap-300">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-50 max-w-[85%] ${
                      msg.sender === 'user' ? 'self-end' : 'self-start'
                    }`}
                  >
                    <div
                      className={`p-250 rounded-10 font-brand text-[13px] leading-[1.4] ${
                        msg.sender === 'user'
                          ? 'bg-[#ff3c00] text-white'
                          : 'bg-[#26272C] text-[#E4E4E7] border border-[#323338]'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-[#71717A] px-50">{msg.timestamp}</span>
                  </div>
                ))}

                {isAgentTyping && (
                  <div className="self-start p-250 rounded-10 bg-[#26272C] text-[#A1A1AA] text-[12px] font-brand flex items-center gap-150">
                    <span className="animate-spin">⚙️</span>
                    <span>Agent is reviewing workspace...</span>
                  </div>
                )}
              </div>

              {/* Agent Message Input Box */}
              <form onSubmit={handleSendAgentMessage} className="p-200 border-t border-[#2D2E32] bg-[#161719] flex gap-150">
                <input
                  type="text"
                  value={agentInput}
                  onChange={(e) => setAgentInput(e.target.value)}
                  placeholder="Ask Agent to build or fix..."
                  className="flex-1 px-250 py-150 rounded-6 bg-[#25262B] border border-[#323338] text-[13px] text-white placeholder-[#71717A] focus:outline-none focus:border-[#ff3c00]"
                />
                <button
                  type="submit"
                  disabled={!agentInput.trim()}
                  className="px-300 py-150 rounded-6 bg-[#ff3c00] hover:bg-[#e03500] text-white font-brand text-[12px] font-medium transition-colors cursor-pointer border-0 disabled:opacity-40"
                >
                  Send
                </button>
              </form>
            </div>
          )}

          {rightPanelTab === 'preview' && (
            <div className="flex-1 flex flex-col h-full bg-[#18191B]">
              <div className="h-[36px] px-200 bg-[#222327] border-b border-[#2D2E32] flex items-center gap-150 text-[12px]">
                <span className="text-[#A1A1AA]">🌐</span>
                <span className="bg-[#18191B] px-200 py-50 rounded-4 text-[#A1A1AA] text-[11px] truncate flex-1 font-mono">
                  http://0.0.0.0:5000/
                </span>
                <button
                  type="button"
                  onClick={() => alert('Preview reloaded')}
                  className="p-50 text-[#A1A1AA] hover:text-white cursor-pointer border-0 bg-transparent text-[11px]"
                >
                  🔄
                </button>
              </div>

              <div className="flex-1 bg-white p-600 overflow-y-auto text-black">
                <div className="flex flex-col gap-400">
                  <div className="p-400 rounded-8 bg-gray-50 border border-gray-200">
                    <h3 className="m-0 text-xl font-bold text-gray-800">{project.title}</h3>
                    <p className="mt-100 text-sm text-gray-600">{project.description}</p>
                    <div className="mt-200 inline-block px-200 py-50 rounded bg-green-100 text-green-800 text-xs font-semibold">
                      ● Status: Healthy (200 OK)
                    </div>
                  </div>

                  <div className="p-300 rounded-8 bg-blue-50 border border-blue-200 text-sm text-blue-900">
                    <strong>Endpoint:</strong> GET /api/items (2 items available)
                  </div>
                </div>
              </div>
            </div>
          )}

          {rightPanelTab === 'secrets' && (
            <div className="flex-1 flex flex-col p-400 gap-400 overflow-y-auto">
              <h3 className="m-0 font-brand font-semibold text-[15px] text-white">
                Environment Secrets
              </h3>
              <p className="m-0 font-brand text-[12px] text-[#A1A1AA]">
                Encrypted environment variables injected into the workspace process.
              </p>

              <div className="flex flex-col gap-150 mt-100">
                {secrets.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-200 rounded-6 bg-[#25262B] border border-[#323338] text-[12px]">
                    <span className="font-mono text-[#34D399] font-medium">{s.key}</span>
                    <span className="font-mono text-[#71717A]">••••••••</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddSecret} className="flex flex-col gap-200 mt-200 pt-300 border-t border-[#2D2E32]">
                <span className="font-brand font-medium text-[12px] text-white">Add new secret</span>
                <input
                  type="text"
                  value={newSecretKey}
                  onChange={(e) => setNewSecretKey(e.target.value)}
                  placeholder="KEY (e.g. DATABASE_URL)"
                  className="px-250 py-150 rounded-6 bg-[#25262B] border border-[#323338] text-[12px] text-white placeholder-[#71717A] focus:outline-none"
                />
                <input
                  type="password"
                  value={newSecretVal}
                  onChange={(e) => setNewSecretVal(e.target.value)}
                  placeholder="VALUE"
                  className="px-250 py-150 rounded-6 bg-[#25262B] border border-[#323338] text-[12px] text-white placeholder-[#71717A] focus:outline-none"
                />
                <button
                  type="submit"
                  className="mt-100 py-150 px-300 rounded-6 bg-[#ff3c00] text-white font-brand text-[12px] font-medium cursor-pointer border-0"
                >
                  Save secret
                </button>
              </form>
            </div>
          )}

          {rightPanelTab === 'deploy' && (
            <div className="flex-1 flex flex-col p-400 gap-400 overflow-y-auto">
              <h3 className="m-0 font-brand font-semibold text-[15px] text-white">
                Production Deployment
              </h3>
              <div className="p-300 rounded-8 bg-[#25262B] border border-[#323338] flex flex-col gap-200">
                <div className="flex items-center justify-between">
                  <span className="font-brand font-semibold text-[13px] text-white">Autoscale App</span>
                  <span className="px-200 py-50 rounded bg-[#10B981]/20 text-[#10B981] text-[11px] font-bold">
                    ACTIVE
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#A1A1AA] truncate">
                  https://{project.title.toLowerCase()}-alexbuilder.replit.app
                </span>
                <button
                  type="button"
                  onClick={() => alert('Local demo: Deploy is visual-only against local fixtures')}
                  className="mt-100 py-150 rounded-6 bg-[#ff3c00] text-white font-brand text-[12px] font-medium cursor-pointer border-0 text-center"
                >
                  Redeploy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workspace;
