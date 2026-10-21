import fs from 'fs';
import path from 'path';

let headerHtml = fs.readFileSync('work/analysis/section1-header-snapshot.html', 'utf8');

// Replace proprietary Replit SVG logo with neutral placeholder
const svgLogoRegex = /<svg width="84\.52380952380952" height="25"[\s\S]*?<\/svg>/;
const placeholder = `<div data-placeholder="brand-logo" aria-label="Brand Logo Placeholder" style="display:inline-flex; align-items:center; justify-content:center; height:25px; padding:0 8px; border:1px dashed #717d98; border-radius:4px; font-size:11px; font-weight:600; color:#717d98; background:rgba(0,0,0,0.04);">[Brand Logo Placeholder]</div>`;

headerHtml = headerHtml.replace(svgLogoRegex, placeholder);

// Write MegaNav.tsx
const componentCode = `import React from 'react';

const headerRawHtml = ${JSON.stringify(headerHtml)};

export const MegaNav: React.FC = () => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: headerRawHtml }}
    />
  );
};

export default MegaNav;
`;

fs.writeFileSync('work/reconstruction/src/components/MegaNav.tsx', componentCode, 'utf8');
console.log('Wrote work/reconstruction/src/components/MegaNav.tsx from verified snapshot with neutral placeholder.');

// Update App.tsx to ONLY render Section 1 (Header), discarding everything else
const appCode = `import React from 'react';
import { MegaNav } from './components/MegaNav';

export const App: React.FC = () => {
  return (
    <div className="replit-ui-theme-root min-h-screen" style={{ backgroundColor: 'rgb(246, 245, 244)', color: 'rgb(24, 25, 27)' }}>
      <MegaNav />
    </div>
  );
};

export default App;
`;

fs.writeFileSync('work/reconstruction/src/App.tsx', appCode, 'utf8');
console.log('Wrote work/reconstruction/src/App.tsx with Section 1 only.');
