# Guía de Contribución

¡Gracias por tu interés en contribuir a Quick Snippet Inserter! Esta guía te ayudará a empezar.

## 🚀 Empezando

### Requisitos Previos
- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)

### Configuración del Entorno

1. **Fork del repositorio**
   ```bash
   # Clona tu fork
   git clone https://github.com/TU-USUARIO/quick-snippet-inserter.git
   cd quick-snippet-inserter
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Compilar el proyecto**
   ```bash
   npm run compile
   ```

4. **Probar la extensión**
   - Abre el proyecto en VSCode
   - Presiona `F5` para abrir una ventana de desarrollo
   - Prueba las funcionalidades

## 📝 Cómo Contribuir

### Reportar Bugs

Antes de reportar un bug, por favor:
1. Verifica que no esté ya reportado en [Issues](https://github.com/tu-usuario/quick-snippet-inserter/issues)
2. Usa la plantilla de bug report
3. Incluye:
   - Versión de VSCode
   - Sistema operativo
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplican

### Sugerir Características

Para nuevas características:
1. Abre un Issue con la etiqueta "enhancement"
2. Describe claramente:
   - El problema que resuelve
   - La solución propuesta
   - Alternativas consideradas
   - Contexto adicional

### Pull Requests

1. **Crea una rama para tu cambio**
   ```bash
   git checkout -b feature/nueva-caracteristica
   # o
   git checkout -b fix/correcion-bug
   ```

2. **Convenciones de código**
   - Usa TypeScript con tipado estricto
   - Sigue las convenciones existentes
   - Agrega comentarios para lógica compleja
   - Usa nombres descriptivos para variables y funciones

3. **Commits**
   - Usa mensajes descriptivos en español
   - Un commit por cambio lógico
   - Formato: `tipo: descripción breve`
   
   Ejemplos:
   ```
   feat: agregar soporte para snippets de React
   fix: corregir error en búsqueda de snippets
   docs: actualizar README con nuevos comandos
   refactor: mejorar organización del código UI
   test: agregar pruebas para TemplateManager
   ```

4. **Antes de enviar**
   ```bash
   # Compila y verifica errores
   npm run compile
   
   # Prueba la extensión manualmente
   # Presiona F5 en VSCode
   ```

5. **Envía el PR**
   - Título descriptivo
   - Describe los cambios realizados
   - Referencia issues relacionados
   - Agrega screenshots si hay cambios visuales

## 🏗️ Arquitectura del Proyecto

### Estructura de Archivos
```
src/
├── extension.ts        # Punto de entrada, comandos principales
├── snippets.ts         # Snippets predefinidos y utilidades
├── templateManager.ts  # Gestión de plantillas personalizadas
└── userInterface.ts    # Interfaces de usuario avanzadas

docs/                   # Documentación adicional
tests/                  # Pruebas (pendiente)
```

### Módulos Principales

#### `extension.ts`
- Activación y desactivación de la extensión
- Registro de comandos
- Coordinación entre módulos

#### `snippets.ts`
- Definición de snippets predefinidos
- Interfaces y tipos principales
- Funciones de búsqueda y filtrado

#### `templateManager.ts`
- Gestión de snippets personalizados
- Persistencia de datos en JSON
- Importación/exportación

#### `userInterface.ts`
- Interfaces de usuario avanzadas
- Quick Pick mejorado
- Menús y asistentes

### Patrones de Diseño

- **Separación de responsabilidades**: Cada módulo tiene un propósito específico
- **Interfaces TypeScript**: Tipado estricto para robustez
- **Singleton implícito**: TemplateManager mantiene estado
- **Factory methods**: UserInterface.show* para crear interfaces

## 🧪 Pruebas

### Pruebas Manuales
1. Crear archivo de prueba (.js, .ts, .html, etc.)
2. Probar cada comando principal:
   - `Ctrl+Shift+M` - Menú principal
   - `Ctrl+Shift+S` - Insertar snippet
   - `Ctrl+Shift+N` - Crear snippet
   - `Ctrl+Shift+Q` - Snippets contextuales

### Casos de Prueba Importantes
- [ ] Crear snippet personalizado completo
- [ ] Importar/exportar snippets
- [ ] Búsqueda con diferentes términos
- [ ] Inserción en diferentes tipos de archivos
- [ ] Manejo de errores (archivo corrupto, etc.)

## 📋 Lista de Verificación para PRs

- [ ] El código compila sin errores (`npm run compile`)
- [ ] Funcionalidad probada manualmente
- [ ] Documentación actualizada si aplica
- [ ] Commit messages siguen las convenciones
- [ ] No hay código comentado o de debug
- [ ] Variables y funciones tienen nombres descriptivos

## 💡 Ideas para Contribuir

### Características Fáciles (Principiantes)
- Agregar nuevos snippets predefinidos
- Mejorar mensajes de error
- Traducir documentación
- Mejorar estilos CSS en vistas web

### Características Intermedias
- Implementar validación JSON schema
- Agregar más lenguajes de programación
- Mejorar búsqueda con filtros avanzados
- Implementar temas personalizables

### Características Avanzadas
- Sincronización en la nube
- Integración con GitHub Gists
- Snippets con lógica condicional
- API para extensiones de terceros

## 🔧 Scripts de Desarrollo

```bash
# Compilar el proyecto
npm run compile

# Compilar en modo watch
npm run watch

# Empaquetar para distribución
npm run package

# Ejecutar linter (cuando esté configurado)
npm run lint
```

## 📚 Recursos Útiles

- [VSCode Extension API](https://code.visualstudio.com/api)
- [VSCode Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 🎯 Roadmap

### Versión 0.2.0
- [ ] Sincronización básica de snippets
- [ ] Snippets colaborativos de equipo
- [ ] Métricas de uso

### Versión 0.3.0
- [ ] Autocompletado inteligente
- [ ] Snippets con variables dinámicas
- [ ] Integración con GitHub

### Versión 1.0.0
- [ ] API estable para terceros
- [ ] Documentación completa
- [ ] Cobertura de pruebas >90%

## 💬 Comunicación

- **Issues**: Para bugs y sugerencias
- **Discussions**: Para preguntas generales
- **Pull Requests**: Para contribuciones de código

## ⚖️ Código de Conducta

Este proyecto se adhiere a un código de conducta inclusivo. Se espera que todos los contribuyentes:

- Usen lenguaje inclusivo y respetuoso
- Respeten diferentes puntos de vista
- Acepten críticas constructivas
- Se enfoquen en lo mejor para la comunidad

---

¡Gracias por contribuir a Quick Snippet Inserter! Juntos podemos hacer una herramienta increíble para la comunidad de desarrolladores. 🚀 