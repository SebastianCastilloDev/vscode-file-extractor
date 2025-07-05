import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Obtiene la ruta relativa desde el workspace
 * Patrón: Utility Pattern para funciones auxiliares
 */
export function getRelativePathFromWorkspace(filePath: string): string {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    if (!workspaceFolder) {
        return path.basename(filePath);
    }

    return path.relative(workspaceFolder.uri.fsPath, filePath);
}

/**
 * Formatea el tamaño de archivo en KB
 */
export function formatFileSize(bytes: number): string {
    const kb = Math.round(bytes / 1024);
    return `${kb} KB`;
}

/**
 * Obtiene la extensión de archivo limpia
 */
export function getCleanExtension(filePath: string): string {
    return path.extname(filePath).toLowerCase();
}

/**
 * Verifica si una ruta es válida para mostrar al usuario
 */
export function isDisplayablePath(filePath: string): boolean {
    // Evitar rutas muy largas o con caracteres especiales problemáticos
    const cleanPath = getRelativePathFromWorkspace(filePath);
    return cleanPath.length < 100 && !cleanPath.includes('..'.repeat(10));
}

/**
 * Crea un nombre de archivo único si ya existe
 */
export function createUniqueFileName(basePath: string, fileName: string): string {
    const fullPath = path.join(basePath, fileName);
    const fs = require('fs');

    if (!fs.existsSync(fullPath)) {
        return fileName;
    }

    const ext = path.extname(fileName);
    const name = path.basename(fileName, ext);
    let counter = 1;

    while (fs.existsSync(path.join(basePath, `${name}_${counter}${ext}`))) {
        counter++;
    }

    return `${name}_${counter}${ext}`;
}
