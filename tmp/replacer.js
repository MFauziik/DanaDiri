const fs = require('fs');
const path = require('path');

const srcDir = 'c:/dicodingcoding/CapstoneCoy/DanaDiri/frontend/src';

const mappings = {
  'text-\\[10px\\]': 'text-xs',
  'text-\\[11px\\]': 'text-xs',
  'text-\\[12px\\]': 'text-xs',
  'text-\\[13px\\]': 'text-sm',
  'text-\\[14px\\]': 'text-sm',
  'text-\\[15px\\]': 'text-base',
  'text-\\[16px\\]': 'text-base',
  'text-\\[18px\\]': 'text-lg',
  'text-\\[20px\\]': 'text-xl',
  'text-\\[22px\\]': 'text-xl',
  'text-\\[24px\\]': 'text-2xl',
  'text-\\[26px\\]': 'text-3xl',
  'text-\\[28px\\]': 'text-3xl',
  'text-\\[30px\\]': 'text-4xl',
  'text-\\[32px\\]': 'text-4xl',
  'text-\\[36px\\]': 'text-4xl'
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);
let total = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  for (const [key, value] of Object.entries(mappings)) {
    const regex = new RegExp(key, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, value);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated: ' + file);
    total++;
  }
});
console.log('Done, updated ' + total + ' files.');
