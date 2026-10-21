import React from 'react';
import { ReplitLogo, SocialTwitter, SocialYoutube, SocialLinkedIn, SocialInstagram } from '../icons';
import cmsData from '../../../analysis/cms-fixtures.json';

export const Footer: React.FC = () => {
  const footer = cmsData.footer;

  return (
    <footer className="border-t border-[#1f2738] bg-[#090d17] pt-20 pb-12 px-6">
      <div className="max-w-[1240px] mx-auto">
        {/* Pre-footer Call to Action Banner */}
        <div className="bg-[#141b2b] border border-[#263044] rounded-2xl p-8 sm:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              {footer.ctaSection.headline}
            </h3>
            <p className="text-sm text-[#9da7be]">
              {footer.ctaSection.subheadline}
            </p>
          </div>
          <a
            href={footer.ctaSection.href}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#f26207] hover:bg-[#e05603] text-white text-sm font-semibold transition-all shadow-md flex-shrink-0"
          >
            {footer.ctaSection.buttonLabel}
          </a>
        </div>

        {/* 4-Column Footer Link Tree */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-[#1f2738]">
          {footer.columns.map((col) => (
            <div key={col.title} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#717d98]">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-[#9da7be] hover:text-white transition-colors inline-flex items-center space-x-1.5"
                    >
                      <span>{link.label}</span>
                      {link.hasIcon && (
                        <img
                          src="/assets/9629d825418b_privacyoptions29x14.png"
                          alt="Privacy Choices"
                          className="w-4 h-2.5 inline-block object-contain"
                        />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Brand Logo, Copyright & Social SVGs */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#717d98]">
          <div className="flex items-center space-x-3">
            <ReplitLogo size={20} className="text-[#f26207]" />
            <span>{footer.copyright}</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a
              href="https://x.com/replit"
              target="_blank"
              rel="noreferrer"
              aria-label="X Twitter"
              className="text-[#717d98] hover:text-white transition-colors"
            >
              <SocialTwitter size={18} />
            </a>
            <a
              href="https://youtube.com/replit"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="text-[#717d98] hover:text-white transition-colors"
            >
              <SocialYoutube size={18} />
            </a>
            <a
              href="https://linkedin.com/company/replit"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-[#717d98] hover:text-white transition-colors"
            >
              <SocialLinkedIn size={18} />
            </a>
            <a
              href="https://instagram.com/replit"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-[#717d98] hover:text-white transition-colors"
            >
              <SocialInstagram size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
