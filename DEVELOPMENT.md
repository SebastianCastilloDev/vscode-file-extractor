# Development Guide - VS Code File Extractor

## 🚀 Getting Started

### Prerequisites
- Node.js 16 or higher
- VS Code 1.60.0 or higher
- Git

### Setup
```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Start development
npm run watch
```

## 📁 Project Structure

```
vscode-file-extractor/
├── 📄 .gitignore             # Git ignore rules
├── 📄 package.json           # Project configuration
├── 📄 tsconfig.json          # TypeScript config
├── 📄 README.md              # User documentation
├── 📄 ARCHITECTURE.md        # Technical documentation
├── 📄 DEVELOPMENT.md         # This file
├── 📁 src/                   # Source code (TypeScript)
├── 📁 out/                   # Compiled output (ignored by git)
├── 📁 scripts/               # Development scripts
├── 📁 node_modules/          # Dependencies (ignored by git)
└── 📦 *.vsix                 # Generated packages (ignored by git)
```

## 🛠️ Development Scripts

### Building & Compilation
```bash
# Compile once
npm run compile

# Watch mode (auto-compile on changes)
npm run watch

# Rebuild everything
npm run rebuild
```

### Packaging
```bash
# Create .vsix package
npm run package-new

# Build and package in one step
npm run build-and-package
```

### Cleaning
```bash
# Interactive cleanup
npm run clean

# Clean and reinstall dependencies
npm run clean:all

# Check what files are being ignored
npm run check-ignored
```

### Testing & Quality
```bash
# Run linter
npm run lint

# Run tests
npm run test
```

## 🗂️ Git & .gitignore

### What's Ignored
- **Build Output**: `out/`, `*.js`, `*.js.map`
- **Packages**: `*.vsix`
- **Dependencies**: `node_modules/`
- **System Files**: `.DS_Store`, `Thumbs.db`, etc.
- **IDE Settings**: `.vscode/settings.json`, etc.
- **Logs**: `*.log`, `npm-debug.log*`
- **Cache**: `.npm`, `.eslintcache`
- **Temporary**: `tmp/`, `temp/`
- **Extension Output**: `extracted_files*.txt`

### What's Tracked
- **Source Code**: All `.ts` files in `src/`
- **Configuration**: `package.json`, `tsconfig.json`
- **Documentation**: `*.md` files
- **Build Config**: `.vscodeignore`
- **Dependencies Lock**: `package-lock.json` (optional)

### Git Best Practices
```bash
# Before committing, clean generated files
npm run clean

# Check what will be committed
git status

# Check ignored files
npm run check-ignored

# Typical commit flow
git add .
git commit -m "feat: your feature description"
```

## 🔄 Development Workflow

### 1. Start Development
```bash
# Terminal 1: Watch mode
npm run watch

# Terminal 2: VS Code with extension
code .
# Press F5 to launch Extension Development Host
```

### 2. Make Changes
- Edit TypeScript files in `src/`
- Files auto-compile in watch mode
- Reload Extension Development Host (Ctrl+R)

### 3. Test Changes
- Test in Extension Development Host
- Use command palette to test commands
- Check console for logs

### 4. Package for Distribution
```bash
# Clean previous builds
npm run clean

# Build and package
npm run build-and-package

# Install in VS Code/Cursor
# Extensions → Install from VSIX
```

## 📊 File Size Guidelines

### Keep These Small
- Individual `.ts` files: < 300 lines
- Functions: < 50 lines
- Interfaces: < 20 properties

### Monitor These
- `package.json`: Keep dependencies minimal
- `.vsix` file: Should be < 50KB for basic extension

## 🧹 Cleaning Strategy

### Before Git Operations
```bash
# Clean everything
npm run clean

# Check what's tracked
git status
```

### Before Packaging
```bash
# Full rebuild
npm run rebuild

# Create clean package
npm run build-and-package
```

### Weekly Maintenance
```bash
# Full cleanup and dependency refresh
npm run clean:all
```

## 🚨 Common Issues

### "Extension not loading"
```bash
# Recompile
npm run compile

# Check for TypeScript errors
# Reload Extension Development Host
```

### "Files not ignored"
```bash
# Check .gitignore syntax
# Remove from tracking:
git rm --cached <file>

# Check ignored files:
npm run check-ignored
```

### "Package too large"
```bash
# Clean before packaging
npm run clean

# Check what's included:
npx @vscode/vsce ls
```

## 📈 Performance Tips

- Use `npm run watch` during development
- Clean regularly with `npm run clean`
- Monitor .vsix size after changes
- Test in fresh VS Code instance

## 🔧 Troubleshooting

### Reset Everything
```bash
npm run clean:all
npm run rebuild
```

### Check Dependencies
```bash
npm audit
npm audit fix
```

### Debug Git Issues
```bash
git status --ignored
git clean -fd
``` 