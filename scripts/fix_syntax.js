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

const backendDir = 'c:/Users/vijay/Desktop/folders/kodnest/vibecoding/LearningManagentSystem/backend/src';

walk(backendDir, (file) => {
  if (!file.endsWith('.js')) return;

  let content = fs.readFileSync(file, 'utf8');

  // Fix asyncHandler assignment: asyncHandler: async (req, res) -> asyncHandler(async (req, res)
  content = content.replace(/asyncHandler:\s*async\s*\(/g, 'asyncHandler(async (');
  
  // Fix map assignment: .map: async (chat) -> .map(async (chat)
  content = content.replace(/\.map:\s*async\s*\(/g, '.map(async (');

  // Fix trailing }); that became }); at the end of asyncHandler blocks
  // Since we changed asyncHandler: to asyncHandler(, we need to ensure the closing ); is correct.
  // The previous pass might have left }); at the end of a block.
  // Actually, the previous pass left }); in some places.
  
  // Fix !. (non-null assertion)
  content = content.replace(/!\./g, '.');

  // Fix { role, content } if it's supposed to be m.role, m.content
  // This happened in history.map((m) => ({ role, content }))
  content = content.replace(/map\(\(m\)\s*=>\s*\(\{\s*role,\s*content\s*\}\)\)/g, 'map((m) => ({ role: m.role, content: m.content }))');

  // Fix parts{ text }] -> parts: [{ text }]
  content = content.replace(/parts\{\s*text\s*\}\]/g, 'parts: [{ text }]');
  content = content.replace(/parts\{\s*text:\s*(.*?)\s*\}\]/g, 'parts: [{ text: $1 }]');

  // Fix { success } -> { success: true }
  content = content.replace(/\{ success \}/g, '{ success: true }');

  // Fix { error } where error is not defined (often intended to be err or error.message)
  content = content.replace(/\{ error \}/g, '{ error: error.message || error }');

  // Fix stray }), at the end of object properties
  content = content.replace(/\s*\)\s*,\s*\n/g, ',\n');

  fs.writeFileSync(file, content);
  console.log(`Corrected ${file}`);
});
