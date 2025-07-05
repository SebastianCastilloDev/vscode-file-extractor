# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [0.1.0] - 2024-07-04

### 🚀 Nuevas Características

#### **Modo Dual de Extracción**
- **📄 Archivos Abiertos**: Funcionalidad original mejorada
- **📁 Exploración de Carpetas**: Nueva funcionalidad para seleccionar carpetas específicas
- **🎯 Toggle de Modos**: Cambio fácil entre ambos modos en la interfaz

#### **Exploración de Carpetas**
- **📁 Navegador de Carpetas**: Selecciona carpetas mediante diálogo nativo
- **🔄 Expansión/Contracción**: Explora el contenido de carpetas interactivamente
- **📋 Selección Granular**: Elige archivos específicos dentro de carpetas
- **📊 Contador de Items**: Muestra cantidad de archivos en cada carpeta

#### **Interfaz Visual Mejorada**
- **🎨 Diseño Moderno**: Interface completamente rediseñada
- **📱 Responsivo**: Adaptable a diferentes tamaños de panel
- **🎯 Estados Vacíos**: Mensajes informativos cuando no hay contenido
- **⚡ Navegación Intuitiva**: Botones y controles más accesibles

#### **Rendimiento y Filtrado**
- **🚀 Carga Bajo Demanda**: Los archivos se cargan solo cuando es necesario
- **🔍 Filtros Inteligentes**: Ignora automáticamente archivos innecesarios
- **📁 Filtro de Directorios**: Excluye `node_modules`, `.git`, etc.
- **🎯 Profundidad Limitada**: Evita recorridos excesivos en carpetas profundas

### 🛠️ Mejoras Técnicas

#### **Arquitectura Modular**
- **📦 Componentes Separados**: Código organizado en módulos especializados
- **🎯 Patrones de Diseño**: Command, Factory, Singleton, Strategy, Visitor
- **🔧 Single Source of Truth**: Configuración centralizada
- **📋 Tipos Completos**: Interfaces TypeScript robustas

#### **Manejo de Errores**
- **🛡️ Manejo Robusto**: Try-catch en todas las operaciones críticas
- **📊 Logging Detallado**: Información para debugging
- **💬 Mensajes Informativos**: Feedback claro para el usuario
- **⚡ Recuperación Graceful**: Continúa funcionando ante errores parciales

#### **Experiencia de Usuario**
- **📊 Barras de Progreso**: Feedback visual para operaciones largas
- **🎯 Estadísticas en Tiempo Real**: Contador de archivos seleccionados
- **🔄 Actualización Automática**: Refresh inteligente del contenido
- **📱 Interfaz Adaptable**: Se ajusta al tema de VS Code

### 🔧 Nuevos Comandos

- `vscode-file-extractor.extractOpenFiles`: Extracción rápida de archivos abiertos
- `vscode-file-extractor.openVisualPanel`: Panel visual con ambos modos

### 📊 Estadísticas

- **Tamaño del Paquete**: 22KB (optimizado)
- **Archivos Incluidos**: 16 archivos
- **Líneas de Código**: ~1,200 líneas
- **Módulos**: 8 módulos especializados

### 🧰 Herramientas de Desarrollo

#### **Scripts npm**
- `npm run clean`: Limpieza interactiva del proyecto
- `npm run clean:all`: Limpieza completa + reinstalación
- `npm run rebuild`: Limpieza + recompilación
- `npm run check-ignored`: Verificar archivos ignorados

#### **Documentación**
- **📄 README.md**: Documentación completa de usuario
- **🏗️ ARCHITECTURE.md**: Documentación técnica
- **🔧 DEVELOPMENT.md**: Guía de desarrollo
- **📋 CHANGELOG.md**: Historial de cambios

#### **Control de Versiones**
- **📁 .gitignore**: Configuración completa y profesional
- **🧹 Scripts de Limpieza**: Automatización de tareas de mantenimiento
- **🔍 Verificación**: Herramientas para validar estado del repositorio

### 🚀 Próximas Características

