import React, { useState } from 'react';
import { Sparkles, Check } from '../icons';
import cmsData from '../../../analysis/cms-fixtures.json';

export const BentoSection: React.FC = () => {
  const [activeMode, setActiveMode] = useState<string>('power');

  const bento = cmsData.bento;

  return (
    <section className="py-24 px-6 max-w-[1240px] mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          {bento.headline}
        </h2>
        <p className="text-base sm:text-lg text-[#9da7be] leading-relaxed">
          {bento.subheadline}
        </p>

        {/* Mode Selector Pill Switcher */}
        <div className="inline-flex items-center p-1 mt-8 rounded-xl bg-[#141b2b] border border-[#263044]">
          {bento.modes.map((mode) => {
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`relative px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#232c40] text-white shadow-md'
                    : 'text-[#8792ab] hover:text-white'
                }`}
              >
                <span>{mode.label}</span>
                {mode.badge && (
                  <span className="ml-1.5 text-[9px] px-1 py-0.5 rounded bg-[#f26207]/20 text-[#f26207] border border-[#f26207]/30 uppercase">
                    {mode.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Left Card: Sarah Interactive Chat Preview */}
        <div className="md:col-span-7 bg-[#141b2b] border border-[#263044] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#33415c] transition-colors relative overflow-hidden group">
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#f26207] bg-[#f26207]/10 px-2.5 py-1 rounded-md border border-[#f26207]/20">
                Agent Workflow
              </span>
              <span className="text-xs text-[#717d98]">Active Mode: <strong className="text-white capitalize">{activeMode}</strong></span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              Full-Stack Agent with Sarah
            </h3>
            <p className="text-sm text-[#9da7be] leading-relaxed">
              Communicate contextually with an AI agent that configures dependencies, builds components, and runs migrations automatically.
            </p>
          </div>

          {/* Interactive Sarah Chat Simulated Box */}
          <div className="bg-[#0b101c] rounded-xl p-4 border border-[#1f2738] space-y-3 font-sans text-xs">
            {bento.sarahConversation.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'sarah' && (
                  <img
                    src="/assets/47173c6a3713_sarah-avatar.png"
                    alt="Sarah Avatar"
                    className="w-7 h-7 rounded-full border border-[#2b354d] object-cover flex-shrink-0"
                  />
                )}
                <div
                  className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#1e273a] text-white border border-[#2b354d]'
                      : 'bg-[#161f30] text-[#c2c9d6] border border-[#232c40]'
                  }`}
                >
                  {msg.sender === 'sarah' && (
                    <div className="text-[10px] font-bold text-[#f26207] mb-1 flex items-center space-x-1">
                      <span>Sarah (Replit Agent)</span>
                      <Sparkles size={10} />
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Top Card: Create without token costs */}
        <div className="md:col-span-5 bg-[#141b2b] border border-[#263044] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#33415c] transition-colors">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#38bdf8] bg-[#38bdf8]/10 px-2.5 py-1 rounded-md border border-[#38bdf8]/20">
              {bento.cards[0].tag}
            </span>
            <h3 className="text-xl font-bold text-white mt-4 mb-2">
              {bento.cards[0].title}
            </h3>
            <p className="text-sm text-[#9da7be] leading-relaxed">
              {bento.cards[0].description}
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-[#1f2738] flex items-center justify-between text-xs text-[#717d98]">
            <span className="flex items-center space-x-1.5 text-[#38bdf8]">
              <Check size={14} />
              <span>Unlimited iterations included</span>
            </span>
            <span className="font-mono text-white">0 / tokens billed</span>
          </div>
        </div>

        {/* Bottom Left Card: Infinite Canvas */}
        <div className="md:col-span-6 bg-[#141b2b] border border-[#263044] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#33415c] transition-colors">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#a855f7] bg-[#a855f7]/10 px-2.5 py-1 rounded-md border border-[#a855f7]/20">
              {bento.cards[2].tag}
            </span>
            <h3 className="text-xl font-bold text-white mt-4 mb-2">
              {bento.cards[2].title}
            </h3>
            <p className="text-sm text-[#9da7be] leading-relaxed">
              {bento.cards[2].description}
            </p>
          </div>
          <div className="mt-6 rounded-lg bg-[#0b101c] p-3 border border-[#1f2738] flex items-center justify-around text-xs font-mono text-[#8792ab]">
            <span className="text-white">Canvas Active</span>
            <span>•</span>
            <span className="text-[#a855f7]">Multi-file sync</span>
            <span>•</span>
            <span>Live DOM Inspector</span>
          </div>
        </div>

        {/* Bottom Right Card: Intelligent model routing */}
        <div className="md:col-span-6 bg-[#141b2b] border border-[#263044] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#33415c] transition-colors">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#22c55e] bg-[#22c55e]/10 px-2.5 py-1 rounded-md border border-[#22c55e]/20">
              {bento.cards[3].tag}
            </span>
            <h3 className="text-xl font-bold text-white mt-4 mb-2">
              {bento.cards[3].title}
            </h3>
            <p className="text-sm text-[#9da7be] leading-relaxed">
              {bento.cards[3].description}
            </p>
          </div>
          <div className="mt-6 flex items-center space-x-2 text-xs">
            <span className="px-3 py-1.5 rounded-md bg-[#1d2538] text-white border border-[#2b354d] font-mono">
              Claude 3.5 Sonnet
            </span>
            <span className="px-3 py-1.5 rounded-md bg-[#1d2538] text-white border border-[#2b354d] font-mono">
              GPT-4o
            </span>
            <span className="px-3 py-1.5 rounded-md bg-[#1d2538] text-white border border-[#2b354d] font-mono">
              DeepSeek
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
