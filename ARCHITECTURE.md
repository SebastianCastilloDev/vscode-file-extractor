# Arquitectura Modular - VS Code File Extractor

## 📁 Estructura del Proyecto

```
src/
├── extension.ts           # Punto de entrada principal
├── commands/             # Comandos de la extensión
│   ├── extractCommand.ts # Comando original de extracción
│   └── visualCommand.ts  # Comando del panel visual
├── ui/                   # Interfaz de usuario
│   ├── webview.ts       # Lógica del WebView
│   └── templates.ts     # Templates HTML
├── utils/               # Utilidades
│   ├── fileUtils.ts     # Utilidades de archivos
│   └── pathUtils.ts     # Utilidades de rutas
├── config/              # Configuración
│   └── constants.ts     # Constantes y configuraciones
└── types/               # Tipos y interfaces
    └── interfaces.ts    # Definiciones de tipos
```

## 🎯 Patrones de Diseño Implementados

### **1. Command Pattern**
- `ExtractOpenFilesCommand`: Encapsula la lógica de extracción
- `OpenVisualPanelCommand`: Encapsula la lógica del panel visual

### **2. Facade Pattern**
- `FileExtractorWebView`: Simplifica la interacción con el WebView
- `extension.ts`: Simplifica la inicialización

### **3. Factory Method**
- `getOpenFiles()`: Crea objetos OpenFileInfo
- Funciones de registro de comandos

### **4. Single Source of Truth**
- `constants.ts`: Centraliza todas las configuraciones
- `interfaces.ts`: Centraliza todas las definiciones de tipos

### **5. Template Method**
- `generateWebViewContent()`: Genera HTML consistente
- `extractWithClassicFormat()`: Mantiene compatibilidad

### **6. Singleton Pattern**
- `createOrShowWebView()`: Evita múltiples instancias del WebView

### **7. Adapter Pattern**
- `getDocumentsToExtract()`: Convierte URIs a DocumentToExtract

### **8. Strategy Pattern**
- `handleWebviewMessage()`: Diferentes estrategias según el comando

## 🚀 Comandos Disponibles

### **Desarrollo:**
```bash
npm run compile        # Compila TypeScript
npm run watch         # Compilación automática
npm run lint          # Ejecuta ESLint
```

### **Empaquetado:**
```bash
npm run package-new           # Genera .vsix
npm run build-and-package     # Compila y empaqueta
```

## 🧩 Módulos Principales

### **config/constants.ts**
- Configuraciones centralizadas
- Extensiones ignoradas
- Patrones de rutas
- Comandos de la extensión

### **types/interfaces.ts**
- OpenFileInfo: Información de archivos abiertos
- DocumentToExtract: Documentos a extraer
- WebViewMessage: Mensajes del WebView
- ExtractionOptions: Opciones de extracción
- ExtractionResult: Resultado de extracción

### **utils/fileUtils.ts**
- `getOutputDirectory()`: Directorio de salida inteligente
- `getOpenFiles()`: Obtiene archivos abiertos válidos
- `extractFiles()`: Extrae archivos con opciones
- `getDocumentsToExtract()`: Convierte URIs a documentos

### **utils/pathUtils.ts**
- `getRelativePathFromWorkspace()`: Rutas relativas
- `formatFileSize()`: Formato de tamaños
- `createUniqueFileName()`: Nombres únicos

### **ui/templates.ts**
- `generateWebViewContent()`: HTML completo del WebView
- Estilos CSS nativos de VS Code
- JavaScript interactivo

### **ui/webview.ts**
- `FileExtractorWebView`: Clase principal del WebView
- Manejo de mensajes y eventos
- Singleton pattern para instancia única

### **commands/extractCommand.ts**
- `ExtractOpenFilesCommand`: Comando original mejorado
- Barra de progreso
- Formato clásico mantenido

### **commands/visualCommand.ts**
- `OpenVisualPanelCommand`: Comando del panel visual
- Integración con WebView

## 🔧 Beneficios de la Modularización

### **Mantenibilidad**
- Código organizado por responsabilidades
- Fácil localización de funcionalidades
- Separación clara de concerns

### **Escalabilidad**
- Fácil agregar nuevos comandos
- Nuevos formatos de salida
- Extensión de funcionalidades

### **Reutilización**
- Utilidades compartidas
- Patrones consistentes
- Interfaces claras

### **Testing**
- Módulos testeable independientemente
- Mocking simplificado
- Cobertura granular

### **Colaboración**
- Múltiples desarrolladores
- Código autodocumentado
- Estándares consistentes

## 📈 Próximas Mejoras

1. **Configuración avanzada**
2. **Múltiples formatos de salida**
3. **Filtros inteligentes**
4. **Integración con Git**
5. **Templates personalizables** 