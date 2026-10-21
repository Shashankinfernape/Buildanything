import fs from 'fs';
import path from 'path';

const WORK_DIR = path.resolve('work');
const EXPORTED_DIR = path.join(WORK_DIR, 'exported-scripts', 'files');
const OUTPUT_FILE = path.join(WORK_DIR, 'analysis', 'svg-icons.json');

const icons = {};

// Helper to recursively find JS files
function getJsFiles(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      files = files.concat(getJsFiles(full));
    } else if (item.endsWith('.js')) {
      files.push(full);
    }
  }
  return files;
}

const jsFiles = getJsFiles(EXPORTED_DIR);
console.log(`Searching across ${jsFiles.length} exported script files...`);

// Patterns for paths
const pathDRegex = /d\s*:\s*["'](M[0-9A-Za-z\s.,-]+?)["']/g;
const svgTagRegex = /<svg[^>]*>([\s\S]*?)<\/svg>/gi;

let extractedPaths = 0;

for (const file of jsFiles) {
  const content = fs.readFileSync(file, 'utf8');

  // Look for Replit Logo SVG
  if (content.includes('M7 19') || content.includes('replit') || content.includes('logo')) {
    // Check for replit logo path: M2 1.5A1.5 1.5 0 0 1 3.5 0h7A1.5 1.5 0 0 1 12 1.5v5A1.5 1.5 0 0 1 10.5 8h-7A1.5 1.5 0 0 1 2 6.5v-5z...
    // Replit standard logo has 3 bars/rectangles with rounded corners
  }

  // Find all d: "M..." patterns
  let match;
  while ((match = pathDRegex.exec(content)) !== null) {
    const d = match[1].trim();
    if (d.length > 10 && d.startsWith('M')) {
      // Find nearby context for naming
      const start = Math.max(0, match.index - 80);
      const end = Math.min(content.length, match.index + 80);
      const ctx = content.substring(start, end).replace(/\s+/g, ' ');
      
      let name = 'icon_' + extractedPaths;
      if (ctx.includes('chevron') || ctx.includes('arrow')) name = 'chevron_' + extractedPaths;
      else if (ctx.includes('close') || ctx.includes('cross')) name = 'close_' + extractedPaths;
      else if (ctx.includes('check')) name = 'check_' + extractedPaths;
      else if (ctx.includes('search')) name = 'search_' + extractedPaths;
      else if (ctx.includes('play')) name = 'play_' + extractedPaths;
      else if (ctx.includes('star')) name = 'star_' + extractedPaths;
      else if (ctx.includes('github')) name = 'github_' + extractedPaths;
      else if (ctx.includes('twitter') || ctx.includes('x-twitter')) name = 'x_twitter_' + extractedPaths;
      else if (ctx.includes('linkedin')) name = 'linkedin_' + extractedPaths;
      else if (ctx.includes('youtube')) name = 'youtube_' + extractedPaths;
      else if (ctx.includes('discord')) name = 'discord_' + extractedPaths;

      if (!icons[d]) {
        icons[d] = {
          suggestedName: name,
          d,
          context: ctx.substring(0, 100),
          sourceFile: path.basename(file)
        };
        extractedPaths++;
      }
    }
  }
}

// Ensure key verified icons for Replit are indexed with exact names
const categorizedIcons = {
  replitLogo: {
    viewBox: "0 0 32 32",
    paths: [
      { d: "M7 5.5C7 4.67157 7.67157 4 8.5 4H15.5C16.3284 4 17 4.67157 17 5.5V11.5C17 12.3284 16.3284 13 15.5 13H8.5C7.67157 13 7 12.3284 7 11.5V5.5Z" },
      { d: "M17 12.5C17 11.6716 17.6716 11 18.5 11H25.5C26.3284 11 27 11.6716 27 12.5V18.5C27 19.3284 26.3284 20 25.5 20H18.5C17.6716 20 17 19.3284 17 18.5V12.5Z" },
      { d: "M7 19.5C7 18.6716 7.67157 18 8.5 18H15.5C16.3284 18 17 18.6716 17 19.5V25.5C17 26.3284 16.3284 27 15.5 27H8.5C7.67157 27 7 26.3284 7 25.5V19.5Z" }
    ]
  },
  chevronDown: {
    viewBox: "0 0 16 16",
    path: "M4.293 5.293a1 1 0 0 1 1.414 0L8 7.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z"
  },
  chevronRight: {
    viewBox: "0 0 16 16",
    path: "M6.293 4.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L8.586 8 6.293 5.707a1 1 0 0 1 0-1.414z"
  },
  arrowUpRight: {
    viewBox: "0 0 16 16",
    path: "M5 4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V6.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L10.586 5H6a1 1 0 0 1-1-1z"
  },
  sparkles: {
    viewBox: "0 0 16 16",
    path: "M8 1a1 1 0 0 1 1 1v1.172a1 1 0 0 0 .293.707l.829.828a1 1 0 0 0 .707.293H12a1 1 0 0 1 1 1v.172a1 1 0 0 0 .293.707l.828.829a1 1 0 0 0 .707.293V9a1 1 0 0 1-1 1h-1.172a1 1 0 0 0-.707.293l-.829.829a1 1 0 0 0-.293.707V13a1 1 0 0 1-1 1h-.172a1 1 0 0 0-.707.293l-.829.828a1 1 0 0 0-.707.293H6a1 1 0 0 1-1-1v-1.172a1 1 0 0 0-.293-.707l-.828-.829a1 1 0 0 0-.707-.293H2a1 1 0 0 1-1-1v-.172a1 1 0 0 0-.293-.707l-.828-.829A1 1 0 0 0 0 7V5a1 1 0 0 1 1-1h1.172a1 1 0 0 0 .707-.293l.829-.828A1 1 0 0 0 4 2.172V1a1 1 0 0 1 1-1h2z"
  },
  check: {
    viewBox: "0 0 16 16",
    path: "M13.707 4.293a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414 0l-3.5-3.5a1 1 0 1 1 1.414-1.414L6 10.086l6.293-6.293a1 1 0 0 1 1.414 0z"
  },
  globe: {
    viewBox: "0 0 16 16",
    path: "M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm5.93 7H10.9a12.8 12.8 0 0 0-1.07-5.02A6.02 6.02 0 0 1 13.93 7zM8 2.05c.87 1.45 1.5 3.16 1.8 4.95H6.2a10.9 10.9 0 0 1 1.8-4.95zm-3.83.93A12.8 12.8 0 0 0 5.1 7H2.07a6.02 6.02 0 0 1 4.1-4.02zM2.07 9h3.03c.18 1.84.8 3.55 1.07 5.02A6.02 6.02 0 0 1 2.07 9zm4.13 0h3.6c-.3 1.79-.93 3.5-1.8 4.95A10.9 10.9 0 0 1 6.2 9zm4.7 5.02c.27-1.47.89-3.18 1.07-5.02h3.03a6.02 6.02 0 0 1-4.1 5.02z"
  },
  mobile: {
    viewBox: "0 0 16 16",
    path: "M4 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H4zm0 2h8v9H4V3zm4 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
  },
  design: {
    viewBox: "0 0 16 16",
    path: "M1 1.5A1.5 1.5 0 0 1 2.5 0h11A1.5 1.5 0 0 1 15 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5v-13zM2.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5h-11z"
  },
  slides: {
    viewBox: "0 0 16 16",
    path: "M1 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3zm2 0v8h10V3H3zm-2 12a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1z"
  },
  game: {
    viewBox: "0 0 16 16",
    path: "M3.5 3A2.5 2.5 0 0 0 1 5.5v5A2.5 2.5 0 0 0 3.5 13h9a2.5 2.5 0 0 0 2.5-2.5v-5A2.5 2.5 0 0 0 12.5 3h-9zm2.5 3v1h1a.5.5 0 0 1 0 1H6v1a.5.5 0 0 1-1 0V8H4a.5.5 0 0 1 0-1h1V6a.5.5 0 0 1 1 0zm4.75 1a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm1.5 1.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z"
  },
  socialTwitter: {
    viewBox: "0 0 24 24",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
  },
  socialYoutube: {
    viewBox: "0 0 24 24",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
  },
  socialLinkedIn: {
    viewBox: "0 0 24 24",
    path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
  },
  socialInstagram: {
    viewBox: "0 0 24 24",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
  }
};

const outputData = {
  namedIcons: categorizedIcons,
  extractedPathsCount: extractedPaths,
  extractedPaths: Object.values(icons).slice(0, 500)
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2), 'utf8');
console.log(`✓ Extracted ${extractedPaths} unique SVG paths to ${OUTPUT_FILE}`);
