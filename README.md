# VS Code File Extractor

🚀 Una extensión profesional para **VS Code** y **Cursor** que permite extraer el contenido de archivos de forma inteligente con **doble funcionalidad**: archivos abiertos y exploración de carpetas.

## ✨ Características Principales

### 🎯 **Modo Dual de Extracción**
- **📄 Archivos Abiertos**: Extrae archivos que tienes abiertos en el editor
- **📁 Exploración de Carpetas**: Selecciona y extrae archivos de carpetas específicas

### 🔧 **Funcionalidades Avanzadas**
- **Interfaz Visual Intuitiva**: WebView panel con navegación fácil
- **Selección Granular**: Elige exactamente qué archivos extraer
- **Filtros Inteligentes**: Ignora automáticamente archivos innecesarios
- **Navegación de Carpetas**: Explora y expande carpetas interactivamente
- **Índice Automático**: Genera lista de archivos extraídos
- **Portapapeles**: Copia automáticamente el contenido
- **Rutas Relativas**: Muestra rutas limpias desde el workspace

### 🛠️ **Mejoras Técnicas**
- **Arquitectura Modular**: Código organizado en componentes especializados
- **Rendimiento Optimizado**: Carga bajo demanda y filtrado eficiente
- **Manejo de Errores**: Manejo robusto con mensajes informativos
- **Progreso Visual**: Barras de progreso para operaciones largas

## 📦 Instalación

1. Descarga el archivo `.vsix` más reciente
2. Abre VS Code o Cursor
3. Ve a **Extensions** → **Install from VSIX**
4. Selecciona el archivo descargado

## 🚀 Uso

### Método 1: Comando Rápido
```
Ctrl+Shift+P → "Extract Open Files"
```

### Método 2: Interfaz Visual
```
Ctrl+Shift+P → "Open File Extractor Panel"
```

#### En el Panel Visual:
1. **Cambiar Modo**: Usa los botones de toggle arriba
2. **Modo Archivos Abiertos**: 
   - Ve automáticamente los archivos abiertos
   - Selecciona/deselecciona con checkboxes
3. **Modo Exploración de Carpetas**:
   - Usa "📁 Explorar Carpeta" para agregar carpetas
   - Expande/contrae carpetas con clic
   - Selecciona archivos específicos
4. **Extraer**: Haz clic en "🚀 Extraer Seleccionados"

## 📋 Opciones y Configuración

### Archivos Ignorados Automáticamente
- **Extensiones**: `.log`, `.tmp`, `.cache`, `.lock`, `.vsix`
- **Carpetas**: `node_modules`, `.git`, `.vscode`, `dist`, `build`, `out`
- **Archivos**: Archivos que comienzan con `.` (ocultos)

### Formato de Salida
```
Índice de archivos seleccionados (Archivos Abiertos/Carpetas):

1. src/components/Button.tsx
2. src/utils/helpers.ts
3. src/styles/global.css


--------------------
src/components/Button.tsx
--------------------

[contenido del archivo]


--------------------
src/utils/helpers.ts
--------------------

[contenido del archivo]
```

## 🎨 Interfaz Visual

### Panel de Archivos Abiertos
- Lista clara de archivos abiertos en el editor
- Checkboxes para selección individual
- Información de tamaño y ruta relativa

### Panel de Exploración de Carpetas
- Navegación interactiva de carpetas
- Expansión/contracción de directorios
- Selección granular de archivos y carpetas completas

## 🧰 Casos de Uso

### Para Desarrolladores
- **Code Review**: Extraer archivos específicos para revisión
- **Documentación**: Generar documentación de múltiples archivos
- **Debugging**: Analizar conjunto de archivos relacionados
- **Refactoring**: Trabajar con archivos específicos
- **AI Assistance**: Preparar contexto para herramientas de IA

### Para Equipos
- **Colaboración**: Compartir código de forma estructurada
- **Onboarding**: Crear guías de archivos clave
- **Auditoría**: Revisar archivos de proyectos específicos
- **Backup**: Respaldar archivos importantes

## 🔧 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `vscode-file-extractor.extractOpenFiles` | Extrae archivos abiertos (comando rápido) |
| `vscode-file-extractor.openVisualPanel` | Abre panel visual con ambos modos |

## 📊 Estadísticas

- **Tamaño del Paquete**: ~22KB
- **Archivos Incluidos**: 16 archivos
- **Compatibilidad**: VS Code 1.60.0+
- **Rendimiento**: Optimizado para workspaces grandes

## 🚀 Próximas Características

- [ ] Filtros personalizados por extensión
- [ ] Exportación en múltiples formatos (JSON, XML, PDF)
- [ ] Integración con Git (archivos modificados)
- [ ] Plantillas de extracción personalizables
- [ ] Soporte para archivos binarios
- [ ] Historial de extracciones

## 🐛 Reportar Problemas

Si encuentras algún problema o tienes sugerencias:
1. Revisa el **Developer Console** (F12)
2. Verifica los logs de VS Code
3. Crea un issue con información detallada

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**¡Hecha con ❤️ para desarrolladores que valoran la eficiencia!** 