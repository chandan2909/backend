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

  console.log(`Detyping ${file}...`);
  let content = fs.readFileSync(file, 'utf8');

  // 1. Remove React.FC<...> or FC<...>
  content = content.replace(/:\s*(React\.)?FC(<.*?>)?/g, '');

  // 2. Remove generic parameters in hooks: useState<T>(...)
  content = content.replace(/useState<[a-zA-Z0-9_|\[\]\s,\{\}:]*>\(/g, 'useState(');
  content = content.replace(/useRef<[a-zA-Z0-9_|\[\]\s,\{\}:]*>\(/g, 'useRef(');
  content = content.replace(/useContext<[a-zA-Z0-9_|\[\]\s,\{\}:]*>\(/g, 'useContext(');

  // 3. Remove type annotations in props and variables: (props: Props) or const x: string
  // This needs to be careful not to match JSX attributes or ternary operators.
  // We'll target patterns like (param: Type) and : Type =
  content = content.replace(/(\(|\s|,)([a-zA-Z0-9_]+)\s*:\s*([A-Z][a-zA-Z0-9_\[\]\.]+|\{.*?\})(?!\s*\?)/g, '$1$2');

  // 4. Remove interface and type declarations
  content = content.replace(/^export\s+(interface|type)\s+.*?\n/gm, '');
  content = content.replace(/^(interface|type)\s+.*?\n/gm, '');

  // 5. Remove "as any", "as Type"
  content = content.replace(/\s+as\s+([A-Z][a-zA-Z0-9_\[\]\.]+|\{.*?\})/g, '');

  // 6. Fix imports: although Vite doesn't require .js usually, it's safer to remove .ts/.tsx extensions if hardcoded
  content = content.replace(/from\s+['"](.*?)(\.tsx|\.ts)['"]/g, "from '$1'");

  fs.writeFileSync(file, content);
});
console.log('Frontend Detyping Done!');
