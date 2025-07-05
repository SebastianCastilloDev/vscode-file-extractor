// Constantes de configuración para la extensión
export const EXTENSION_CONFIG = {
    outputFileName: 'extracted_files.txt',
    webviewViewType: 'fileExtractor',
    webviewTitle: '📁 File Extractor',
} as const;

// Extensiones de archivos ignoradas
export const IGNORED_EXTENSIONS = [
    '.png',
    '.jpg',
    '.jpeg',
    '.svg',
    '.avif',
    '.webp',
    '.ttf',
    '.woff',
    '.woff2',
    '.eot',
    '.ico',
    '.gif',
    '.bmp',
    '.tiff',
    '.pdf',
    '.zip',
    '.rar',
    '.tar',
    '.gz',
    '.7z',
] as const;

// Patrones de rutas que queremos ignorar
export const IGNORED_PATH_PATTERNS = [
    '../../../../../',
    'response_',
    'extracted_files.txt',
    'node_modules',
    '.git',
    'dist',
    'build',
    '.vscode',
] as const;

// Comandos de la extensión
export const COMMANDS = {
    extractOpenFiles: 'vscode-file-extractor.extractOpenFiles',
    openVisualPanel: 'vscode-file-extractor.openVisualPanel',
} as const; 