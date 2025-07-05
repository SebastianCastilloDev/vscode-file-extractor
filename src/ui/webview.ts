import * as vscode from 'vscode';
import { EXTENSION_CONFIG } from '../config/constants';
import { ExtractionMode, ExtractionOptions, WebViewMessage, WebViewState } from '../types/interfaces';
import {
    extractFiles,
    findNodeByPath,
    getOpenFiles,
    getSelectedFilesFromTree,
    loadDirectoryChildren,
    loadWorkspaceDirectoryTree,
    updateNodeSelection
} from '../utils/fileUtils';
import { getRelativePathFromWorkspace } from '../utils/pathUtils';
import { generateWebViewContent } from './templates';

/**
 * Clase para manejar el WebView Panel
 * Patrón: Facade Pattern para simplificar la interacción con el WebView
 */
export class FileExtractorWebView {
    private panel: vscode.WebviewPanel;
    private context: vscode.ExtensionContext;
    private state: WebViewState;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.state = {
            mode: 'openFiles',
            openFiles: [],
            folders: [],
            directoryTree: [],
            currentDirectory: '',
            selectedFiles: [],
            selectedDirectories: []
        };
        this.panel = this.createWebviewPanel();
        this.setupWebview();
    }

    /**
     * Crea el panel del WebView
     * Patrón: Factory Method para crear objetos complejos
     */
    private createWebviewPanel(): vscode.WebviewPanel {
        return vscode.window.createWebviewPanel(
            EXTENSION_CONFIG.webviewViewType,
            EXTENSION_CONFIG.webviewTitle,
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: []
            }
        );
    }

    /**
     * Configura el WebView con contenido inicial y listeners
     */
    private setupWebview(): void {
        this.updateWebviewContent();
        this.setupMessageHandlers();
        this.setupDisposables();
    }

    /**
     * Actualiza el contenido del WebView
     */
    private updateWebviewContent(): void {
        if (this.state.mode === 'openFiles') {
            this.state.openFiles = getOpenFiles();
        } else if (this.state.directoryTree.length === 0) {
            // Cargar árbol de directorios del workspace la primera vez
            this.loadWorkspaceTree();
        }

        this.panel.webview.html = generateWebViewContent(this.state);
    }

    /**
     * Carga el árbol de directorios del workspace
     */
    private loadWorkspaceTree(): void {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (workspaceFolder) {
            this.state.currentDirectory = workspaceFolder.uri.fsPath;
            this.state.directoryTree = loadWorkspaceDirectoryTree();
        }
    }

    /**
     * Configura los manejadores de mensajes
     * Patrón: Command Pattern para manejar mensajes
     */
    private setupMessageHandlers(): void {
        this.panel.webview.onDidReceiveMessage(
            async (message: WebViewMessage) => {
                try {
                    await this.handleWebviewMessage(message);
                } catch (error) {
                    console.error('Error handling webview message:', error);
                    vscode.window.showErrorMessage(
                        `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`
                    );
                }
            },
            undefined,
            this.context.subscriptions
        );
    }

    /**
     * Maneja los mensajes del WebView
     * Patrón: Strategy Pattern para diferentes tipos de mensajes
     */
    private async handleWebviewMessage(message: WebViewMessage): Promise<void> {
        switch (message.command) {
            case 'extract':
                await this.handleExtractCommand(message.selectedFiles || []);
                break;
            case 'refresh':
                await this.handleRefreshCommand();
                break;
            case 'switchMode':
                await this.handleSwitchModeCommand(message.mode || 'openFiles');
                break;
            case 'loadWorkspace':
                await this.handleLoadWorkspaceCommand();
                break;
            case 'navigateToDirectory':
                await this.handleNavigateToDirectoryCommand(message.directoryPath || '');
                break;
            case 'selectDirectory':
                await this.handleSelectDirectoryCommand(message.directoryPath || '', message.isSelected || false);
                break;
            case 'toggleFolder':
                await this.handleToggleFolderCommand(message.folderPath || '');
                break;
            default:
                console.warn('Unknown webview message command:', message.command);
        }
    }

    /**
     * Maneja el comando de extracción
     */
    private async handleExtractCommand(selectedFiles: string[]): Promise<void> {
        // Si estamos en modo carpetas, usar archivos del árbol
        if (this.state.mode === 'folders') {
            selectedFiles = getSelectedFilesFromTree(this.state.directoryTree);
        }

        if (selectedFiles.length === 0) {
            vscode.window.showWarningMessage('Por favor selecciona al menos un archivo o carpeta');
            return;
        }

        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No se encontró carpeta de trabajo');
            return;
        }

        // Mostrar barra de progreso
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Extrayendo archivos...',
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0 });

            // Configurar opciones de extracción
            const options: ExtractionOptions = {
                outputDirectory: workspaceFolder.uri.fsPath,
                outputFileName: EXTENSION_CONFIG.outputFileName,
                includeIndex: true,
                copyToClipboard: true,
                mode: this.state.mode
            };

            progress.report({ increment: 50 });

            // Extraer archivos
            const result = await extractFiles(selectedFiles, options);

            progress.report({ increment: 100 });

            if (result.success) {
                const relativeOutputPath = getRelativePathFromWorkspace(result.outputPath);
                const modeLabel = this.state.mode === 'openFiles' ? 'archivos abiertos' : 'árbol de carpetas';
                vscode.window.showInformationMessage(
                    `✅ ${result.filesExtracted} archivos extraídos del ${modeLabel} a: ${relativeOutputPath} y copiados al portapapeles`
                );
            } else {
                vscode.window.showErrorMessage(
                    `❌ Error al extraer archivos: ${result.error}`
                );
            }
        });
    }

    /**
     * Maneja el comando de actualización
     */
    private async handleRefreshCommand(): Promise<void> {
        if (this.state.mode === 'openFiles') {
            this.state.openFiles = getOpenFiles();
        } else {
            // Refrescar árbol de directorios
            this.loadWorkspaceTree();
        }

        this.panel.webview.html = generateWebViewContent(this.state);
        vscode.window.showInformationMessage('📄 Lista actualizada');
    }

    /**
     * Maneja el cambio de modo
     */
    private async handleSwitchModeCommand(mode: ExtractionMode): Promise<void> {
        this.state.mode = mode;
        this.state.selectedFiles = [];
        this.state.selectedDirectories = [];

        if (mode === 'openFiles') {
            this.state.openFiles = getOpenFiles();
        } else {
            // Cargar árbol si no está cargado
            if (this.state.directoryTree.length === 0) {
                this.loadWorkspaceTree();
            }
        }

        this.panel.webview.html = generateWebViewContent(this.state);

        const modeLabel = mode === 'openFiles' ? 'Archivos Abiertos' : 'Árbol de Carpetas';
        vscode.window.showInformationMessage(`🔄 Modo cambiado a: ${modeLabel}`);
    }

    /**
     * Maneja el comando de cargar workspace
     */
    private async handleLoadWorkspaceCommand(): Promise<void> {
        this.loadWorkspaceTree();
        this.panel.webview.html = generateWebViewContent(this.state);
        vscode.window.showInformationMessage('📁 Árbol de workspace cargado');
    }

    /**
     * Maneja la navegación a un directorio (expandir/contraer)
     */
    private async handleNavigateToDirectoryCommand(directoryPath: string): Promise<void> {
        const node = findNodeByPath(this.state.directoryTree, directoryPath);
        if (!node || !node.isDirectory) {
            return;
        }

        // Toggle expansión
        node.isExpanded = !node.isExpanded;

        // Si se está expandiendo y no tiene hijos cargados, cargarlos
        if (node.isExpanded && node.children.length === 0) {
            const children = loadDirectoryChildren(directoryPath, node.depth + 1);
            node.children = children;
            // Establecer referencia padre
            node.children.forEach(child => child.parent = node);
        }

        this.panel.webview.html = generateWebViewContent(this.state);
    }

    /**
     * Maneja la selección de un directorio o archivo
     */
    private async handleSelectDirectoryCommand(directoryPath: string, isSelected: boolean): Promise<void> {
        const node = findNodeByPath(this.state.directoryTree, directoryPath);
        if (!node) {
            return;
        }

        // Actualizar selección del nodo y sus descendientes/ancestros
        updateNodeSelection(node, isSelected);

        // Actualizar estado global
        if (node.isDirectory) {
            if (isSelected) {
                if (!this.state.selectedDirectories.includes(directoryPath)) {
                    this.state.selectedDirectories.push(directoryPath);
                }
            } else {
                this.state.selectedDirectories = this.state.selectedDirectories.filter(
                    path => path !== directoryPath
                );
            }
        } else {
            if (isSelected) {
                if (!this.state.selectedFiles.includes(directoryPath)) {
                    this.state.selectedFiles.push(directoryPath);
                }
            } else {
                this.state.selectedFiles = this.state.selectedFiles.filter(
                    path => path !== directoryPath
                );
            }
        }

        this.panel.webview.html = generateWebViewContent(this.state);
    }

    /**
     * Maneja el toggle de carpeta (para compatibilidad con versión anterior)
     */
    private async handleToggleFolderCommand(folderPath: string): Promise<void> {
        // Redirigir a navegación de directorio
        await this.handleNavigateToDirectoryCommand(folderPath);
    }

    /**
     * Configura la limpieza de recursos
     * Patrón: Disposable Pattern para limpieza de recursos
     */
    private setupDisposables(): void {
        this.panel.onDidDispose(
            () => {
                // Limpieza cuando se cierra el panel
                console.log('WebView panel disposed');
            },
            null,
            this.context.subscriptions
        );
    }

    /**
     * Revela el panel si está oculto
     */
    public reveal(): void {
        this.panel.reveal(vscode.ViewColumn.Two);
    }

    /**
     * Dispone el panel
     */
    public dispose(): void {
        this.panel.dispose();
    }

    /**
     * Verifica si el panel está activo
     */
    public get isActive(): boolean {
        return this.panel.active;
    }
}

/**
 * Función utilitaria para crear o reutilizar el WebView
 * Patrón: Singleton Pattern para evitar múltiples instancias
 */
let currentWebView: FileExtractorWebView | undefined;

export function createOrShowWebView(context: vscode.ExtensionContext): FileExtractorWebView {
    if (currentWebView) {
        currentWebView.reveal();
        return currentWebView;
    }

    currentWebView = new FileExtractorWebView(context);

    // Limpiar referencia cuando se cierre
    currentWebView.dispose = () => {
        if (currentWebView) {
            currentWebView.dispose();
            currentWebView = undefined;
        }
    };

    return currentWebView;
}
