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
  console.log(`Cleaning ${file}...`);
  let content = fs.readFileSync(file, 'utf8');

  // Remove express type imports
  content = content.replace(/import\s*{.*Request.*Response.*}\s*from\s*'express';?\n?/g, '');
  content = content.replace(/import\s*{.*NextFunction.*}\s*from\s*'express';?\n?/g, '');
  
  // Remove other type-only imports
  content = content.replace(/import\s+type\s+.*?\n/g, '');

  // Remove type annotations in function signatures: (req: Request, res: Response, next: NextFunction)
  content = content.replace(/\((req|res|next|err):\s*[a-zA-Z\.]+/g, '($1');
  
  // Remove "as any", "(req as any)"
  content = content.replace(/\(req\)\.user/g, 'req.user'); // specifically fix (req).user 
  content = content.replace(/\s+as\s+any/g, '');
  content = content.replace(/\(req\s+as\s+any\)/g, 'req');

  // Fix object method syntax left by previous pass if any
  // e.g. register(async (req, res) => { ... }) -> register: async (req, res) => { ... }
  // This is specific to the authController I saw
  content = content.replace(/(\w+)\(async\s*\(/g, '$1: async (');

  // Remove any remaining : string, : number at the end of variables or properties
  // This is tricky, let's target simple property declarations and variable initializers
  content = content.replace(/(\w+)\s*:\s*(string|number|boolean|any|void|string\[\]|number\[\])/g, '$1');

  // Ensure imports have .js (second pass just in case)
  content = content.replace(/from\s+['"](\.?\.\/[^'"]*?)['"]/g, (match, p1) => {
    if (p1.endsWith('.js')) return match;
    return `from '${p1}.js'`;
  });

  fs.writeFileSync(file, content);
});
console.log('Cleanup Done!');
