import * as vscode from 'vscode';

// Información de archivo abierto
export interface OpenFileInfo {
    path: string;
    name: string;
    size: number;
    uri: vscode.Uri;
}

// Información de archivo en carpeta
export interface FolderFileInfo {
    path: string;
    name: string;
    size: number;
    relativePath: string;
    uri: vscode.Uri;
    isDirectory: boolean;
}

// Nodo del árbol de directorios
export interface DirectoryTreeNode {
    path: string;
    name: string;
    relativePath: string;
    uri: vscode.Uri;
    isDirectory: boolean;
    isExpanded: boolean;
    isSelected: boolean;          // Para selección de carpeta completa
    size: number;
    depth: number;                // Nivel de profundidad en el árbol
    children: DirectoryTreeNode[];
    parent?: DirectoryTreeNode;   // Referencia al padre
}

// Información de carpeta
export interface FolderInfo {
    path: string;
    name: string;
    relativePath: string;
    uri: vscode.Uri;
    isExpanded: boolean;
    files: FolderFileInfo[];
}

// Documento a extraer
export interface DocumentToExtract {
    uri: vscode.Uri;
    content: string;
}

// Modo de extracción
export type ExtractionMode = 'openFiles' | 'folders';

// Mensajes del WebView
export interface WebViewMessage {
    command: 'extract' | 'refresh' | 'toggleFolder' | 'browseFolder' | 'switchMode' | 'navigateToDirectory' | 'selectDirectory' | 'loadWorkspace';
    selectedFiles?: string[];
    mode?: ExtractionMode;
    folderPath?: string;
    directoryPath?: string;
    isSelected?: boolean;
}

// Opciones de extracción
export interface ExtractionOptions {
    outputDirectory: string;
    outputFileName: string;
    includeIndex: boolean;
    copyToClipboard: boolean;
    mode: ExtractionMode;
}

// Resultado de extracción
export interface ExtractionResult {
    success: boolean;
    filesExtracted: number;
    outputPath: string;
    error?: string;
}

// Estado del WebView
export interface WebViewState {
    mode: ExtractionMode;
    openFiles: OpenFileInfo[];
    folders: FolderInfo[];
    directoryTree: DirectoryTreeNode[];
    currentDirectory: string;
    selectedFiles: string[];
    selectedDirectories: string[];
}
