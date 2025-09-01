# Plugin de Snippets Rápidos

Plugin para VSCode que permite insertar rápidamente plantillas de código predefinidas.

## Plan de Desarrollo

### ✅ Paso 1: Configuración inicial del proyecto
- [x] Inicializar estructura del proyecto VSCode Extension
- [x] Configurar package.json y archivos básicos
- [x] Primer commit: "Initial project setup"

### ✅ Paso 2: Estructura básica del plugin
- [x] Crear comando básico de activación
- [x] Configurar contribuciones en package.json
- [x] Segundo commit: "Basic extension structure"

### ✅ Paso 3: Funcionalidad básica de inserción
- [x] Implementar inserción de texto simple
- [x] Crear primer snippet de ejemplo
- [x] Tercer commit: "Basic snippet insertion functionality"

### ✅ Paso 4: Sistema de plantillas
- [x] Crear sistema de plantillas configurables
- [x] Implementar carga de plantillas desde archivos
- [x] Cuarto commit: "Template system implementation"

### ⏳ Paso 5: Interfaz de usuario
- [ ] Agregar menú de selección de plantillas
- [ ] Implementar quick pick interface
- [ ] Quinto commit: "User interface for template selection"

### ⏳ Paso 6: Documentación y empaquetado
- [ ] Crear README y documentación
- [ ] Configurar para publicación
- [ ] Sexto commit: "Documentation and packaging"

## Descripción

Este plugin permitirá a los desarrolladores insertar rápidamente snippets de código común mediante comandos o atajos de teclado.

## Características Planificadas

- Inserción rápida de plantillas
- Sistema de plantillas configurables
- Interfaz de usuario intuitiva
- Soporte para múltiples lenguajes de programación

## Instalación y Prueba (Desarrollo)

### Requisitos previos
- Node.js (versión 16 o superior)
- VSCode

### Pasos para probar la extensión

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Compilar el proyecto:**
   ```bash
   npm run compile
   ```

3. **Abrir en VSCode y probar:**
   - Abre este proyecto en VSCode
   - Presiona `F5` para abrir una nueva ventana de VSCode con la extensión cargada
   - En la nueva ventana, crea un archivo de prueba (ej: `test.js`)
   - **Probar funciones básicas:**
     - `Ctrl+Shift+S`: Insertar snippet (menú de selección)
     - `Ctrl+Shift+L`: Insertar console.log rápido
     - `Ctrl+Shift+F`: Buscar snippets
     - `Ctrl+Shift+C`: Insertar por categoría
   - **Probar funciones avanzadas:**
     - `Ctrl+Shift+N`: Crear snippet personalizado
     - `Ctrl+Shift+Alt+S`: Ver lista completa de snippets
     - `Ctrl+Shift+Alt+T`: Ver estadísticas
   - **Command Palette:** `Ctrl+Shift+P` y busca "Quick Snippet" para ver todos los comandos

### Estado Actual
- ✅ La extensión se carga correctamente
- ✅ Múltiples comandos registrados  
- ✅ Atajos de teclado configurados
- ✅ Inserción real de snippets funcional
- ✅ Quick Pick para selección de snippets
- ✅ Vista web interactiva para lista de snippets
- ✅ Menú contextual en editor
- ✅ Configuración personalizable
- ✅ **Sistema completo de plantillas personalizadas**
- ✅ **Gestión de archivos JSON para snippets**
- ✅ **Importación/Exportación de snippets**
- ✅ **Dashboard de estadísticas**
- ✅ **Persistencia de datos**

### Comandos Disponibles

#### 🚀 Comandos Principales
| Comando | Atajo | Descripción |
|---------|-------|-------------|
| `Insertar Snippet Rápido` | `Ctrl+Shift+S` | Abre menú para seleccionar un snippet (incluye snippets personalizados) |
| `Insertar console.log` | `Ctrl+Shift+L` | Inserta directamente un console.log |
| `Ver Lista de Snippets` | `Ctrl+Shift+Alt+S` | Vista web interactiva con todos los snippets (predefinidos + personalizados) |
| `Buscar Snippets` | `Ctrl+Shift+F` | Busca en todos los snippets por nombre, descripción o categoría |
| `Insertar por Categoría` | `Ctrl+Shift+C` | Navega por categorías para encontrar snippets |

