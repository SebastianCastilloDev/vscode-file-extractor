import * as vscode from 'vscode';
import { COMMANDS } from '../config/constants';
import { createOrShowWebView } from '../ui/webview';

/**
 * Comando para abrir el panel visual de extracción
 * Patrón: Command Pattern para encapsular la lógica del comando
 */
export class OpenVisualPanelCommand {
    /**
     * Ejecuta el comando para abrir el panel visual
     */
    public static async execute(context: vscode.ExtensionContext): Promise<void> {
        try {
            // Validar workspace
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                vscode.window.showErrorMessage('No se encontró carpeta de trabajo');
                return;
            }

            // Crear o mostrar el WebView
            const webView = createOrShowWebView(context);

            // Mostrar mensaje informativo solo la primera vez
            if (!webView.isActive) {
                vscode.window.showInformationMessage(
                    '📁 Panel de extracción visual abierto. Selecciona los archivos que deseas extraer.'
                );
            }

        } catch (error) {
            console.error('Error in OpenVisualPanelCommand:', error);
            vscode.window.showErrorMessage(
                `Error al abrir panel visual: ${error instanceof Error ? error.message : 'Error desconocido'}`
            );
        }
    }

    /**
 * Registra el comando en el contexto
 * Patrón: Factory Method para registro de comandos
 */
    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        return vscode.commands.registerCommand(
            COMMANDS.openVisualPanel,
            () => OpenVisualPanelCommand.execute(context)
        );
    }
}
