# Guía del Usuario - Quick Snippet Inserter

## 🚀 Inicio Rápido

### Instalación
1. Extensiones (`Ctrl+Shift+X`) → Buscar "Quick Snippet Inserter" → Instalar

### Primer Uso
1. Abre un archivo de código (.js, .ts, .html, .css, .py)
2. `Ctrl+Shift+M` → Menú Principal
3. "🚀 Insertar Snippet" → ¡Explora los snippets!

## 🎯 Funciones Principales

### Menú Principal (`Ctrl+Shift+M`)
Centro de control con acceso a todas las funciones:
- 🚀 Insertar Snippet
- 🔍 Buscar Snippets  
- 📁 Explorar por Categoría
- ➕ Crear Snippet Personalizado
- 🛠️ Gestionar Snippets
- 📊 Ver Estadísticas

### Insertar Snippets (`Ctrl+Shift+S`)
- **Detección automática** del lenguaje del archivo
- **Organización por categorías** con iconos y descripciones
- **Información rica**: lenguaje, prefijo, categoría

### Snippets Contextuales (`Ctrl+Shift+Q`)
- **Acceso ultra-rápido** a snippets relevantes
- Top 10 snippets para el lenguaje actual
- Perfecto para uso diario

### Búsqueda Avanzada (`Ctrl+Shift+F`)
- Búsqueda en nombres, descripciones, categorías, prefijos
- Validación automática y progress bar
- Resultados organizados por categorías

## 🛠️ Snippets Personalizados

### Crear (`Ctrl+Shift+N`)
Asistente de 6 pasos:
1. **Nombre**: único, solo letras/números/guiones
2. **Descripción**: propósito del snippet
3. **Categoría**: organización
4. **Lenguaje**: opcional, para filtrado automático
5. **Prefijo**: abreviación opcional (max 10 chars)
6. **Contenido**: código con placeholders `${1:nombre}`, `$0`

### Gestionar
Desde Menú Principal → "🛠️ Gestionar Snippets":
- **Editar**: Modificar snippets existentes
- **Eliminar**: Con confirmación de seguridad
- **Abrir Archivo**: Edición manual JSON
- **Recargar**: Sincronizar tras edición manual

### Importar/Exportar
- **Exportar**: Crear archivo JSON de respaldo/compartir
- **Importar**: Cargar snippets desde archivo JSON
- Detección automática de duplicados

## 📊 Herramientas Avanzadas

### Dashboard de Estadísticas (`Ctrl+Shift+Alt+T`)
- Resumen general (predefinidos + personalizados)
- Distribución por lenguaje y categoría
- Actividad reciente de snippets

### Lista Completa (`Ctrl+Shift+Alt+S`)
Vista web interactiva:
- Filtros por lenguaje con botones
- Organización por categorías  
- Búsqueda en tiempo real
- Responsive y con tema VSCode

### Exploración por Lenguaje (`Ctrl+Shift+Alt+L`)
- Selector visual con estadísticas
- Filtrado por lenguaje específico
- Opción "todos los lenguajes"

## ⌨️ Atajos de Teclado

| Atajo | Función |
|-------|---------|
| `Ctrl+Shift+M` | Menú Principal |
| `Ctrl+Shift+S` | Insertar Snippet |
| `Ctrl+Shift+Q` | Snippets Contextuales |
| `Ctrl+Shift+L` | Console.log directo |
| `Ctrl+Shift+F` | Buscar Snippets |
| `Ctrl+Shift+C` | Por Categoría |
| `Ctrl+Shift+N` | Crear Snippet |
| `Ctrl+Shift+Alt+L` | Por Lenguaje |
| `Ctrl+Shift+Alt+S` | Lista Completa |
| `Ctrl+Shift+Alt+T` | Estadísticas |

## 📝 Snippets Incluidos

### JavaScript/TypeScript (10)
- **Debug**: console.log, console.error
- **Functions**: function, arrow-function, async-function
- **Classes**: class
- **Loops**: for-loop, for-of
- **Conditionals**: if-else
- **Error Handling**: try-catch

### HTML (3)
- **Boilerplate**: html5-boilerplate
- **Elements**: div-class
- **Forms**: form-basic

### CSS (3)
- **Layout**: flexbox-center, grid-template
- **Responsive**: media-query

### Python (4)
- **Debug**: print-debug
- **Functions**: def-function
- **Classes**: class-python
- **Error Handling**: try-except

## 🔧 Placeholders Avanzados

### Sintaxis
- `${1:nombre}` - Campo navegable con placeholder
- `${2:tipo}` - Segundo campo navegable
- `$0` - Posición final del cursor

### Ejemplo
```javascript
function ${1:nombreFuncion}(${2:parametros}) {
    ${3:// código aquí}
    return ${4:valor};
}$0
```

### Uso
1. Se inserta el snippet
2. `Tab` navega entre campos
3. Escribe para reemplazar el placeholder
4. `Tab` final lleva al `$0`

## 🎯 Casos de Uso

### Principiantes
1. `Ctrl+Shift+Alt+S` → Explorar snippets incluidos
2. `Ctrl+Shift+S` → Insertar primer snippet
3. Practicar con placeholders navegables

### Uso Diario
1. `Ctrl+Shift+Q` → Acceso rápido contextual
2. `Ctrl+Shift+F` → Búsqueda eficiente
3. `Ctrl+Shift+L` → Console.log instantáneo

### Equipos
1. Crear snippets de convenciones del equipo
2. Exportar/compartir archivo JSON
3. Importar snippets comunes del equipo

### Desarrolladores Avanzados
1. Snippets complejos con múltiples placeholders
2. Edición manual del archivo JSON
3. Automatización con scripts externos

## 🛡️ Troubleshooting

### Problemas Comunes
- **"No hay snippets"**: Usar filtros menos restrictivos
- **"Error al guardar"**: Verificar nombre único y caracteres válidos
- **"Snippets no aparecen"**: Recargar desde menú principal
- **"Extensión no activa"**: Actualizar VSCode ≥1.74.0

### Soporte
- [GitHub Issues](https://github.com/quick-snippet-team/quick-snippet-inserter/issues)
- Incluir: VSCode version, OS, pasos para reproducir

---

¡Disfruta Quick Snippet Inserter! 🚀 