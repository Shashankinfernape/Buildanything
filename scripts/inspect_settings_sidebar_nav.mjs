import fs from 'fs';

const navHtml = fs.readFileSync('work/analysis/signed_in/workspace_settings_nav_outer.html', 'utf8');

const match = navHtml.match(/data-settings-sidebar-navigation="true"[\s\S]*$/);
if (match) {
  console.log('Settings sidebar nav length:', match[0].length);
  // Let's find all headers and links
  const links = [...match[0].matchAll(/<a[^>]+href=([^\s>]+)[^>]*>([\s\S]*?)<\/a>/g)];
  console.log('Links count:', links.length);
  links.forEach(l => {
    console.log(l[1], l[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  });
}
