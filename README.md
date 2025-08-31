# Plugin de Snippets Rápidos

Plugin para VSCode que permite insertar rápidamente plantillas de código predefinidas.

## Plan de Desarrollo

### ✅ Paso 1: Configuración inicial del proyecto
- [x] Inicializar estructura del proyecto VSCode Extension
- [x] Configurar package.json y archivos básicos
- [x] Primer commit: "Initial project setup"

### ⏳ Paso 2: Estructura básica del plugin
- [ ] Crear comando básico de activación
- [ ] Configurar contribuciones en package.json
- [ ] Segundo commit: "Basic extension structure"

### ⏳ Paso 3: Funcionalidad básica de inserción
- [ ] Implementar inserción de texto simple
- [ ] Crear primer snippet de ejemplo
- [ ] Tercer commit: "Basic snippet insertion functionality"

### ⏳ Paso 4: Sistema de plantillas
- [ ] Crear sistema de plantillas configurables
- [ ] Implementar carga de plantillas desde archivos
- [ ] Cuarto commit: "Template system implementation"

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
   - En la nueva ventana, presiona `Ctrl+Shift+P` (o `Cmd+Shift+P` en Mac)
   - Busca "Insertar Snippet Rápido" y ejecútalo
   - O usa el atajo de teclado: `Ctrl+Shift+S` (o `Cmd+Shift+S` en Mac)

### Estado Actual
- ✅ La extensión se carga correctamente
- ✅ El comando principal está registrado
- ✅ Atajo de teclado configurado
- 🔄 Solo muestra un mensaje de prueba por ahora 