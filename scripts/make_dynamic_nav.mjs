import fs from 'fs';

function run() {
  const html = fs.readFileSync('work/analysis/section1-header-snapshot.html', 'utf8');

  // Replace Replit logo with [Brand Logo Placeholder]
  const placeholderLogo = `<div data-placeholder="brand-logo" aria-label="Brand Logo Placeholder" style="display:inline-flex; align-items:center; justify-content:center; height:25px; padding:0 8px; border:1px dashed #717d98; border-radius:4px; font-size:11px; font-weight:600; color:#717d98; background:rgba(0,0,0,0.04);">[Brand Logo Placeholder]</div>`;

  let processed = html.replace(/<svg[^>]*data-placeholder="brand-logo"[^>]*>[\s\S]*?<\/svg>/, placeholderLogo);
  processed = processed.replace(/<svg\s+aria-label="Replit"[^>]*>[\s\S]*?<\/svg>/, placeholderLogo);

  // We want to be able to dynamically render the HTML based on openMenu.
  // When openMenu === 'Products', we replace data-state and classes for Products.
  // Same for Solutions and Resources.

  const tsxContent = `import React, { useState, useEffect } from 'react';

const baseHtml = ${JSON.stringify(processed)};

export const MegaNav: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    (window as any).__setNavDropdown = (menu: string | null) => {
      setOpenMenu(menu);
    };
  }, []);

  // Compute HTML based on active openMenu
  let renderedHtml = baseHtml;

  const menus = [
    { name: 'Products', panelId: 'marketing-header-panel-d7e540c5b986' },
    { name: 'Solutions', panelId: 'marketing-header-panel-00b55aa0ebe3' },
    { name: 'Resources', panelId: 'marketing-header-panel-20e7c4f7ecfe' }
  ];

  for (const m of menus) {
    const isOpen = openMenu?.toLowerCase() === m.name.toLowerCase();
    if (isOpen) {
      // Find the group containing this panelId
      // In baseHtml, closed content is:
      // data-state="closed" class="top-1100 left-0 z-1 absolute invisible opacity-0 pointer-events-none [transform:translateY(2px)] [transition:opacity_200ms_ease,transform_200ms_ease,visibility_0s_200ms] motion-reduce:transition-none"
      // and panel has aria-hidden="true"
      // and button has aria-expanded="false"
      
      const closedContentStr = 'class="top-1100 left-0 z-1 absolute invisible opacity-0 pointer-events-none [transform:translateY(2px)] [transition:opacity_200ms_ease,transform_200ms_ease,visibility_0s_200ms] motion-reduce:transition-none"><div aria-hidden="true" id="' + m.panelId + '"';
      const openContentStr = 'class="top-1100 left-0 z-1 absolute visible opacity-100 pointer-events-auto [transform:translateY(0)] [transition:opacity_200ms_ease,transform_200ms_ease,visibility_0s] motion-reduce:transition-none"><div aria-hidden="false" id="' + m.panelId + '"';

      renderedHtml = renderedHtml.replace(closedContentStr, openContentStr);

      // Button aria-expanded="false" with aria-controls="m.panelId"
      const closedBtn = 'aria-expanded="false" aria-controls="' + m.panelId + '"';
      const openBtn = 'aria-expanded="true" aria-controls="' + m.panelId + '"';
      renderedHtml = renderedHtml.replace(closedBtn, openBtn);
    }
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
      onMouseOver={(e) => {
        const target = e.target as HTMLElement;
        const btn = target.closest('button');
        const text = btn?.innerText?.trim();
        if (text && ['Products', 'Solutions', 'Resources'].includes(text)) {
          setOpenMenu(text);
        }
      }}
      onMouseLeave={() => setOpenMenu(null)}
    />
  );
};

export default MegaNav;
`;

  fs.writeFileSync('work/reconstruction/src/components/MegaNav.tsx', tsxContent, 'utf8');
  console.log('Dynamic MegaNav.tsx written successfully!');
}

run();
