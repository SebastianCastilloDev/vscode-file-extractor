#!/bin/bash

# ========================================
# VS Code File Extractor - Clean Script
# ========================================

echo "🧹 Cleaning VS Code File Extractor project..."

# ==========================================
# Remove Build Output
# ==========================================
echo "🗑️  Removing build output..."
rm -rf out/
echo "   ✅ out/ directory removed"

# ==========================================
# Remove Generated Packages
# ==========================================
echo "📦 Removing generated packages..."
rm -f *.vsix
echo "   ✅ .vsix files removed"

# ==========================================
# Remove Node Modules (optional)
# ==========================================
read -p "🔄 Do you want to remove node_modules? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removing node_modules..."
    rm -rf node_modules/
    echo "   ✅ node_modules/ removed"
    echo "   ℹ️  Run 'npm install' to restore dependencies"
fi

# ==========================================
# Remove Logs
# ==========================================
echo "📄 Removing log files..."
rm -f *.log
rm -f npm-debug.log*
rm -f yarn-debug.log*
rm -f yarn-error.log*
echo "   ✅ Log files removed"

# ==========================================
# Remove Cache Files
# ==========================================
echo "🗂️  Removing cache files..."
rm -rf .npm/
rm -f .eslintcache
rm -f .stylelintcache
echo "   ✅ Cache files removed"

# ==========================================
# Remove Temporary Files
# ==========================================
echo "🗑️  Removing temporary files..."
rm -rf tmp/
rm -rf temp/
rm -f *.tmp
rm -f *.temp
echo "   ✅ Temporary files removed"

# ==========================================
# Remove OS Generated Files
# ==========================================
echo "💻 Removing OS generated files..."
find . -name ".DS_Store" -delete 2>/dev/null || true
find . -name "Thumbs.db" -delete 2>/dev/null || true
find . -name "Desktop.ini" -delete 2>/dev/null || true
echo "   ✅ OS files removed"

# ==========================================
# Remove Extension Output Files
# ==========================================
echo "📁 Removing extension output files..."
rm -f extracted_files*.txt
echo "   ✅ Extension output files removed"

echo ""
echo "✨ Cleanup completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Run 'npm install' if you removed node_modules"
echo "   2. Run 'npm run compile' to rebuild"
echo "   3. Run 'npm run build-and-package' to create new .vsix"
echo "" 