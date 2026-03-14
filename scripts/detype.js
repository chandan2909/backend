import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach( f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
};

const backendDir = 'c:/Users/vijay/Desktop/folders/kodnest/vibecoding/LearningManagentSystem/backend';
const targetDirs = [
  path.join(backendDir, 'src'),
  path.join(backendDir, 'migrations')
];

const filesToProcess = [
  path.join(backendDir, 'knexfile.js'),
  path.join(backendDir, 'seed.js'),
  path.join(backendDir, 'seed_new_courses.js'),
  path.join(backendDir, 'setup_chat_tables.js')
];

targetDirs.forEach(dir => {
  walk(dir, (file) => {
    if (file.endsWith('.js')) filesToProcess.push(file);
  });
});

filesToProcess.forEach(file => {
  if (!fs.existsSync(file)) return;
  console.log(`Processing ${file}...`);
  let content = fs.readFileSync(file, 'utf8');

  // 1. Remove type imports like "import type { ... } from '...'"
  content = content.replace(/import\s+type\s+{[^}]*}\s+from\s+['"][^'"]*['"];?\n?/g, '');
  
  // 2. Remove generic type parameters like <...>, but be careful with arrow functions
  // Simple version: remove <something> if it's not part of a tag (though this is backend, so no tags)
  content = content.replace(/<[A-Z][a-zA-Z0-9, \s\<\>]*>/g, '');

  // 3. Remove type annotations : string, : any, etc.
  // Handle simple ones first: : Type, : Type[], : { ... }
  // We'll use a regex that looks for : followed by a type name but not in a ternary or object literal
  // This is hard to do perfectly with regex, so we'll target function params and variables
  content = content.replace(/(\(|\s|,)([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_\[\]\.]+|\{.*?\})/g, '$1$2');

  // 4. Remove interface and type declarations
  content = content.replace(/^export\s+(interface|type)\s+.*?\n/gm, '');
  content = content.replace(/^(interface|type)\s+.*?\n/gm, '');

  // 5. Remove "as any", "as Type"
  content = content.replace(/\s+as\s+([a-zA-Z0-9_\[\]\.]+|\{.*?\})/g, '');

  // 6. Fix imports: add .js extension to relative imports
  content = content.replace(/from\s+['"](\.?\.\/.*?)['"]/g, (match, p1) => {
    if (p1.endsWith('.js') || p1.includes('.json')) return match;
    return `from '${p1}.js'`;
  });

  fs.writeFileSync(file, content);
});
console.log('Done!');
