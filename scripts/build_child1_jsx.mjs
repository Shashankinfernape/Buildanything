import fs from 'fs';

let html = fs.readFileSync('work/analysis/live_child1_outer.html', 'utf8');

// Replace class with className
// Replace style attributes with React style objects or clean syntax
// Replace clip-rule with clipRule, fill-rule with fillRule
// Replace aria-* and data-* (those are valid in React JSX)
// Replace tabindex="0" with tabIndex={0}
// Replace disabled="" with disabled
// Replace id="react-aria-..." with dynamic or static
console.log('Original length:', html.length);