#### **Planificadas para v0.2.0**
- [ ] Filtros personalizados por extensión de archivo
- [ ] Exportación en múltiples formatos (JSON, XML, PDF)
- [ ] Integración con Git para archivos modificados
- [ ] Plantillas de extracción personalizables

#### **Planificadas para v0.3.0**
- [ ] Soporte para archivos binarios con preview
- [ ] Historial de extracciones realizadas
- [ ] Configuración por workspace
- [ ] Integración con herramientas de IA

### 🐛 Correcciones

- **🔧 Ruta Hardcodeada**: Eliminada dependencia de rutas específicas del usuario
- **📦 Gestión de Memoria**: Optimizado para workspaces grandes
- **🎯 Compilación TypeScript**: Todas las interfaces completamente tipadas
- **🔍 Detección de Archivos**: Mejorada lógica de filtrado

### ⚠️ Cambios Importantes

- **📁 Estructura de Proyecto**: Migración a arquitectura modular
- **🎯 Interfaces**: Nuevas interfaces para soporte de carpetas
- **📦 Comandos**: Nuevos comandos agregados al package.json
- **🔧 Configuración**: Centralización de constantes y configuraciones

### 🙏 Agradecimientos

- Inspirado en las necesidades reales de desarrolladores
- Optimizado para workflows modernos de desarrollo
- Diseñado con principios de UX/UI profesionales

---

**Formato de versiones**: [Major.Minor.Patch]
**Fecha de lanzamiento**: Julio 4, 2024 

### ✨ Nuevas Características - Árbol de Directorios Navegable

#### 🌳 **Navegación Jerárquica Integrada**
- **Árbol de Directorios**: Nueva interfaz que muestra la estructura completa del workspace
- **Navegación Intuitiva**: Expandir/contraer carpetas directamente en el panel
- **Selección de Carpetas Completas**: Posibilidad de seleccionar carpetas enteras con un clic
- **Carga Bajo Demanda**: Los directorios se cargan solo cuando se expanden (optimización)

#### 🎯 **Funcionalidades de Selección Avanzadas**
- **Selección Jerárquica**: Seleccionar una carpeta selecciona automáticamente todos sus archivos
- **Propagación de Estados**: Estados de selección se propagan hacia arriba y abajo en el árbol
- **Selección Granular**: Combinar selección de carpetas completas con archivos individuales
- **Indicadores Visuales**: Iconos y estilos que muestran el estado de selección claramente

#### 🔧 **Mejoras Técnicas de Arquitectura**
- **Nuevas Interfaces TypeScript**: 
  - `DirectoryTreeNode`: Estructura para nodos del árbol
  - `WebViewMessage`: Comandos extendidos para navegación
  - `WebViewState`: Estado ampliado con árbol de directorios

#### 📊 **Funciones Utilitarias Nuevas**
- `loadWorkspaceDirectoryTree()`: Carga inicial del árbol del workspace
- `buildDirectoryTree()`: Construcción recursiva del árbol con límite de profundidad
- `findNodeByPath()`: Búsqueda eficiente en el árbol
- `updateNodeSelection()`: Actualización inteligente de selecciones
- `getSelectedFilesFromTree()`: Extracción de archivos seleccionados
- `getAllFilesFromDirectory()`: Obtención recursiva de archivos

#### 🎨 **Interfaz Visual Completamente Renovada**
- **Template del Árbol**: Nuevo HTML/CSS para mostrar estructura jerárquica
- **Íconos Contextuales**: 📁 📂 📄 para carpetas y archivos
- **Indentación Visual**: Estructura clara con líneas de conexión
- **Hover States**: Efectos visuales en hover para mejor UX
- **Estilos Responsivos**: Interfaz que se adapta al tema de VS Code

#### 🚀 **Comandos y Controles Nuevos**
- **Comandos WebView**:
  - `loadWorkspace`: Cargar árbol del workspace
  - `navigateToDirectory`: Expandir/contraer directorios
  - `selectDirectory`: Seleccionar carpetas/archivos
- **Botón "Cargar Workspace"**: Recarga manual del árbol
- **Navegación con Clic**: Expansión/contracción con un clic

