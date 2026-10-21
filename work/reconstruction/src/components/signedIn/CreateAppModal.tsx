import React, { useState } from 'react';
import { ProjectItem } from '../../fixtures/signedInFixtures';

interface CreateAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: ProjectItem) => void;
  initialTemplate?: string;
}

const templates = [
  { id: 'python', name: 'Python Flask', icon: '🐍', language: 'Python', ext: 'main.py', defaultCode: 'from flask import Flask\napp = Flask(__name__)\n\n@app.route("/")\ndef hello():\n    return "Hello from Replit!"\n\nif __name__ == "__main__":\n    app.run(port=5000)\n' },
  { id: 'react', name: 'React + Vite', icon: '⚛️', language: 'TypeScript', ext: 'App.tsx', defaultCode: 'export default function App() {\n  return <h1>Hello from React!</h1>;\n}\n' },
  { id: 'node', name: 'Node.js Express', icon: '🟢', language: 'Node.js', ext: 'index.js', defaultCode: 'const express = require("express");\nconst app = express();\napp.get("/", (req, res) => res.send("Hello World"));\napp.listen(3000);\n' },
  { id: 'html', name: 'HTML, CSS, JS', icon: '🌐', language: 'HTML/CSS', ext: 'index.html', defaultCode: '<!DOCTYPE html>\n<html>\n  <head><title>Replit App</title></head>\n  <body><h1>Hello World</h1></body>\n</html>\n' }
];

export const CreateAppModal: React.FC<CreateAppModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  initialTemplate
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(
    initialTemplate
      ? templates.find(t => t.name.toLowerCase().includes(initialTemplate.toLowerCase()))?.id || 'python'
      : 'python'
  );
  const [projectName, setProjectName] = useState('NewProject');
  const [isPrivate, setIsPrivate] = useState(true);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const tmpl = templates.find((t) => t.id === selectedTemplate) || templates[0];
    const newProject: ProjectItem = {
      id: `proj_${Date.now()}`,
      title: projectName.trim() || 'UntitledProject',
      description: `Created from ${tmpl.name} template`,
      language: tmpl.language,
      icon: tmpl.icon,
      updatedAt: 'Just now',
      isPrivate,
      activeFile: tmpl.ext,
      openTabs: [tmpl.ext, 'README.md'],
      files: {
        [tmpl.ext]: tmpl.defaultCode,
        'README.md': `# ${projectName.trim() || 'UntitledProject'}\n\nA fresh ${tmpl.name} application.\n`
      }
    };
    onCreate(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-400 font-brand select-none">
      <div className="w-full max-w-[540px] bg-[#18191B] text-[#E9EAEA] rounded-16 shadow-2xl border border-[#3E3E41] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-600 py-400 border-b border-[#2B2B2D] bg-[#151618]">
          <h2 className="m-0 font-brand font-semibold text-[17px] text-white">
            Create a Project
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-100 rounded-6 hover:bg-white/10 text-[#9CA3AF] hover:text-white cursor-pointer border-0 bg-transparent text-sm"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleCreate} className="p-600 flex flex-col gap-500">
          {/* Template Choice */}
          <div className="flex flex-col gap-200">
            <label className="text-[12px] font-medium text-[#9CA3AF]">
              Template
            </label>
            <div className="grid grid-cols-2 gap-200">
              {templates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`p-300 rounded-8 border text-left flex items-center gap-200 transition-all cursor-pointer ${
                    selectedTemplate === tmpl.id
                      ? 'border-[#ff3c00] bg-[#252627]'
                      : 'border-[#3E3E41] bg-[#161718] hover:bg-[#202123]'
                  }`}
                >
                  <span className="text-[20px]">{tmpl.icon}</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-medium text-white truncate">
                      {tmpl.name}
                    </span>
                    <span className="text-[11px] text-[#9CA3AF] font-mono">
                      {tmpl.language}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Project Title */}
          <div className="flex flex-col gap-100">
            <label className="text-[12px] font-medium text-[#9CA3AF]">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. MyAwesomeApp"
              className="px-300 py-150 rounded-6 bg-[#252627] border border-[#3E3E41] text-[13px] text-white outline-none focus:border-white/40"
              required
            />
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center justify-between p-300 rounded-8 bg-[#252627] border border-[#3E3E41]">
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-white">Private Project</span>
              <span className="text-[11px] text-[#9CA3AF]">Only you and invited collaborators can view</span>
            </div>
            <button
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className={`w-[40px] h-[22px] rounded-full p-[2px] transition-colors cursor-pointer border-0 ${
                isPrivate ? 'bg-[#ff3c00]' : 'bg-[#3E3E41]'
              }`}
            >
              <div
                className={`w-[18px] h-[18px] rounded-full bg-white transition-transform ${
                  isPrivate ? 'translate-x-[18px]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-200 pt-400 border-t border-[#2B2B2D]">
            <button
              type="button"
              onClick={onClose}
              className="px-300 py-150 rounded-6 hover:bg-white/5 text-[13px] text-[#9CA3AF] hover:text-white cursor-pointer border-0 bg-transparent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-400 py-150 rounded-6 bg-[#ff3c00] hover:bg-[#e03500] text-white text-[13px] font-medium cursor-pointer border-0 transition-colors shadow-sm"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
