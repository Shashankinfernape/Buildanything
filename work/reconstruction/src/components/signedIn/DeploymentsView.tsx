import React from 'react';
import { DeploymentItem } from '../../fixtures/signedInFixtures';

interface DeploymentsViewProps {
  deployments: DeploymentItem[];
  onOpenProject: (projectId: string) => void;
}

export const DeploymentsView: React.FC<DeploymentsViewProps> = ({
  deployments,
  onOpenProject
}) => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#1E1E1F] min-h-screen text-[#E9EAEA] p-600 flex flex-col items-center font-brand select-none">
      <div className="w-full max-w-[1000px] flex flex-col gap-600">
        <div className="flex items-center justify-between border-b border-[#2B2B2D] pb-400">
          <div>
            <h1 className="m-0 font-brand text-[28px] font-semibold text-white tracking-tight">
              Deployments
            </h1>
            <p className="m-0 mt-50 font-brand text-[13px] text-[#9CA3AF]">
              Live production services and web applications hosted on Replit infrastructure.
            </p>
          </div>
        </div>

        <div className="flex flex-col bg-[#252627] rounded-12 border border-[#3E3E41] divide-y divide-[#3E3E41]/60 shadow-sm">
          {deployments.map((dep) => (
            <div key={dep.id} className="p-400 flex items-center justify-between hover:bg-[#2A2B2D] transition-colors">
              <div className="flex items-center gap-300">
                <div className="w-[36px] h-[36px] rounded-8 bg-[#10B981]/20 text-[#10B981] flex items-center justify-center text-[18px]">
                  🚀
                </div>
                <div className="flex flex-col">
                  <span className="font-brand font-semibold text-[14px] text-white">
                    {dep.projectName}
                  </span>
                  <a
                    href={dep.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[12px] text-[#ff3c00] hover:underline"
                  >
                    {dep.url}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-500">
                <div className="flex flex-col text-right">
                  <span className="text-[11px] text-[#9CA3AF]">Specs</span>
                  <span className="font-mono text-[12px] text-white">{dep.cpu} • {dep.memory}</span>
                </div>

                <div className="flex items-center gap-150 bg-[#10B981]/20 text-[#10B981] px-250 py-100 rounded-full text-xs font-semibold">
                  <span className="w-150 h-150 rounded-full bg-[#10B981] animate-pulse" />
                  <span>{dep.status}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenProject(dep.projectId)}
                  className="px-300 py-150 rounded-6 bg-white/10 hover:bg-white/15 text-xs font-medium text-white cursor-pointer border-0 transition-colors"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
