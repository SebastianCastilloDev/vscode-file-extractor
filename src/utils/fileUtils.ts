import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { IGNORED_EXTENSIONS, IGNORED_PATH_PATTERNS } from '../config/constants';
import { OpenFileInfo, DocumentToExtract, ExtractionOptions, ExtractionResult, FolderFileInfo, FolderInfo, DirectoryTreeNode } from '../types/interfaces';

/**
 * Obtiene el directorio de salida de forma inteligente
 * Patrón: Single Source of Truth para la lógica de directorio
 */
export function getOutputDirectory(): string {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    if (workspaceFolder) {
        return workspaceFolder.uri.fsPath;
    }

    return process.cwd();
}

/**
 * Carga el árbol de directorios del workspace
 * Patrón: Factory Method para crear nodos del árbol
 */
export function loadWorkspaceDirectoryTree(): DirectoryTreeNode[] {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        return [];
    }

    return buildDirectoryTree(workspaceFolder.uri.fsPath, 0);
}

/**
 * Construye el árbol de directorios recursivamente
 * Patrón: Composite Pattern para estructura de árbol
 */
export function buildDirectoryTree(directoryPath: string, depth: number, maxDepth: number = 2): DirectoryTreeNode[] {
    const nodes: DirectoryTreeNode[] = [];
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    if (!workspaceFolder || depth > maxDepth) {
        return nodes;
    }

    try {
        const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(directoryPath, entry.name);
            const relativePath = path.relative(workspaceFolder.uri.fsPath, fullPath);

            // Verificar si debe ser ignorado
            if (shouldIgnoreFile(fullPath, entry.isDirectory())) {
                continue;
            }

            try {
                const stats = fs.statSync(fullPath);
                const uri = vscode.Uri.file(fullPath);

                const node: DirectoryTreeNode = {
                    path: fullPath,
                    name: entry.name,
                    relativePath,
                    uri,
                    isDirectory: entry.isDirectory(),
                    isExpanded: false,
                    isSelected: false,
                    size: entry.isDirectory() ? 0 : stats.size,
                    depth,
                    children: [],
                };

                // Si es directorio y no estamos en profundidad máxima, cargar hijos
                if (entry.isDirectory() && depth < maxDepth) {
                    node.children = buildDirectoryTree(fullPath, depth + 1, maxDepth);
                    // Establecer referencia padre en los hijos
                    node.children.forEach(child => child.parent = node);
                }

                nodes.push(node);
            } catch (error) {
                console.error(`Error al leer archivo ${fullPath}:`, error);
            }
        }

        // Ordenar: directorios primero, luego archivos
        return nodes.sort((a, b) => {
            if (a.isDirectory && !b.isDirectory) return -1;
            if (!a.isDirectory && b.isDirectory) return 1;
            return a.name.localeCompare(b.name);
        });

    } catch (error) {
        console.error(`Error al leer directorio ${directoryPath}:`, error);
        return nodes;
    }
}

/**
 * Carga hijos de un directorio específico (carga bajo demanda)
 * Patrón: Lazy Loading para optimizar rendimiento
 */
export function loadDirectoryChildren(directoryPath: string, depth: number): DirectoryTreeNode[] {
    return buildDirectoryTree(directoryPath, depth, depth + 1);
}

/**
 * Obtiene todos los archivos de un directorio seleccionado (recursivamente)
 * Patrón: Visitor Pattern para recorrer estructura de archivos
 */
export function getAllFilesFromDirectory(directoryPath: string): string[] {
    const files: string[] = [];

    function visitDirectory(dirPath: string): void {
        try {
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);

                // Verificar si debe ser ignorado
                if (shouldIgnoreFile(fullPath, entry.isDirectory())) {
                    continue;
                }

                if (entry.isDirectory()) {
                    // Recurrir en subdirectorios
                    visitDirectory(fullPath);
                } else {
                    // Agregar archivo
                    files.push(fullPath);
                }
            }
        } catch (error) {
            console.error(`Error al leer directorio ${dirPath}:`, error);
        }
    }

    visitDirectory(directoryPath);
    return files;
}

/**
 * Actualiza el estado de selección de un nodo y sus descendientes
 * Patrón: Command Pattern para operaciones de selección
 */
export function updateNodeSelection(node: DirectoryTreeNode, isSelected: boolean): void {
    node.isSelected = isSelected;

    // Si es un directorio, actualizar todos los descendientes
    if (node.isDirectory) {
        updateDescendantsSelection(node, isSelected);
    }

    // Actualizar estado del padre si es necesario
    if (node.parent) {
        updateParentSelection(node.parent);
    }
}

/**
 * Actualiza la selección de todos los descendientes
 */
function updateDescendantsSelection(node: DirectoryTreeNode, isSelected: boolean): void {
    node.children.forEach(child => {
        child.isSelected = isSelected;
        if (child.isDirectory) {
            updateDescendantsSelection(child, isSelected);
        }
    });
}

/**
 * Actualiza la selección del padre basado en el estado de los hijos
 */
