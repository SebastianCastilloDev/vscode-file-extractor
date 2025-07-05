import * as vscode from 'vscode';
import { EXTENSION_CONFIG, COMMANDS } from '../config/constants';
import { ExtractionOptions } from '../types/interfaces';
import { getOpenFiles, extractFiles, getDocumentsToExtract } from '../utils/fileUtils';
import { getRelativePathFromWorkspace } from '../utils/pathUtils';

/**
 * Comando para extraer todos los archivos abiertos
 * Patrón: Command Pattern para encapsular la lógica del comando
 */
export class ExtractOpenFilesCommand {
    /**
     * Ejecuta el comando de extracción
     */
    public static async execute(): Promise<void> {
        try {
            // Validar workspace
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                vscode.window.showErrorMessage('No se encontró carpeta de trabajo');
                return;
            }

            // Obtener archivos abiertos
            const openFiles = getOpenFiles();

            if (openFiles.length === 0) {
                vscode.window.showInformationMessage(
                    'No hay archivos válidos abiertos para extraer'
                );
                return;
            }

            // Mostrar información de progreso
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Extrayendo archivos...',
                cancellable: false
            }, async (progress) => {
                progress.report({ increment: 0, message: 'Preparando archivos...' });

                // Obtener documentos a extraer
                const uris = openFiles.map(file => file.uri);
                const documentsToExtract = await getDocumentsToExtract(uris);

                progress.report({ increment: 50, message: 'Generando contenido...' });

                // Configurar opciones de extracción
                const options: ExtractionOptions = {
                    outputDirectory: workspaceFolder.uri.fsPath,
                    outputFileName: EXTENSION_CONFIG.outputFileName,
                    includeIndex: true,
                    copyToClipboard: true,
                    mode: 'openFiles'
                };

                // Extraer archivos usando la lógica clásica
                const result = await ExtractOpenFilesCommand.extractWithClassicFormat(
                    documentsToExtract,
                    options,
                    workspaceFolder
                );

                progress.report({ increment: 100, message: 'Completado' });

                if (result.success) {
                    const relativeOutputPath = getRelativePathFromWorkspace(result.outputPath);
                    vscode.window.showInformationMessage(
                        `✅ ${result.filesExtracted} archivos extraídos a: ${relativeOutputPath} y copiados al portapapeles`
                    );
                } else {
                    vscode.window.showErrorMessage(
                        `❌ Error al extraer archivos: ${result.error}`
                    );
                }
            });

        } catch (error) {
            console.error('Error in ExtractOpenFilesCommand:', error);
            vscode.window.showErrorMessage(
                `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`
            );
        }
    }

    /**
     * Extrae archivos usando el formato clásico (manteniendo compatibilidad)
     * Patrón: Template Method para mantener el formato original
     */
    private static async extractWithClassicFormat(
        documentsToExtract: Array<{ uri: vscode.Uri; content: string }>,
        options: ExtractionOptions,
        workspaceFolder: vscode.WorkspaceFolder
    ): Promise<{ success: boolean; filesExtracted: number; outputPath: string; error?: string }> {
        try {
            const outputFilePath = `${options.outputDirectory}/${options.outputFileName}`;

            // Crear el contenido en formato clásico
            let fileContent = 'Índice de archivos:\n\n';

            // Agregar sección de índice
            documentsToExtract.forEach((doc, index) => {
                const relativePath = getRelativePathFromWorkspace(doc.uri.fsPath);
                fileContent += `${index + 1}. ${relativePath}\n`;
            });

            fileContent += '\n\n';

            // Agregar contenido de archivos
            documentsToExtract.forEach((doc) => {
                const relativePath = getRelativePathFromWorkspace(doc.uri.fsPath);
                const header = `
--------------------
${relativePath}
--------------------

`;
                fileContent += header + doc.content + '\n\n';
            });

            // Copiar contenido al portapapeles
            if (options.copyToClipboard) {
                await vscode.env.clipboard.writeText(fileContent);
            }

            // Escribir archivo con manejo de errores
            const fs = require('fs');
            fs.writeFileSync(outputFilePath, fileContent);

            return {
                success: true,
                filesExtracted: documentsToExtract.length,
                outputPath: outputFilePath
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
 * Registra el comando en el contexto
 * Patrón: Factory Method para registro de comandos
 */
    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        return vscode.commands.registerCommand(
            COMMANDS.extractOpenFiles,
            ExtractOpenFilesCommand.execute
        );
    }
}
