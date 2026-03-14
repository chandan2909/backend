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

const frontendDir = 'c:/Users/vijay/Desktop/folders/kodnest/vibecoding/LearningManagentSystem/frontend-react/src';

walk(frontendDir, (file) => {
  if (!file.endsWith('.jsx') && !file.endsWith('.js')) return;

  console.log(`Cleaning JS ${file}...`);
  let content = fs.readFileSync(file, 'utf8');

  // 1. Remove interface and type blocks (multiline)
  content = content.replace(/^(export\s+)?(interface|type)\s+[A-Z]\w*\s*({[^}]*?}|=[^;]*?;)/gms, '');

  // 2. Remove type annotations in props and functions
  // e.g. (path: string), (chats), createLocalChat(): Chat
  content = content.replace(/:\s*[A-Z]\w*(\[\])?/g, (match) => {
      if (match.startsWith(': ')) return '';
      return '';
  });
  content = content.replace(/:\s*(string|number|boolean|any|void)/g, '');

  // 3. Remove non-null assertions
  content = content.replace(/!\./g, '.');

  // 4. Remove generic parameters: const headers<string, string>
  content = content.replace(/<[A-Z][a-zA-Z0-9, \s]*>/g, '');

  // 5. Remove "as string", "as any"
  content = content.replace(/\s+as\s+[A-Z]\w*/g, '');
  content = content.replace(/\s+as\s+any/g, '');

  fs.writeFileSync(file, content);
});
console.log('Frontend Cleanup Done!');