function updateParentSelection(parent: DirectoryTreeNode): void {
    const allChildrenSelected = parent.children.every(child => child.isSelected);
    const someChildrenSelected = parent.children.some(child => child.isSelected);

    parent.isSelected = allChildrenSelected;

    // Si el padre tiene padre, continuar hacia arriba
    if (parent.parent) {
        updateParentSelection(parent.parent);
    }
}

/**
 * Encuentra un nodo en el árbol por su path
 * Patrón: Visitor Pattern para búsqueda en árbol
 */
export function findNodeByPath(tree: DirectoryTreeNode[], targetPath: string): DirectoryTreeNode | null {
    for (const node of tree) {
        if (node.path === targetPath) {
            return node;
        }

        if (node.children.length > 0) {
            const found = findNodeByPath(node.children, targetPath);
            if (found) {
                return found;
            }
        }
    }
    return null;
}

/**
 * Obtiene todos los archivos seleccionados del árbol
 * Patrón: Collector Pattern para recopilar elementos
 */
export function getSelectedFilesFromTree(tree: DirectoryTreeNode[]): string[] {
    const selectedFiles: string[] = [];

    function collectSelectedFiles(nodes: DirectoryTreeNode[]): void {
        for (const node of nodes) {
            if (node.isSelected) {
                if (node.isDirectory) {
                    // Si la carpeta está seleccionada, obtener todos sus archivos
                    selectedFiles.push(...getAllFilesFromDirectory(node.path));
                } else {
                    // Si es un archivo, agregarlo directamente
                    selectedFiles.push(node.path);
                }
            } else if (node.children.length > 0) {
                // Si el nodo no está seleccionado pero tiene hijos, verificar hijos
                collectSelectedFiles(node.children);
            }
        }
    }

    collectSelectedFiles(tree);
    return [...new Set(selectedFiles)]; // Eliminar duplicados
}

/**
 * Obtiene información de archivos abiertos en el editor
 * Patrón: Factory Method para crear objetos OpenFileInfo
 */
export function getOpenFiles(): OpenFileInfo[] {
    return vscode.window.tabGroups.all
        .flatMap((tabGroup) => tabGroup.tabs)
        .filter((tab) => isValidFile(tab))
        .map((tab) => createOpenFileInfo(tab));
}

/**
 * Obtiene archivos de una carpeta específica
 * Patrón: Factory Method para crear objetos FolderFileInfo
 */
export function getFolderFiles(folderPath: string): FolderFileInfo[] {
    try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            return [];
        }

        const files: FolderFileInfo[] = [];
        const entries = fs.readdirSync(folderPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(folderPath, entry.name);
            const relativePath = path.relative(workspaceFolder.uri.fsPath, fullPath);

            // Verificar si debe ser ignorado
            if (shouldIgnoreFile(fullPath, entry.isDirectory())) {
                continue;
            }

            try {
                const stats = fs.statSync(fullPath);
                const uri = vscode.Uri.file(fullPath);

                files.push({
                    path: fullPath,
                    name: entry.name,
                    size: entry.isDirectory() ? 0 : stats.size,
                    relativePath,
                    uri,
                    isDirectory: entry.isDirectory()
                });
            } catch (error) {
                console.error(`Error al leer archivo ${fullPath}:`, error);
            }
        }

        // Ordenar: directorios primero, luego archivos
        return files.sort((a, b) => {
            if (a.isDirectory && !b.isDirectory) return -1;
            if (!a.isDirectory && b.isDirectory) return 1;
            return a.name.localeCompare(b.name);
        });

    } catch (error) {
        console.error(`Error al leer carpeta ${folderPath}:`, error);
        return [];
    }
}

/**
 * Obtiene archivos de forma recursiva en una carpeta
 * Patrón: Visitor Pattern para recorrer estructura de archivos
 */
export function getFolderFilesRecursive(folderPath: string, maxDepth: number = 3): FolderFileInfo[] {
    const files: FolderFileInfo[] = [];
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    if (!workspaceFolder) {
        return files;
    }

    function visitDirectory(dirPath: string, currentDepth: number): void {
        if (currentDepth > maxDepth) return;

        try {
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);
                const relativePath = path.relative(workspaceFolder!.uri.fsPath, fullPath);

                // Verificar si debe ser ignorado
                if (shouldIgnoreFile(fullPath, entry.isDirectory())) {
                    continue;
                }

                try {
                    const stats = fs.statSync(fullPath);
                    const uri = vscode.Uri.file(fullPath);

                    if (entry.isDirectory()) {
                        files.push({
                            path: fullPath,
                            name: entry.name,
                            size: 0,
                            relativePath,
                            uri,
                            isDirectory: true
                        });

                        // Recurrir en subdirectorios
                        visitDirectory(fullPath, currentDepth + 1);
                    } else {
                        files.push({
                            path: fullPath,
                            name: entry.name,
                            size: stats.size,
                            relativePath,
                            uri,
                            isDirectory: false
                        });
                    }
                } catch (error) {
                    console.error(`Error al leer archivo ${fullPath}:`, error);
                }
            }
        } catch (error) {
            console.error(`Error al leer directorio ${dirPath}:`, error);
        }
    }

    visitDirectory(folderPath, 0);
    return files;
}

