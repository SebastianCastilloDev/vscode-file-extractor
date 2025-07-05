import { OpenFileInfo, FolderFileInfo, FolderInfo, WebViewState, DirectoryTreeNode } from '../types/interfaces';
import { formatFileSize, getRelativePathFromWorkspace } from '../utils/pathUtils';

/**
 * Genera el HTML completo del WebView
 * Patrón: Template Method para generar UI consistente
 */
export function generateWebViewContent(state: WebViewState): string {
    const modeContent = state.mode === 'openFiles'
        ? generateOpenFilesContent(state.openFiles)
        : generateDirectoryTreeContent(state.directoryTree);

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Extractor de Archivos</title>
      <style>
        ${getWebViewStyles()}
      </style>
    </head>
    <body>
      ${generateHeaderHTML(state)}
      ${generateModeToggleHTML(state.mode)}
      ${generateControlsHTML(state.mode)}
      ${modeContent}
      ${generateStatsHTML(state)}
      <script>
        ${getWebViewScript()}
      </script>
    </body>
    </html>
  `;
}

/**
 * Genera el HTML para modo archivos abiertos
 */
function generateOpenFilesContent(files: OpenFileInfo[]): string {
    if (files.length === 0) {
        return `
        <div class="empty-state">
          <h3>📄 No hay archivos abiertos</h3>
          <p>Abre algunos archivos en el editor para verlos aquí</p>
        </div>
        `;
    }

    const fileItems = files.map(file => generateFileItemHTML(file)).join('');
    return `
    <div class="file-list">
      ${fileItems}
    </div>
    `;
}

/**
 * Genera el HTML para el árbol de directorios
 */
function generateDirectoryTreeContent(tree: DirectoryTreeNode[]): string {
    if (tree.length === 0) {
        return `
        <div class="empty-state">
          <h3>📁 Cargando árbol de directorios...</h3>
          <p>Usa el botón "🔄 Cargar Workspace" si no aparece automáticamente</p>
        </div>
        `;
    }

    const treeItems = tree.map(node => generateTreeNodeHTML(node)).join('');
    return `
    <div class="directory-tree">
      ${treeItems}
    </div>
    `;
}

/**
 * Genera el HTML de un nodo del árbol de directorios
 */
function generateTreeNodeHTML(node: DirectoryTreeNode): string {
    const indent = '  '.repeat(node.depth);
    const icon = node.isDirectory ? (node.isExpanded ? '📂' : '📁') : '📄';
    const toggleIcon = node.isDirectory ? (node.isExpanded ? '▼' : '▶') : '';
    const sizeFormatted = node.isDirectory ? '' : formatFileSize(node.size);

    // Clases CSS dinámicas
    const nodeClasses = [
        'tree-node',
        node.isDirectory ? 'directory' : 'file',
        node.isSelected ? 'selected' : '',
        node.isExpanded ? 'expanded' : ''
    ].filter(c => c).join(' ');

    // HTML del nodo principal
    let nodeHTML = `
    <div class="${nodeClasses}" data-path="${node.path}" data-depth="${node.depth}">
      <div class="tree-node-content">
        ${node.isDirectory ? `
          <span class="tree-toggle" onclick="toggleDirectory('${node.path}')">${toggleIcon}</span>
        ` : `
          <span class="tree-spacer"></span>
        `}
        <input type="checkbox" 
               id="node-${node.path}" 
               value="${node.path}" 
               ${node.isSelected ? 'checked' : ''}
               onchange="selectNode('${node.path}', this.checked)">
        <label for="node-${node.path}" class="tree-label">
          <span class="tree-icon">${icon}</span>
          <span class="tree-name">${node.name}</span>
          ${sizeFormatted ? `<span class="tree-size">${sizeFormatted}</span>` : ''}
        </label>
      </div>
    `;

    // Agregar hijos si el nodo está expandido
    if (node.isDirectory && node.isExpanded && node.children.length > 0) {
        const childrenHTML = node.children.map(child => generateTreeNodeHTML(child)).join('');
        nodeHTML += `
        <div class="tree-children">
          ${childrenHTML}
        </div>
        `;
    }

    nodeHTML += `</div>`;
    return nodeHTML;
}

/**
 * Genera el HTML de un item de archivo (modo archivos abiertos)
 */
function generateFileItemHTML(file: OpenFileInfo): string {
    const relativePath = getRelativePathFromWorkspace(file.path);
    const sizeFormatted = formatFileSize(file.size);

    return `
    <div class="file-item">
      <input type="checkbox" id="${file.path}" value="${file.path}" checked>
      <label for="${file.path}">
        <span class="file-name">${file.name}</span>
        <span class="file-size">${sizeFormatted}</span>
        <span class="file-path">${relativePath}</span>
      </label>
    </div>
  `;
}

/**
 * Genera el HTML del header
 */
function generateHeaderHTML(state: WebViewState): string {
    const title = state.mode === 'openFiles'
        ? 'Extractor de Archivos Abiertos'
        : 'Navegador de Árbol de Directorios';

    const description = state.mode === 'openFiles'
        ? `Archivos abiertos en el editor (${state.openFiles.length} encontrados)`
        : `Explora y selecciona archivos/carpetas del proyecto`;

    return `
    <div class="header">
      <h1>📁 ${title}</h1>
      <p>${description}</p>
    </div>
  `;
}

/**
 * Genera el HTML del toggle de modo
 */
function generateModeToggleHTML(mode: string): string {
    return `
    <div class="mode-toggle">
      <button class="mode-btn ${mode === 'openFiles' ? 'active' : ''}" onclick="switchMode('openFiles')">
        📄 Archivos Abiertos
      </button>
      <button class="mode-btn ${mode === 'folders' ? 'active' : ''}" onclick="switchMode('folders')">
        🌳 Árbol de Directorios
      </button>
    </div>
  `;
}

/**
 * Genera el HTML de los controles
 */
function generateControlsHTML(mode: string): string {
    const modeSpecificControls = mode === 'folders'
        ? '<button class="btn btn-secondary" onclick="loadWorkspace()">🔄 Cargar Workspace</button>'
        : '';

    return `
    <div class="controls">
      <button class="btn" onclick="extractFiles()">🚀 Extraer Seleccionados</button>
      <button class="btn btn-secondary" onclick="toggleAll()">☑️ Alternar Todos</button>
      <button class="btn btn-secondary" onclick="refreshFiles()">🔄 Actualizar</button>
      ${modeSpecificControls}
    </div>
  `;
}

/**
 * Genera el HTML de las estadísticas
 */
function generateStatsHTML(state: WebViewState): string {
    let totalFiles = 0;
    let selectedCount = 0;

    if (state.mode === 'openFiles') {
        totalFiles = state.openFiles.length;
        // En modo archivos abiertos, contar checkboxes marcados
    } else {
        // En modo árbol, contar archivos en el árbol
        totalFiles = countFilesInTree(state.directoryTree);
        selectedCount = state.selectedFiles.length + state.selectedDirectories.length;
    }

    return `
    <div class="stats">
      <span id="selectedCount">${selectedCount}</span> elementos seleccionados de ${totalFiles} archivos disponibles
      ${state.mode === 'folders' && state.selectedDirectories.length > 0 ? `
        <div class="selected-folders">
          <small>📁 ${state.selectedDirectories.length} carpeta(s) completa(s) seleccionada(s)</small>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Cuenta archivos en el árbol recursivamente
 */
function countFilesInTree(tree: DirectoryTreeNode[]): number {
    let count = 0;
    for (const node of tree) {
        if (!node.isDirectory) {
            count++;
        }
        if (node.children.length > 0) {
            count += countFilesInTree(node.children);
        }
    }
    return count;
}

/**
 * Estilos CSS del WebView
 * Patrón: Separation of Concerns para separar estilo de estructura
 */
function getWebViewStyles(): string {
    return `
    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      background-color: var(--vscode-editor-background);
      padding: 20px;
      margin: 0;
      line-height: 1.4;
    }
    
    .header {
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--vscode-panel-border);
    }
    
    .header h1 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    
    .header p {
      margin: 8px 0 0 0;
      color: var(--vscode-descriptionForeground);
    }
    
    .mode-toggle {
      display: flex;
      gap: 8px;
      margin-bottom: 15px;
      padding: 8px;
      background-color: var(--vscode-textCodeBlock-background);
      border-radius: 6px;
      border: 1px solid var(--vscode-panel-border);
    }
    
    .mode-btn {
      flex: 1;
      padding: 8px 16px;
      border: none;
      background-color: transparent;
      color: var(--vscode-foreground);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .mode-btn:hover {
      background-color: var(--vscode-list-hoverBackground);
    }
    
    .mode-btn.active {
      background-color: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
    }
    
    .controls {
      margin-bottom: 20px;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    .btn {
      background-color: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      transition: background-color 0.2s;
    }
    
    .btn:hover {
      background-color: var(--vscode-button-hoverBackground);
    }
    
    .btn-secondary {
      background-color: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
    }
    
    .btn-secondary:hover {
      background-color: var(--vscode-button-secondaryHoverBackground);
    }
    
    .file-list, .directory-tree {
      max-height: 500px;
      overflow-y: auto;
      margin-bottom: 20px;
      border: 1px solid var(--vscode-panel-border);
      border-radius: 4px;
      padding: 8px;
    }
    
    .file-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 8px;
      padding: 12px;
      border-radius: 4px;
      background-color: var(--vscode-list-inactiveSelectionBackground);
      transition: background-color 0.2s;
    }
    
    .file-item:hover {
      background-color: var(--vscode-list-hoverBackground);
    }
    
    .file-item input[type="checkbox"] {
      margin-right: 12px;
      margin-top: 2px;
    }
    
    .file-item label {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      flex-grow: 1;
      min-width: 0;
    }
    
    .file-name {
      font-weight: 600;
      margin-bottom: 4px;
      color: var(--vscode-editor-foreground);
    }
    
    .file-size {
      font-size: 12px;
      color: var(--vscode-descriptionForeground);
      margin-bottom: 2px;
    }
    
    .file-path {
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      opacity: 0.8;
      font-family: var(--vscode-editor-font-family);
      word-break: break-all;
    }
    
    /* Estilos del árbol de directorios */
    .tree-node {
      margin: 2px 0;
      user-select: none;
    }
    
    .tree-node.selected > .tree-node-content {
      background-color: var(--vscode-list-activeSelectionBackground);
      color: var(--vscode-list-activeSelectionForeground);
    }
    
    .tree-node-content {
      display: flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 3px;
      transition: background-color 0.2s;
      cursor: pointer;
    }
    
    .tree-node-content:hover {
      background-color: var(--vscode-list-hoverBackground);
    }
    
    .tree-toggle {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 4px;
      cursor: pointer;
      font-size: 10px;
      color: var(--vscode-descriptionForeground);
    }
    
    .tree-toggle:hover {
      background-color: var(--vscode-toolbar-hoverBackground);
      border-radius: 2px;
    }
    
    .tree-spacer {
      width: 16px;
      margin-right: 4px;
    }
    
    .tree-node input[type="checkbox"] {
      margin-right: 8px;
    }
    
    .tree-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      flex-grow: 1;
      min-width: 0;
    }
    
    .tree-icon {
      margin-right: 6px;
      font-size: 14px;
    }
    
    .tree-name {
      font-weight: 500;
      flex-grow: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .tree-size {
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      margin-left: 8px;
    }
    
    .tree-children {
      margin-left: 20px;
      border-left: 1px solid var(--vscode-panel-border);
      padding-left: 8px;
    }
    
    .tree-node.directory > .tree-node-content {
      font-weight: 500;
    }
    
    .tree-node.file > .tree-node-content {
      opacity: 0.9;
    }
    
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--vscode-descriptionForeground);
    }
    
    .empty-state h3 {
      margin-bottom: 8px;
      color: var(--vscode-foreground);
    }
    
    .stats {
      padding: 12px;
      background-color: var(--vscode-textCodeBlock-background);
      border-radius: 4px;
      border: 1px solid var(--vscode-panel-border);
      font-size: 13px;
      text-align: center;
    }
    
    .selected-folders {
      margin-top: 4px;
    }
    
    .selected-folders small {
      color: var(--vscode-descriptionForeground);
    }
    
    #selectedCount {
      font-weight: 600;
      color: var(--vscode-textLink-foreground);
    }
  `;
}

/**
 * JavaScript del WebView
 * Patrón: Module Pattern para encapsular funcionalidad
 */
function getWebViewScript(): string {
    return `
    const vscode = acquireVsCodeApi();
    let currentMode = 'openFiles';
    
    // Función para extraer archivos seleccionados
    function extractFiles() {
      let selectedFiles = [];
      
      if (currentMode === 'openFiles') {
        const checkboxes = document.querySelectorAll('.file-list input[type="checkbox"]:checked');
        selectedFiles = Array.from(checkboxes).map(cb => cb.value);
      } else {
        // En modo árbol, los archivos se calculan en el backend
        const anySelected = document.querySelectorAll('.tree-node input[type="checkbox"]:checked').length > 0;
        if (!anySelected) {
          vscode.postMessage({
            command: 'showMessage',
            message: 'Por favor selecciona al menos un archivo o carpeta'
          });
          return;
        }
      }
      
      vscode.postMessage({
        command: 'extract',
        selectedFiles: selectedFiles
      });
    }
    
    // Función para cambiar modo
    function switchMode(mode) {
      currentMode = mode;
      vscode.postMessage({
        command: 'switchMode',
        mode: mode
      });
    }
    
    // Función para cargar workspace
    function loadWorkspace() {
      vscode.postMessage({
        command: 'loadWorkspace'
      });
    }
    
    // Función para toggle directorio
    function toggleDirectory(directoryPath) {
      vscode.postMessage({
        command: 'navigateToDirectory',
        directoryPath: directoryPath
      });
    }
    
    // Función para seleccionar nodo
    function selectNode(nodePath, isSelected) {
      vscode.postMessage({
        command: 'selectDirectory',
        directoryPath: nodePath,
        isSelected: isSelected
      });
    }
    
    // Función para alternar todos los checkboxes
    function toggleAll() {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      const allChecked = Array.from(checkboxes).every(cb => cb.checked);
      
      checkboxes.forEach(cb => {
        const wasChecked = cb.checked;
        cb.checked = !allChecked;
        
        // Si cambió el estado, notificar al backend
        if (wasChecked !== cb.checked && currentMode === 'folders') {
          selectNode(cb.value, cb.checked);
        }
      });
      
      updateStats();
    }
    
    // Función para actualizar la lista de archivos
    function refreshFiles() {
      vscode.postMessage({
        command: 'refresh'
      });
    }
    
    // Función para actualizar las estadísticas
    function updateStats() {
      const checkedCount = document.querySelectorAll('input[type="checkbox"]:checked').length;
      const selectedCountElement = document.getElementById('selectedCount');
      if (selectedCountElement) {
        selectedCountElement.textContent = checkedCount;
      }
    }
    
    // Inicializar eventos
    document.addEventListener('DOMContentLoaded', function() {
      // Actualizar stats cuando cambian los checkboxes en modo archivos abiertos
      if (currentMode === 'openFiles') {
        document.addEventListener('change', function(e) {
          if (e.target.type === 'checkbox') {
            updateStats();
          }
        });
        
        // Establecer stats iniciales
        updateStats();
      }
    });
  `;
} 