### 🔄 **Cambios en Funcionalidades Existentes**

#### 📝 **Actualización de Templates**
- **Separación de Modos**: Templates específicos para archivos abiertos vs. árbol
- **Estadísticas Mejoradas**: Conteo de carpetas seleccionadas
- **JavaScript Actualizado**: Manejo de eventos para navegación de árbol

#### 🎛️ **Mejoras en el WebView**
- **Gestión de Estado**: Estado dual para archivos abiertos y árbol
- **Manejo de Mensajes**: Comandos extendidos para navegación
- **Optimización de Rendimiento**: Carga condicional basada en modo

#### 🔧 **Optimizaciones de Rendimiento**
- **Carga Progresiva**: Árbol se carga con profundidad limitada inicialmente
- **Lazy Loading**: Subdirectorios se cargan solo cuando se expanden
- **Filtrado Inteligente**: Exclusión automática de archivos/carpetas innecesarios

### 🛠️ **Cambios en el Código**

#### 📁 **Estructura de Archivos Actualizada**
- `src/types/interfaces.ts`: Nuevas interfaces para árbol de directorios
- `src/utils/fileUtils.ts`: Funciones utilitarias para navegación
- `src/ui/webview.ts`: Lógica de manejo del árbol
- `src/ui/templates.ts`: Templates HTML para árbol navegable

#### 🔍 **Patrones de Diseño Implementados**
- **Composite Pattern**: Para estructura de árbol jerárquico
- **Visitor Pattern**: Para recorrido y búsqueda en árboles
- **Command Pattern**: Para operaciones de selección
- **Lazy Loading Pattern**: Para optimización de rendimiento
- **Factory Method**: Para creación de nodos del árbol

### 📋 **Compatibilidad**
- **Retrocompatibilidad**: Funcionalidad de archivos abiertos mantiene API existente
- **Modo Dual**: Ambos modos (archivos abiertos y árbol) funcionan independientemente
- **Migración Suave**: Transición automática entre modos sin pérdida de datos

### 🎯 **Experiencia de Usuario**
- **Interfaz Unificada**: Modo toggle para cambiar entre funcionalidades
- **Feedback Visual**: Mensajes informativos y barras de progreso
- **Navegación Intuitiva**: Comportamiento similar a exploradores de archivos
- **Selección Flexible**: Múltiples formas de seleccionar archivos/carpetas

### 📈 **Métricas de Rendimiento**
- **Tamaño del Paquete**: 27.29 KB (optimizado)
- **Tiempo de Carga**: Carga inicial del árbol < 1 segundo
- **Memoria**: Consumo optimizado con carga bajo demanda
- **Responsividad**: Interfaz fluida incluso con muchos archivos

---

## [Versión Anterior]

### [0.0.1] - 2024-01-XX

#### 🎯 **Funcionalidades Iniciales**
- Extracción de archivos abiertos en VS Code
- Interfaz visual básica con WebView
- Exportación a archivo de texto
- Copia automática al portapapeles

#### 🏗️ **Arquitectura Base**
- Estructura modular con separación de responsabilidades
- Sistema de comandos básico
- Templates HTML/CSS/JavaScript para WebView
- Manejo de errores y validaciones

#### 🔧 **Configuración Inicial**
- Filtros automáticos para archivos no deseados
- Configuración de extensiones ignoradas
- Sistema de paths relativos
- Integración con workspace de VS Code

---

## 🚀 Próximas Versiones

### [0.2.0] - Planeado
- **Filtros Personalizables**: Permitir configurar filtros por usuario
- **Exportación Multi-formato**: JSON, XML, PDF
- **Integración Git**: Mostrar archivos modificados
- **Plantillas Personalizables**: Templates de extracción configurables

### [0.3.0] - Futuro
- **Soporte Archivos Binarios**: Manejo de imágenes y otros archivos
- **Historial de Extracciones**: Guardar y recuperar extracciones previas
- **Sincronización Cloud**: Backup de configuraciones
- **API Extensible**: Permitir integraciones con otras extensiones 