/**
 * Verifica si un archivo/carpeta debe ser ignorado
 * Patrón: Strategy Pattern para diferentes criterios de filtrado
 */
function shouldIgnoreFile(filePath: string, isDirectory: boolean): boolean {
    const fileName = path.basename(filePath);
    const extension = path.extname(filePath).toLowerCase();

    // Ignorar archivos ocultos
    if (fileName.startsWith('.')) {
        return true;
    }

    // Ignorar node_modules y otras carpetas comunes
    if (isDirectory) {
        const ignoredDirNames = ['node_modules', '.git', '.vscode', 'dist', 'build', 'out', 'coverage'];
        if (ignoredDirNames.includes(fileName)) {
            return true;
        }
    }

    // Verificar extensiones ignoradas
    if (!isDirectory && IGNORED_EXTENSIONS.includes(extension as any)) {
        return true;
    }

    // Verificar patrones ignorados
    if (IGNORED_PATH_PATTERNS.some((pattern) => filePath.includes(pattern))) {
        return true;
    }

    return false;
}

/**
 * Verifica si un tab es un archivo válido para extraer
 */
function isValidFile(tab: vscode.Tab): boolean {
    if (!(tab.input instanceof vscode.TabInputText)) {
        return false;
    }

    const uri = tab.input.uri;
    if (uri.scheme !== 'file') {
        return false;
    }

    const filePath = uri.fsPath;
    const extension = path.extname(filePath).toLowerCase();

    // Verificar extensiones ignoradas
    if (IGNORED_EXTENSIONS.includes(extension as any)) {
        return false;
    }

    // Verificar patrones ignorados
    if (IGNORED_PATH_PATTERNS.some((pattern) => filePath.includes(pattern))) {
        return false;
    }

    return true;
}

/**
 * Crea un objeto OpenFileInfo desde un tab
 * Patrón: Factory Method
 */
function createOpenFileInfo(tab: vscode.Tab): OpenFileInfo {
    const uri = (tab.input as vscode.TabInputText).uri;
    const filePath = uri.fsPath;
    const stats = fs.statSync(filePath);

    return {
        path: filePath,
        name: path.basename(filePath),
        size: stats.size,
        uri: uri
    };
}

/**
 * Extrae archivos seleccionados
 * Patrón: Command Pattern para encapsular la operación de extracción
 */
export async function extractFiles(
    selectedFiles: string[],
    options: ExtractionOptions
): Promise<ExtractionResult> {
    try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            return {
                success: false,
                filesExtracted: 0,
                outputPath: '',
                error: 'No se encontró carpeta de trabajo'
            };
        }

        const outputFilePath = path.join(options.outputDirectory, options.outputFileName);
        let fileContent = '';

        // Crear índice si está habilitado
        if (options.includeIndex) {
            fileContent += `Índice de archivos seleccionados (${options.mode === 'openFiles' ? 'Archivos Abiertos' : 'Carpetas'}):\n\n`;

            selectedFiles.forEach((filePath, index) => {
                const relativePath = path.relative(workspaceFolder.uri.fsPath, filePath);
                fileContent += `${index + 1}. ${relativePath}\n`;
            });

            fileContent += '\n\n';
        }

        // Leer y agregar contenido de cada archivo
        let extractedCount = 0;
        for (const filePath of selectedFiles) {
            try {
                // Verificar si es un directorio
                const stats = fs.statSync(filePath);
                if (stats.isDirectory()) {
                    continue; // Saltar directorios
                }

                const content = fs.readFileSync(filePath, 'utf-8');
                const relativePath = path.relative(workspaceFolder.uri.fsPath, filePath);
                const header = `
--------------------
${relativePath}
--------------------

`;
                fileContent += header + content + '\n\n';
                extractedCount++;
            } catch (error) {
                console.error(`Error leyendo archivo ${filePath}:`, error);
                // Continuar con otros archivos
            }
        }

        // Escribir archivo
        fs.writeFileSync(outputFilePath, fileContent);

        // Copiar al portapapeles si está habilitado
        if (options.copyToClipboard) {
            await vscode.env.clipboard.writeText(fileContent);
        }

        return {
            success: true,
            filesExtracted: extractedCount,
            outputPath: outputFilePath,
        };

    } catch (error) {
        return {
            success: false,
            filesExtracted: 0,
            outputPath: '',
            error: error instanceof Error ? error.message : 'Error desconocido'
        };
    }
}

/**
 * Obtiene documentos a extraer desde URIs
 * Patrón: Adapter Pattern para convertir URIs a DocumentToExtract
 */
export async function getDocumentsToExtract(uris: vscode.Uri[]): Promise<DocumentToExtract[]> {
    const documents: DocumentToExtract[] = [];

    for (const uri of uris) {
        try {
            const document = await vscode.workspace.openTextDocument(uri);
            documents.push({
                uri,
                content: document.getText(),
            });
        } catch (error) {
            console.error(`Error al abrir documento ${uri.fsPath}:`, error);
        }
    }

    return documents;
} 