import React, { useState } from 'react';
import { TeamMember } from '../../fixtures/signedInFixtures';

interface TeamsViewProps {
  members: TeamMember[];
  onAddMember: (member: TeamMember) => void;
}

export const TeamsView: React.FC<TeamsViewProps> = ({ members, onAddMember }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Member' | 'Admin'>('Member');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const namePart = inviteEmail.split('@')[0];
    const initials = namePart.slice(0, 2).toUpperCase();
    onAddMember({
      id: `tm_${Date.now()}`,
      name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
      email: inviteEmail.trim(),
      role: inviteRole,
      initials
    });
    setInviteEmail('');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#1E1E1F] min-h-screen text-[#E9EAEA] p-600 flex flex-col items-center font-brand select-none">
      <div className="w-full max-w-[1000px] flex flex-col gap-600">
        <div className="flex items-center justify-between border-b border-[#2B2B2D] pb-400">
          <div>
            <h1 className="m-0 font-brand text-[28px] font-semibold text-white tracking-tight">
              Teams & Collaborators
            </h1>
            <p className="m-0 mt-50 font-brand text-[13px] text-[#9CA3AF]">
              Share repls, manage permissions, and pair-program in real-time.
            </p>
          </div>
        </div>

        {/* Invite Form */}
        <form onSubmit={handleInvite} className="p-400 bg-[#252627] rounded-12 border border-[#3E3E41] flex items-center gap-300 shadow-sm">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@example.com"
            className="flex-1 px-300 py-150 rounded-8 bg-[#18191B] border border-[#3E3E41] text-[13px] text-white placeholder:text-[#6B7280] focus:outline-none focus:border-white/40"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as 'Member' | 'Admin')}
            className="px-300 py-150 rounded-8 bg-[#18191B] border border-[#3E3E41] text-[13px] text-white focus:outline-none cursor-pointer"
          >
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
          <button
            type="submit"
            className="px-400 py-150 rounded-8 bg-[#ff3c00] hover:bg-[#e03500] text-white font-brand text-[13px] font-medium transition-colors cursor-pointer border-0 shadow-sm"
          >
            Invite
          </button>
        </form>

        {/* Members List */}
        <div className="flex flex-col bg-[#252627] rounded-12 border border-[#3E3E41] divide-y divide-[#3E3E41]/60 shadow-sm">
          {members.map((member) => (
            <div key={member.id} className="p-400 flex items-center justify-between hover:bg-[#2A2B2D] transition-colors">
              <div className="flex items-center gap-300">
                <div className="w-[36px] h-[36px] rounded-full bg-[#ff3c00]/20 border border-[#ff3c00]/40 text-[#ff3c00] flex items-center justify-center font-bold text-xs">
                  {member.initials}
                </div>
                <div className="flex flex-col">
                  <span className="font-brand font-semibold text-[14px] text-white">
                    {member.name}
                  </span>
                  <span className="font-brand text-[12px] text-[#9CA3AF]">
                    {member.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-300">
                <span className="text-[11px] font-mono px-200 py-50 rounded-4 bg-white/10 text-white">
                  {member.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
