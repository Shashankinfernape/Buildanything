import React, { useState } from 'react';
import { UserProfile } from '../../fixtures/signedInFixtures';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'usage' | 'appearance'>('account');
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      username,
      email
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-400 font-brand select-none">
      <div className="w-full max-w-[680px] bg-[#18191B] text-[#E9EAEA] rounded-16 shadow-2xl border border-[#3E3E41] overflow-hidden flex flex-col h-[540px] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-600 py-350 border-b border-[#2B2B2D] shrink-0 bg-[#151618]">
          <h2 className="m-0 font-brand font-semibold text-[17px] text-white">
            Workspace Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-100 rounded-6 hover:bg-white/10 text-[#9CA3AF] hover:text-white cursor-pointer border-0 bg-transparent text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content Body: Sidebar tabs & Main form */}
        <div className="flex flex-1 min-h-0">
          {/* Settings Left Tabs */}
          <div className="w-[180px] border-r border-[#2B2B2D] p-300 flex flex-col gap-50 bg-[#161718] shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('account')}
              className={`px-300 py-150 rounded-6 text-left text-[13px] font-medium transition-colors cursor-pointer border-0 w-full ${
                activeTab === 'account'
                  ? 'bg-white/10 text-white'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-white/5 bg-transparent'
              }`}
            >
              Account
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('usage')}
              className={`px-300 py-150 rounded-6 text-left text-[13px] font-medium transition-colors cursor-pointer border-0 w-full ${
                activeTab === 'usage'
                  ? 'bg-white/10 text-white'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-white/5 bg-transparent'
              }`}
            >
              Usage & Billing
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('appearance')}
              className={`px-300 py-150 rounded-6 text-left text-[13px] font-medium transition-colors cursor-pointer border-0 w-full ${
                activeTab === 'appearance'
                  ? 'bg-white/10 text-white'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-white/5 bg-transparent'
              }`}
            >
              Appearance
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-600 bg-[#18191B]">
            {activeTab === 'account' && (
              <form onSubmit={handleSave} className="flex flex-col gap-500 max-w-[420px]">
                <h3 className="m-0 text-[15px] font-semibold text-white">
                  Profile Information
                </h3>

                <div className="flex flex-col gap-100">
                  <label className="text-[12px] font-medium text-[#9CA3AF]">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-300 py-150 rounded-6 bg-[#252627] border border-[#3E3E41] text-[13px] text-white outline-none focus:border-white/40"
                  />
                </div>

                <div className="flex flex-col gap-100">
                  <label className="text-[12px] font-medium text-[#9CA3AF]">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="px-300 py-150 rounded-6 bg-[#252627] border border-[#3E3E41] text-[13px] text-white outline-none focus:border-white/40"
                  />
                </div>

                <div className="flex flex-col gap-100">
                  <label className="text-[12px] font-medium text-[#9CA3AF]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-300 py-150 rounded-6 bg-[#252627] border border-[#3E3E41] text-[13px] text-white outline-none focus:border-white/40"
                  />
                </div>

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
                    className="px-400 py-150 rounded-6 bg-[#ff3c00] hover:bg-[#e03500] text-white text-[13px] font-medium cursor-pointer border-0 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'usage' && (
              <div className="flex flex-col gap-500">
                <div>
                  <h3 className="m-0 text-[15px] font-semibold text-white">
                    Agent Credits & Compute
                  </h3>
                  <p className="m-0 mt-50 text-[12px] text-[#9CA3AF]">
                    Monthly usage for Agent generations, cloud instances, and deployments.
                  </p>
                </div>

                <div className="p-400 rounded-8 bg-[#252627] border border-[#3E3E41] flex flex-col gap-300">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-medium text-white">Current Plan: {user.plan}</span>
                    <span className="text-[11px] bg-[#ff3c00]/20 text-[#ff3c00] px-200 py-25 rounded-full font-bold">
                      ACTIVE
                    </span>
                  </div>

                  <div className="flex flex-col gap-100">
                    <div className="flex justify-between text-xs text-[#9CA3AF]">
                      <span>Agent Credits Used</span>
                      <span>{user.totalCredits - user.creditsRemaining} / {user.totalCredits}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-[#ff3c00] rounded-full transition-all"
                        style={{ width: `${((user.totalCredits - user.creditsRemaining) / user.totalCredits) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-400 border-t border-[#2B2B2D]">
                  <span className="text-xs text-[#9CA3AF]">Need more compute?</span>
                  <button
                    type="button"
                    className="px-300 py-150 rounded-6 bg-white/10 hover:bg-white/15 text-xs font-medium text-white cursor-pointer border-0 transition-colors"
                  >
                    Upgrade Plan
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="flex flex-col gap-500">
                <div>
                  <h3 className="m-0 text-[15px] font-semibold text-white">Theme & Display</h3>
                  <p className="m-0 mt-50 text-[12px] text-[#9CA3AF]">
                    Choose your preferred Replit workspace theme.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-300">
                  <div
                    onClick={() => setTheme('dark')}
                    className={`p-400 rounded-8 border cursor-pointer flex flex-col gap-200 transition-all ${
                      theme === 'dark' ? 'border-[#ff3c00] bg-[#252627]' : 'border-[#3E3E41] bg-[#161718]'
                    }`}
                  >
                    <div className="w-full h-[60px] rounded-4 bg-[#1E1E1F] border border-white/10 flex items-center justify-center text-xs text-[#9CA3AF]">
                      Dark (Default)
                    </div>
                    <span className="text-[13px] font-medium text-white">Replit Dark</span>
                  </div>

                  <div
                    onClick={() => setTheme('light')}
                    className={`p-400 rounded-8 border cursor-pointer flex flex-col gap-200 transition-all ${
                      theme === 'light' ? 'border-[#ff3c00] bg-[#252627]' : 'border-[#3E3E41] bg-[#161718]'
                    }`}
                  >
                    <div className="w-full h-[60px] rounded-4 bg-[#FAF6F1] border border-black/10 flex items-center justify-center text-xs text-[#666D79]">
                      Light Mode
                    </div>
                    <span className="text-[13px] font-medium text-white">Warm Light</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
