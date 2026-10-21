import fs from 'fs';
import path from 'path';

const CSS_DIR = path.resolve('work/target_artifacts/replit/css');
const OUTPUT_FILE = path.resolve('work/analysis/css-tokens.json');

const cssFiles = fs.readdirSync(CSS_DIR).filter(f => f.endsWith('.css'));

const customProperties = {};
const fontFaces = [];

for (const file of cssFiles) {
  const content = fs.readFileSync(path.join(CSS_DIR, file), 'utf8');

  // Extract @font-face rules
  const fontFaceRegex = /@font-face\s*\{([^}]+)\}/g;
  let ffMatch;
  while ((ffMatch = fontFaceRegex.exec(content)) !== null) {
    const body = ffMatch[1];
    const props = {};
    body.split(';').forEach(decl => {
      const parts = decl.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join(':').trim();
        if (key && val) props[key] = val;
      }
    });
    if (Object.keys(props).length > 0) {
      fontFaces.push(props);
    }
  }

  // Extract CSS custom properties (--*)
  const varRegex = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;{}]+)[;}]/g;
  let varMatch;
  while ((varMatch = varRegex.exec(content)) !== null) {
    const varName = varMatch[1].trim();
    const varValue = varMatch[2].trim();
    if (!customProperties[varName]) {
      customProperties[varName] = varValue;
    }
  }
}

// Categorize variables
const categorized = {
  colors: {},
  space: {},
  font: {},
  borderRadius: {},
  other: {}
};

for (const [key, value] of Object.entries(customProperties)) {
  if (key.startsWith('--color-') || key.includes('color') || key.includes('bg') || key.includes('fill') || key.includes('stroke')) {
    categorized.colors[key] = value;
  } else if (key.startsWith('--space-') || key.includes('spacing') || key.includes('margin') || key.includes('padding') || key.includes('gap')) {
    categorized.space[key] = value;
  } else if (key.startsWith('--font-') || key.includes('font') || key.includes('line-height')) {
    categorized.font[key] = value;
  } else if (key.startsWith('--border-radius-') || key.includes('radius')) {
    categorized.borderRadius[key] = value;
  } else {
    categorized.other[key] = value;
  }
}

const result = {
  summary: {
    totalProperties: Object.keys(customProperties).length,
    totalFontFaces: fontFaces.length,
    colorsCount: Object.keys(categorized.colors).length,
    spaceCount: Object.keys(categorized.space).length,
    fontCount: Object.keys(categorized.font).length,
    borderRadiusCount: Object.keys(categorized.borderRadius).length,
    otherCount: Object.keys(categorized.other).length
  },
  fontFaces,
  tokens: categorized,
  allProperties: customProperties
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf8');
console.log(`✓ Extracted ${Object.keys(customProperties).length} CSS tokens and ${fontFaces.length} font-faces to ${OUTPUT_FILE}`);
console.log(JSON.stringify(result.summary, null, 2));