#### 🛠️ Gestión de Snippets Personalizados
| Comando | Atajo | Descripción |
|---------|-------|-------------|
| `Crear Snippet Personalizado` | `Ctrl+Shift+N` | Crea un nuevo snippet personalizado con asistente interactivo |
| `Editar Snippet Personalizado` | - | Edita un snippet personalizado existente |
| `Eliminar Snippet Personalizado` | - | Elimina un snippet personalizado (con confirmación) |
| `Importar Snippets desde Archivo` | - | Importa snippets desde un archivo JSON |
| `Exportar Snippets a Archivo` | - | Exporta tus snippets personalizados a un archivo JSON |
| `Abrir Archivo de Snippets` | - | Abre el archivo JSON de snippets para edición manual |
| `Recargar Snippets Personalizados` | - | Recarga los snippets desde el archivo (útil tras edición manual) |
| `Ver Estadísticas de Snippets` | `Ctrl+Shift+Alt+T` | Dashboard con estadísticas detalladas de tus snippets |

#### ⚙️ Configuración
| Comando | Atajo | Descripción |
|---------|-------|-------------|
| `Abrir Configuración` | - | Abre la configuración de la extensión |

### Snippets Incluidos

#### JavaScript/TypeScript (10 snippets)
**Debug**
- `console.log` [cl] - Log básico de consola
- `console.error` [ce] - Log de error en consola

**Functions**
- `function` [fn] - Función básica de JavaScript
- `arrow-function` [af] - Función flecha de ES6
- `async-function` [afn] - Función asíncrona con manejo de errores

**Classes**
- `class` [cls] - Clase básica de JavaScript

**Error Handling**
- `try-catch` [tc] - Bloque try-catch

**Loops**
- `for-loop` [for] - Bucle for tradicional
- `for-of` [fof] - Bucle for...of

**Conditionals**
- `if-else` [if] - Estructura condicional if-else

#### HTML (3 snippets)
**Boilerplate**
- `html5-boilerplate` [html5] - Plantilla HTML5 básica

**Elements**
- `div-class` [div] - Div con clase CSS

**Forms**
- `form-basic` [form] - Formulario básico

#### CSS (3 snippets)
**Layout**
- `flexbox-center` [flex-center] - Centrar con Flexbox
- `grid-template` [grid] - Plantilla básica de CSS Grid

**Responsive**
- `media-query` [mq] - Media query responsive

#### Python (4 snippets)
**Debug**
- `print-debug` [pd] - Print de debug

**Functions**
- `def-function` [def] - Función de Python

**Classes**
- `class-python` [class] - Clase de Python

**Error Handling**
- `try-except` [try] - Bloque try-except

**Total: 20 snippets predefinidos en 4 lenguajes, organizados en 9 categorías**

## 🛠️ Sistema de Plantillas Personalizadas

### Características del Sistema de Plantillas

#### ✨ **Gestión Completa de Snippets Personalizados**
- **Crear:** Asistente interactivo para crear nuevos snippets
- **Editar:** Modificar snippets existentes con facilidad  
- **Eliminar:** Eliminar snippets con confirmación de seguridad
- **Organizar:** Categorías y lenguajes personalizables

#### 💾 **Persistencia de Datos**
- **Almacenamiento local:** Los snippets se guardan en `user-templates.json`
- **Sincronización:** Se mantienen entre sesiones de VSCode
- **Ubicación:** Directorio global de VSCode para disponibilidad universal

#### 📁 **Importación/Exportación**
- **Formato JSON:** Archivo estándar para intercambio de snippets
- **Compartir:** Exporta tus snippets para compartir con el equipo
- **Respaldar:** Crea copias de seguridad de tus snippets personalizados
- **Importar:** Carga snippets desde archivos externos

#### 📊 **Dashboard de Estadísticas**
- **Resumen visual:** Cantidad total de snippets (predefinidos + personalizados)
- **Distribución por lenguaje:** Estadísticas detalladas por cada lenguaje
- **Distribución por categoría:** Organización clara de tus snippets
- **Actividad reciente:** Snippets modificados recientemente

### Formato del Archivo de Plantillas

```json
{
  "version": "1.0.0",
  "templates": [
    {
      "id": "template_unique_id",
      "name": "mi-snippet-personalizado",
      "description": "Descripción del snippet",
      "content": "console.log('${1:mensaje}');$0",
      "language": "javascript",
      "category": "Custom", 
      "prefix": "msc",
      "author": "Usuario",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "metadata": {
    "name": "Plantillas Personalizadas",
    "description": "Snippets personalizados del usuario",
    "author": "Usuario",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Flujo de Trabajo con Plantillas

1. **Crear Snippet:** `Ctrl+Shift+N` → Completa el asistente → Snippet disponible inmediatamente
2. **Usar Snippet:** `Ctrl+Shift+S` → Selecciona snippet → Se inserta en el editor  
3. **Gestionar:** Editar, eliminar o exportar desde Command Palette
4. **Compartir:** Exportar archivo JSON → Compartir → Importar en otro entorno
5. **Monitorear:** `Ctrl+Shift+Alt+T` para ver estadísticas y actividad 