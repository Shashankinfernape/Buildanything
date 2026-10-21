import React, { useState } from 'react';

export function PricingSection() {
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const isYearly = period === 'yearly';

  return (
    <div
      data-analytics-id="pricing_showcase_section"
      className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start shrink-0 items-center py-1600 px-800"
    >
      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-1200 w-full font-brand max-w-[var(--marketing-surface-max-width,1390px)]">
        {/* Header row: Title + Segmented Control */}
        <div
          style={{ width: '100%' }}
          className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row justify-between items-logical-end gap-600 flex-wrap"
        >
          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-logical-start gap-400 shrink">
            <h2 className="leading-none text-[#191818] text-[64px] font-[400] [letter-spacing:-.06em] [@media_screen_and_(width<=768px)]:text-[40px]">
              Start Small. Scale Fast.
            </h2>
            <p className="max-w-[420px] text-[#6f6c6a] text-[18px] leading-[1.5]">
              Experience the power of Replit's generous free mode, and upgrade when you're ready to scale.
            </p>
          </div>

          {/* Segmented Control */}
          <fieldset
            data-ruic="SegmentedControl"
            className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start items-stretch shrink-0 relative group/button-group flex-row w-fit gap-0 rounded-8 p-100 bg-[#eae5df]"
          >
            <div
              aria-hidden="true"
              className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 absolute inset-0 rounded-8 _sdz_surface-2 bg-surface"
            />

            {/* Monthly Option */}
            <label
              data-ruic="SegmentedControlItem"
              onClick={() => setPeriod('monthly')}
              className={`relative flex flex-row items-center justify-center grow gap-50 min-w-0 min-h-0 appearance-none border-0 border-solid border-transparent transition-background-color duration-snappy ease-snappy select-none cursor-pointer h-800 rounded-8 px-400 py-200 whitespace-nowrap text-[#6f6c6a] ${
                !isYearly
                  ? 'shadow-control bg-surface inset-ring inset-ring-surface-border-strong text-(--foreground-default)!'
                  : 'text-(--foreground-dimmest)! _sdz_surface-2'
              }`}
            >
              <div
                style={{
                  border: 0,
                  clip: 'rect(0 0 0 0)',
                  clipPath: 'inset(50%)',
                  height: '1px',
                  margin: '-1px',
                  overflow: 'hidden',
                  padding: 0,
                  position: 'absolute',
                  width: '1px',
                  whiteSpace: 'nowrap'
                }}
              >
                <input
                  data-ruic="SegmentedControlItem"
                  id="monthly"
                  name="pricing-showcase-period"
                  type="radio"
                  checked={!isYearly}
                  onChange={() => setPeriod('monthly')}
                  value="monthly"
                />
              </div>
              <span className="flex min-w-0 items-center gap-200 px-100 text-label-l-control">
                <span className="min-w-0 grow truncate text-left">Monthly</span>
              </span>
            </label>

            {/* Yearly Option */}
            <label
              data-ruic="SegmentedControlItem"
              onClick={() => setPeriod('yearly')}
              className={`relative flex flex-row items-center justify-center grow gap-50 min-w-0 min-h-0 appearance-none border-0 border-solid border-transparent transition-background-color duration-snappy ease-snappy select-none cursor-pointer h-800 rounded-8 px-400 py-200 whitespace-nowrap text-[#6f6c6a] ${
                isYearly
                  ? 'shadow-control bg-surface inset-ring inset-ring-surface-border-strong text-(--foreground-default)!'
                  : 'text-(--foreground-dimmest)! _sdz_surface-2'
              }`}
            >
              <div
                style={{
                  border: 0,
                  clip: 'rect(0 0 0 0)',
                  clipPath: 'inset(50%)',
                  height: '1px',
                  margin: '-1px',
                  overflow: 'hidden',
                  padding: 0,
                  position: 'absolute',
                  width: '1px',
                  whiteSpace: 'nowrap'
                }}
              >
                <input
                  data-ruic="SegmentedControlItem"
                  id="yearly"
                  name="pricing-showcase-period"
                  type="radio"
                  checked={isYearly}
                  onChange={() => setPeriod('yearly')}
                  value="yearly"
                />
              </div>
              <span className="flex min-w-0 items-center gap-200 px-100 text-label-l-control">
                <span className="min-w-0 grow truncate text-left">
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-150">
                    <span>Yearly</span>
                    <span className="text-[#ff3c00] text-[13px]">Save 10%</span>
                  </div>
                </span>
              </span>
            </label>
          </fieldset>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid w-full grid-cols-1 gap-400 tablet-min:grid-cols-2 tablet-max:grid-cols-4">
          {/* Card 1: Starter */}
          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 h-full">
            <div className="flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-400 h-full rounded-24 border px-600 py-700 border-[#ff3c00] bg-[#fff] text-[#191818]">
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row justify-between items-center gap-200">
                <span className="text-[#6f6c6a] text-[14px]">Starter</span>
              </div>
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row items-center gap-200 min-h-1100">
                <span className="text-[#191818] text-[40px] leading-[1.1] [letter-spacing:-.03em]">$0</span>
              </div>
              <span className="text-[#6f6c6a] text-[14px] leading-[1.5]">
                For exploring what's possible with our new generative tools.
              </span>
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-300 pb-400 grow">
                {/* Lead item */}
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-logical-start gap-200">
                  <span className="mt-50 flex shrink-0 items-center text-[#6f6c6a]">
                    <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 4.25a.75.75 0 0 1 .75.75v6.25H19a.75.75 0 0 1 0 1.5h-6.25V19a.75.75 0 0 1-1.5 0v-6.25H5a.75.75 0 0 1 0-1.5h6.25V5a.75.75 0 0 1 .75-.75" />
                    </svg>
                  </span>
                  <span className="text-[#312e2e] text-[14px] leading-[1.4]">Explore what's possible:</span>
                </div>
                {/* Benefits */}
                {[
                  'Free daily usage',
                  'Create anything from slides to apps',
                  'Built-in database',
                  'Publish 1 live project',
                  'Run one background task at a time'
                ].map((b) => (
                  <div key={b} className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-logical-start gap-200">
                    <span className="mt-50 flex shrink-0 items-center text-[#6f6c6a]">
                      <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M20.53 5.47a.75.75 0 0 1 0 1.06l-11 11a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 1 1 1.06-1.06L9 15.94 19.47 5.47a.75.75 0 0 1 1.06 0" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-[#312e2e] text-[14px] leading-[1.4]">{b}</span>
                  </div>
                ))}
              </div>
              <a
                className="flex items-center justify-center gap-200 rounded-8 px-600 py-300 text-center no-underline bg-[#ff3c00] text-[#fff] hover:bg-[#e63600] hover:border-[#e63600] hover:text-[#fff] border-[1.5px] border-[#ff3c00] text-[15px] [transition:background-color_.15s_ease,color_.15s_ease]"
                href="/signup"
                data-analytics-id="pricing_showcase_free_cta"
              >
                <span>Start for free</span>
                <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.53 11.47a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 1 1-1.06-1.06l5.72-5.72H5a.75.75 0 0 1 0-1.5h12.19l-5.72-5.72a.75.75 0 0 1 1.06-1.06z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Card 2: Replit Core */}
          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 h-full">
            <div className="flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-400 h-full rounded-24 border px-600 py-700 border-transparent bg-[#fff] text-[#191818]">
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row justify-between items-center gap-200">
                <span className="text-[#6f6c6a] text-[14px]">Replit Core</span>
              </div>
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row items-center gap-200 min-h-1100">
                {isYearly && <s className="text-[#a8a29c] text-[16px]">$20</s>}
                <span className="text-[#191818] text-[40px] leading-[1.1] [letter-spacing:-.03em]">
                  {isYearly ? '$18' : '$20'}
                </span>
                <span className="flex flex-col gap-50 text-[#6f6c6a] text-[12px] leading-[1.2]">
                  <span>per month</span>
                  {isYearly && <span>billed annually</span>}
                </span>
              </div>
              <span className="text-[#6f6c6a] text-[14px] leading-[1.5]">
                For personal projects and simple apps.
              </span>
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-300 pb-400 grow">
                {/* Lead item */}
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-logical-start gap-200">
                  <span className="mt-50 flex shrink-0 items-center text-[#6f6c6a]">
                    <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 4.25a.75.75 0 0 1 .75.75v6.25H19a.75.75 0 0 1 0 1.5h-6.25V19a.75.75 0 0 1-1.5 0v-6.25H5a.75.75 0 0 1 0-1.5h6.25V5a.75.75 0 0 1 .75-.75" />
                    </svg>
                  </span>
                  <span className="text-[#312e2e] text-[14px] leading-[1.4]">Everything in Starter plus:</span>
                </div>
                {/* Benefits */}
                {[
                  'More free agent usage',
                  '$20 towards more powerful models',
                  'Plan mode',
                  'Unlimited workspaces',
                  'Remove "Made with Replit" badge'
                ].map((b) => (
                  <div key={b} className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-logical-start gap-200">
                    <span className="mt-50 flex shrink-0 items-center text-[#6f6c6a]">
                      <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M20.53 5.47a.75.75 0 0 1 0 1.06l-11 11a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 1 1 1.06-1.06L9 15.94 19.47 5.47a.75.75 0 0 1 1.06 0" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-[#312e2e] text-[14px] leading-[1.4]">{b}</span>
                  </div>
                ))}
              </div>
              <a
                className="flex items-center justify-center gap-200 rounded-8 px-600 py-300 text-center no-underline text-[#ff3c00] hover:bg-[#ff3c00] hover:text-[#fff] border-[1.5px] border-[#ff3c00] text-[15px] [transition:background-color_.15s_ease,color_.15s_ease]"
                href="/signup?plan=core"
                data-analytics-id="pricing_showcase_core_cta"
              >
                Join Replit Core
              </a>
            </div>
          </div>

          {/* Card 3: Replit Pro */}
          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 h-full">
            <div className="flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-400 h-full rounded-24 border px-600 py-700 border-transparent bg-[#fff] text-[#191818]">
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row justify-between items-center gap-200">
                <span className="text-[#6f6c6a] text-[14px]">Replit Pro</span>
                {isYearly && (
                  <span className="rounded-8 px-250 py-100 whitespace-nowrap bg-[#ffe1d6] text-[#ff3c00] text-[13px]">
                    Save $120
                  </span>
                )}
              </div>
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row items-center gap-200 min-h-1100">
                {isYearly && <s className="text-[#a8a29c] text-[16px]">$100</s>}
                <span className="text-[#191818] text-[40px] leading-[1.1] [letter-spacing:-.03em]">
                  {isYearly ? '$90' : '$100'}
                </span>
                <span className="flex flex-col gap-50 text-[#6f6c6a] text-[12px] leading-[1.2]">
                  <span>per month</span>
                  {isYearly && <span>billed annually</span>}
                </span>
              </div>
              <span className="text-[#6f6c6a] text-[14px] leading-[1.5]">
                For commercial and professional builds.
              </span>
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-300 pb-400 grow">
                {/* Lead item */}
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-logical-start gap-200">
                  <span className="mt-50 flex shrink-0 items-center text-[#6f6c6a]">
                    <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 4.25a.75.75 0 0 1 .75.75v6.25H19a.75.75 0 0 1 0 1.5h-6.25V19a.75.75 0 0 1-1.5 0v-6.25H5a.75.75 0 0 1 0-1.5h6.25V5a.75.75 0 0 1 .75-.75" />
                    </svg>
                  </span>
                  <span className="text-[#312e2e] text-[14px] leading-[1.4]">Everything in Core plus:</span>
                </div>
                {/* Benefits */}
                {[
                  'Even more free agent usage',
                  '$100 towards most powerful models',
                  'Up to 15 collaborators',
                  'Invite up to 50 viewers',
                  'Database rollback up to 28 days'
                ].map((b) => (
                  <div key={b} className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-logical-start gap-200">
                    <span className="mt-50 flex shrink-0 items-center text-[#6f6c6a]">
                      <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M20.53 5.47a.75.75 0 0 1 0 1.06l-11 11a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 1 1 1.06-1.06L9 15.94 19.47 5.47a.75.75 0 0 1 1.06 0" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-[#312e2e] text-[14px] leading-[1.4]">{b}</span>
                  </div>
                ))}
              </div>
              <a
                className="flex items-center justify-center gap-200 rounded-8 px-600 py-300 text-center no-underline text-[#ff3c00] hover:bg-[#ff3c00] hover:text-[#fff] border-[1.5px] border-[#ff3c00] text-[15px] [transition:background-color_.15s_ease,color_.15s_ease]"
                href="/signup?plan=pro"
                data-analytics-id="pricing_showcase_pro_cta"
              >
                Join Replit Pro
              </a>
            </div>
          </div>

          {/* Card 4: Enterprise */}
          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 h-full">
            <div className="flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-400 h-full rounded-24 border px-600 py-700 border-transparent bg-[#fff] text-[#191818]">
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row justify-between items-center gap-200">
                <span className="text-[#6f6c6a] text-[14px]">Enterprise</span>
              </div>
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row items-center gap-200 min-h-1100">
                <span className="text-[#191818] text-[40px] leading-[1.1] [letter-spacing:-.03em]">Custom</span>
              </div>
              <span className="text-[#6f6c6a] text-[14px] leading-[1.5]">
                For enterprise-grade security & controls.
              </span>
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-300 pb-400 grow">
                {[
                  'SSO, SCIM & audit logs',
                  'Advanced privacy controls',
                  'Centralized security management',
                  'Single-tenant & private networking options',
                  'Dedicated premium support'
                ].map((b) => (
                  <div key={b} className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-logical-start gap-200">
                    <span className="mt-50 flex shrink-0 items-center text-[#6f6c6a]">
                      <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M20.53 5.47a.75.75 0 0 1 0 1.06l-11 11a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 1 1 1.06-1.06L9 15.94 19.47 5.47a.75.75 0 0 1 1.06 0" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-[#312e2e] text-[14px] leading-[1.4]">{b}</span>
                  </div>
                ))}
                {/* and much more with plus */}
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-logical-start gap-200">
                  <span className="mt-50 flex shrink-0 items-center text-[#6f6c6a]">
                    <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 4.25a.75.75 0 0 1 .75.75v6.25H19a.75.75 0 0 1 0 1.5h-6.25V19a.75.75 0 0 1-1.5 0v-6.25H5a.75.75 0 0 1 0-1.5h6.25V5a.75.75 0 0 1 .75-.75" />
                    </svg>
                  </span>
                  <span className="text-[#312e2e] text-[14px] leading-[1.4]">and much more</span>
                </div>
              </div>
              <a
                className="flex items-center justify-center gap-200 rounded-8 px-600 py-300 text-center no-underline text-[#ff3c00] hover:bg-[#ff3c00] hover:text-[#fff] border-[1.5px] border-[#ff3c00] text-[15px] [transition:background-color_.15s_ease,color_.15s_ease]"
                href="https://replit.com/enterprise#contact"
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-id="pricing_showcase_enterprise_cta"
              >
                Contact sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
