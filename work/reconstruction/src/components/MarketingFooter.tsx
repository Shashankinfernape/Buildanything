import React from 'react';

export function FooterCta() {
  return (
    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start shrink-0 items-center pt-2000 pb-[120px]">
      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start shrink-0 items-center gap-1200 px-300">
        <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start shrink-0 items-center gap-600">
          <h2 className="text-center text-balance leading-none font-brand text-[#191818] text-[56px] font-[400] [letter-spacing:-.04em] [@media_screen_and_(width<=768px)]:text-[40px]">
            What are you waiting for?
          </h2>
          <p className="text-center text-balance font-brand max-w-[560px] text-[#6f6c6a] text-[16px] leading-[1.7] font-[400]">
            Join millions of builders who use Replit to bring their ideas to life. Start for free — no credit card required.
          </p>
        </div>
        <a
          href="https://replit.com/signup"
          className="flex w-auto items-center justify-center gap-200 cursor-pointer rounded-8 border-0 px-600 text-center leading-none no-underline font-brand h-[52px] bg-[#ff3c00] text-[#fff] text-[15px] font-[400] [letter-spacing:-.03em] [transition:opacity_.1s_ease-out] hover:opacity-[.9]"
        >
          <span>Get started for free</span>
          <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M19.53 11.47a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 1 1-1.06-1.06l5.72-5.72H5a.75.75 0 0 1 0-1.5h12.19l-5.72-5.72a.75.75 0 0 1 1.06-1.06z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export function MarketingFooter() {
  return (
    <div className="replit-marketing-footer" data-analytics-id="big_footer">
      <footer className="w-full bg-[hsl(33_47%_96%)] font-default">
        <div className="border-t h-[1px] border-[#111827]/10" />
        <div className="mx-auto w-full px-[24px] pb-[32px] pt-[64px] max-w-[1280px] min-[640px]:pt-[96px] min-[1024px]:px-[32px] min-[1024px]:pt-[128px]">
          <div className="grid gap-x-[32px] gap-y-[64px] min-[1280px]:grid-cols-3 min-[1280px]:gap-x-[64px]">
            {/* Column 1: Brand Info & Socials */}
            <div className="space-y-[32px]">
              {/* Neutral Logo Placeholder */}
              <div className="w-[142px]">
                <div
                  aria-label="Replit logo placeholder"
                  className="w-[142px] h-[36px] flex items-center justify-center rounded-8 bg-[hsl(33deg_47%_90%/100%)] border border-dashed border-[hsl(30deg_7%_75%/100%)] text-[#181818] font-brand font-semibold text-[15px] select-none"
                >
                  [Logo]
                </div>
              </div>
              <p className="leading-[24px] text-[14px] text-[#4b5563]">
                Replit is the AI platform that helps you turn your ideas into real outcomes. Describe what you want, and let Replit build, test, and deploy it for you.
              </p>
              {/* Social Icons */}
              <div className="flex gap-[24px] text-[#4b5563]">
                {/* X */}
                <a href="https://x.com/replit" aria-label="Replit on X" target="_blank" rel="noopener noreferrer" className="hover:text-[#111827]">
                  <svg aria-hidden="true" className="size-[24px]" fill="currentColor" focusable="false" viewBox="0 0 24 24">
                    <path d="M13.682 10.622 20.239 3h-1.554l-5.693 6.618L8.445 3H3.2l6.876 10.007L3.2 21h1.554l6.012-6.989L15.569 21h5.244l-7.131-10.378Zm-2.128 2.474-.697-.996-5.544-7.93H7.7l4.474 6.4.697.997 5.815 8.317H16.3l-4.746-6.788Z" />
                  </svg>
                </a>
                {/* YouTube */}
                <a href="https://www.youtube.com/@replit" aria-label="Replit on YouTube" target="_blank" rel="noopener noreferrer" className="hover:text-[#111827]">
                  <svg aria-hidden="true" className="size-[24px]" fill="currentColor" focusable="false" viewBox="0 0 24 24">
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.55 3.6 12 3.6 12 3.6s-7.55 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.85.5 9.4.5 9.4.5s7.55 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="https://www.linkedin.com/company/repl-it/" aria-label="Replit on LinkedIn" target="_blank" rel="noopener noreferrer" className="hover:text-[#111827]">
                  <svg aria-hidden="true" className="size-[24px]" fill="currentColor" focusable="false" viewBox="0 0 24 24">
                    <path d="M5.1 3.2a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2ZM3.3 9h3.6v11.7H3.3V9Zm5.8 0h3.4v1.6h.1c.5-.9 1.7-1.9 3.6-1.9 3.8 0 4.5 2.5 4.5 5.8v6.2h-3.6V15c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1v5.8H9.1V9Z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a href="https://www.instagram.com/replit" aria-label="Replit on Instagram" target="_blank" rel="noopener noreferrer" className="hover:text-[#111827]">
                  <svg aria-hidden="true" className="size-[24px]" fill="currentColor" focusable="false" viewBox="0 0 24 24">
                    <path d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6a5.2 5.2 0 0 1-5.2 5.2H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2Zm-.2 1.8a3.2 3.2 0 0 0-3.2 3.2v9.6a3.2 3.2 0 0 0 3.2 3.2h10a3.2 3.2 0 0 0 3.2-3.2V7a3.2 3.2 0 0 0-3.2-3.2H7Zm5 3.1a5.1 5.1 0 1 1 0 10.2 5.1 5.1 0 0 1 0-10.2Zm0 1.8a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6Zm5.3-3.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
                  </svg>
                </a>
                {/* Facebook */}
                <a href="https://www.facebook.com/replit/" aria-label="Replit on Facebook" target="_blank" rel="noopener noreferrer" className="hover:text-[#111827]">
                  <svg aria-hidden="true" className="size-[24px]" fill="currentColor" focusable="false" viewBox="0 0 24 24">
                    <path d="M13.4 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a22 22 0 0 0-2.4-.1c-2.4 0-4 1.5-4 4.1V10H7.6v3h2.7v8h3.1Z" />
                  </svg>
                </a>
                {/* TikTok */}
                <a href="https://www.tiktok.com/@replit" aria-label="Replit on TikTok" target="_blank" rel="noopener noreferrer" className="hover:text-[#111827]">
                  <svg aria-hidden="true" className="size-[24px]" fill="currentColor" focusable="false" viewBox="0 0 24 24">
                    <path d="M17.625 2C20.0409 2.00026 21.9998 3.95909 22 6.375V17.625C22 20.0411 20.041 21.9997 17.625 22H6.375C3.95875 22 2 20.0412 2 17.625V6.375C2.0002 3.95892 3.95888 2 6.375 2H17.625ZM12.3809 14.6465C12.3809 14.7903 12.3799 14.9328 12.374 15.0732C12.374 15.0907 12.373 15.1072 12.3721 15.126C12.3721 15.1336 12.3717 15.1415 12.3701 15.1494V15.1553C12.3418 15.5395 12.2224 15.9108 12.0225 16.2363C11.8225 16.5618 11.5483 16.8321 11.2236 17.0225C10.8851 17.2212 10.5018 17.3257 10.1123 17.3252C8.86159 17.3251 7.84766 16.2722 7.84766 14.9727C7.84775 13.6732 8.86165 12.6211 10.1123 12.6211C10.349 12.6209 10.5845 12.6588 10.8096 12.7344L10.8135 9.91406C10.1302 9.823 9.43567 9.87957 8.77441 10.0791C8.1131 10.2787 7.49876 10.6175 6.9707 11.0742C6.50799 11.489 6.11909 11.9843 5.82129 12.5371C5.70793 12.7388 5.28029 13.5486 5.22852 14.8633C5.19596 15.6095 5.41305 16.3826 5.5166 16.7021V16.709C5.58178 16.8972 5.83403 17.5389 6.24512 18.0801C6.57677 18.5143 6.96878 18.8965 7.4082 19.2129V19.2061L7.41406 19.2129C8.71373 20.1241 10.1553 20.0645 10.1553 20.0645C10.4048 20.054 11.2406 20.0636 12.1895 19.5996C13.2323 19.0898 13.8301 18.333 13.8408 18.3193C14.2236 17.8614 14.5283 17.3388 14.7412 16.7754C14.984 16.1166 15.0654 15.3265 15.0654 15.0107V9.32812C15.0994 9.34925 15.526 9.64094 15.5312 9.64453C15.5312 9.64453 16.1561 10.058 17.1309 10.3271C17.8304 10.5187 18.7734 10.5586 18.7734 10.5586V7.80859C18.4432 7.84555 17.7724 7.73791 17.0859 7.38477C16.9805 7.32854 16.8778 7.267 16.7783 7.2002C16.4891 7.00286 16.2238 6.77047 15.9883 6.50781C15.3989 5.81195 15.1788 5.10557 15.0977 4.61133H15.1006C15.0329 4.20113 15.0612 3.93555 15.0654 3.93555H12.3809V14.6465Z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Columns 2-5: Link Columns */}
            <div className="grid grid-cols-2 gap-x-[32px] gap-y-[48px] min-[768px]:grid-cols-4 min-[1280px]:col-span-2">
              {/* Product */}
              <div className="flex flex-col gap-[16px]">
                <h2 className="leading-[24px] text-[14px] font-[600] text-[#111827]">Product</h2>
                <ul className="flex flex-col mt-[8px] gap-[8px]">
                  {[
                    { label: 'Design', href: '/design', id: 'footer_design_link' },
                    { label: 'Slides', href: '/slides', id: 'footer_slides_link' },
                    { label: 'Agents', href: '/products/agent', id: 'footer_agents_link' },
                    { label: 'Databases', href: '/products/database', id: 'footer_databases_link' },
                    { label: 'Integrations', href: '/integrations', id: 'footer_integrations_link' },
                    { label: 'Security', href: '/security', id: 'footer_security_link' },
                    { label: 'Enterprise', href: '/enterprise', id: 'footer_enterprise_link' },
                    { label: 'Pricing', href: '/pricing', id: 'footer_pricing_link' }
                  ].map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        data-analytics-id={item.id}
                        className="inline-flex items-center no-underline transition-colors gap-[8px] leading-[24px] text-[14px] text-[#4b5563] hover:text-[#111827]"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div className="flex flex-col gap-[16px]">
                <h2 className="leading-[24px] text-[14px] font-[600] text-[#111827]">Resources</h2>
                <ul className="flex flex-col mt-[8px] gap-[8px]">
                  {[
                    { label: 'Templates', href: '/build', id: 'footer_templates_link' },
                    { label: 'Gallery', href: '/gallery', id: 'footer_gallery_link' },
                    { label: 'Customer stories', href: '/customers', id: 'footer_customer_stories_link' },
                    { label: 'Docs', href: 'https://docs.replit.com', id: 'footer_docs_link', external: true },
                    { label: 'Blog', href: '/blog', id: 'footer_blog_link' },
                    { label: 'Community', href: '/community', id: 'footer_community_link' },
                    { label: 'Support', href: '/help', id: 'footer_help_link' },
                    { label: 'Status', href: 'https://status.replit.com', id: 'footer_status_link', external: true }
                  ].map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        data-analytics-id={item.id}
                        target={item.external ? '_blank' : '_self'}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center no-underline transition-colors gap-[8px] leading-[24px] text-[14px] text-[#4b5563] hover:text-[#111827]"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div className="flex flex-col gap-[16px]">
                <h2 className="leading-[24px] text-[14px] font-[600] text-[#111827]">Company</h2>
                <ul className="flex flex-col mt-[8px] gap-[8px]">
                  {[
                    { label: 'About', href: '/about', id: 'footer_about_us_link' },
                    { label: 'Careers', href: '/careers', id: 'footer_careers_link' },
                    { label: 'Newsroom', href: '/news', id: 'footer_newsroom_link' },
                    { label: 'Partners', href: '/partners', id: 'footer_partnerships_link' },
                    { label: 'Certifications', href: '/certifications', id: 'footer_certifications_link' },
                    { label: 'Brand kit', href: '/brand', id: 'footer_brand_kit_link' },
                    { label: 'Contact us', href: '/enterprise', id: 'footer_contact_us_link' }
                  ].map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        data-analytics-id={item.id}
                        className="inline-flex items-center no-underline transition-colors gap-[8px] leading-[24px] text-[14px] text-[#4b5563] hover:text-[#111827]"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div className="flex flex-col gap-[16px]">
                <h2 className="leading-[24px] text-[14px] font-[600] text-[#111827]">Legal</h2>
                <ul className="flex flex-col mt-[8px] gap-[8px]">
                  {[
                    { label: 'Terms of service', href: '/terms-of-service', id: 'footer_terms_of_service_link' },
                    { label: 'Privacy policy', href: '/privacy-policy', id: 'footer_privacy_link' },
                    { label: 'Pro agreement', href: '/pro-agreement', id: 'footer_pro_agreement_link' },
                    { label: 'Enterprise agreement', href: '/enterprise-agreement', id: 'footer_enterprise_agreement_link' },
                    { label: 'Data processing agreement', href: '/dpa', id: 'footer_dpa_link' },
                    { label: 'Subprocessors', href: '/subprocessors', id: 'footer_subprocessors_link' },
                    { label: 'Report abuse', href: 'https://docs.replit.com/legal-and-security-info/abuse-report', id: 'footer_report_abuse_link', external: true }
                  ].map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        data-analytics-id={item.id}
                        target={item.external ? '_blank' : '_self'}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center no-underline transition-colors gap-[8px] leading-[24px] text-[14px] text-[#4b5563] hover:text-[#111827]"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      data-analytics-id="footer_do_not_sell_button"
                      data-consent-ui="true"
                      className="inline-flex cursor-pointer flex-wrap items-center gap-x-200 border-none bg-transparent p-0 text-left leading-600 no-underline transition-colors text-[14px] text-[#4b5563] hover:text-[#111827]"
                    >
                      <span>Your privacy choices</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="border-t mt-[64px] pt-[32px] border-[#111827]/10 min-[640px]:mt-[80px] min-[1024px]:mt-[96px]">
            <p className="leading-[24px] text-[14px] text-[#4b5563]">
              All rights reserved. Copyright © 2026 Replit, Inc.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
