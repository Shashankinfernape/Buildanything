import React, { useState } from 'react';
import { initialIntegrations, IntegrationItem } from '../../fixtures/signedInFixtures';

export const IntegrationsView: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(initialIntegrations);

  const handleToggle = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isConnected: !item.isConnected } : item
      )
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#1E1E1F] min-h-screen text-[#E9EAEA] p-600 flex flex-col items-center font-brand select-none">
      <div className="w-full max-w-[1000px] flex flex-col gap-600">
        <div className="flex items-center justify-between border-b border-[#2B2B2D] pb-400">
          <div>
            <h1 className="m-0 font-brand text-[28px] font-semibold text-white tracking-tight">
              Integrations
            </h1>
            <p className="m-0 mt-50 font-brand text-[13px] text-[#9CA3AF]">
              Connect third-party tools, databases, and deployment webhooks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-400">
          {integrations.map((item) => (
            <div
              key={item.id}
              className="p-500 rounded-12 bg-[#252627] border border-[#3E3E41] flex flex-col justify-between gap-400 shadow-sm hover:border-[#52545A] transition-all"
            >
              <div className="flex items-start gap-300">
                <div className="text-[32px] p-150 rounded-8 bg-white/5 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div className="flex flex-col gap-50">
                  <div className="flex items-center gap-200">
                    <span className="font-brand font-semibold text-[15px] text-white">
                      {item.name}
                    </span>
                    <span className="px-150 py-25 rounded-[4px] bg-white/10 text-[#D1D5DB] text-[10px] font-brand">
                      {item.category}
                    </span>
                  </div>
                  <p className="m-0 font-brand text-[12px] text-[#9CA3AF] leading-[1.4]">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-300 border-t border-[#3E3E41]/60">
                <span className="text-[11px] font-mono text-[#9CA3AF]">
                  Status: {item.isConnected ? (
                    <span className="text-[#10B981] font-semibold">Connected</span>
                  ) : (
                    <span className="text-[#9CA3AF]">Not configured</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggle(item.id)}
                  className={`px-300 py-100 rounded-6 text-xs font-medium cursor-pointer border-0 transition-colors ${
                    item.isConnected
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  {item.isConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
