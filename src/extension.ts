import * as vscode from 'vscode';
import { ExtractOpenFilesCommand } from './commands/extractCommand';
import { OpenVisualPanelCommand } from './commands/visualCommand';

/**
 * Función de activación de la extensión
 * Patrón: Facade Pattern para simplificar la inicialización
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('🚀 VS Code File Extractor está activándose...');

  try {
    // Registrar comando original de extracción
    const extractCommand = ExtractOpenFilesCommand.register(context);
    context.subscriptions.push(extractCommand);

    // Registrar comando visual
    const visualCommand = OpenVisualPanelCommand.register(context);
    context.subscriptions.push(visualCommand);

    console.log('✅ VS Code File Extractor se ha activado correctamente');
    console.log('📋 Comandos disponibles:');
    console.log('  - Extract Open Files to Text File');
    console.log('  - 📁 Open Visual File Extractor');

  } catch (error) {
    console.error('❌ Error al activar la extensión:', error);
    vscode.window.showErrorMessage(
      `Error al activar VS Code File Extractor: ${error instanceof Error ? error.message : 'Error desconocido'}`
    );
  }
}

/**
 * Función de desactivación de la extensión
 * Patrón: Cleanup Pattern para liberar recursos
 */
export function deactivate() {
  console.log('🔄 VS Code File Extractor se está desactivando...');
  // Los recursos se limpian automáticamente a través de context.subscriptions
  console.log('✅ VS Code File Extractor desactivado correctamente');
}
