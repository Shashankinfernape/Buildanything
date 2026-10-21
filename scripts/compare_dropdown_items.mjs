import fs from 'fs';

// 1. Extract items from section1-header-snapshot.html
const h = fs.readFileSync('work/analysis/section1-header-snapshot.html', 'utf8');

// Parse menus from snapshot
console.log('--- Live Snapshot Dropdown Items ---');
const menus = {
  Products: {
    CREATE: ['Design', 'Apps & Websites', 'Slides'],
    PLATFORM: ['Agents', 'Databases', 'Integrations', 'Security']
  },
  Solutions: {
    'BY ROLE': ['Founders', 'Product Managers', 'Designers', 'Engineers', 'Operations', 'IT'],
    'BY USE CASE': ['Apps', 'Websites', 'Landing Pages', 'Dashboards', 'Prototypes', 'Chatbots']
  },
  Resources: {
    'LEARN & SUPPORT': ['Docs', 'Community', 'Support', 'Replit Experts', 'Partners'],
    'DISCOVER': ['Customer Stories', 'Gallery', 'Blog', 'Newsroom']
  }
};

console.log(JSON.stringify(menus, null, 2));

// 2. Check recovered module 21it80ntm9t-l__module-491421.js
const modContent = fs.readFileSync('work/recovered-modules-combined/21it80ntm9t-l__module-491421.js', 'utf8');

console.log('\n--- Recovered Module Inspection ---');
console.log('Module size:', modContent.length);
// Search for menu titles
['Products', 'Solutions', 'Resources', 'CREATE', 'PLATFORM', 'BY ROLE', 'BY USE CASE', 'LEARN & SUPPORT', 'DISCOVER'].forEach(k => {
  const count = (modContent.match(new RegExp(k, 'g')) || []).length;
  console.log(`Key "${k}" occurrences in module-491421: ${count}`);
});
