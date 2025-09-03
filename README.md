# Taller: Desarrollo de Extension VSCode - Plugin de Snippets Rapidos

¡Bienvenido al taller practico de desarrollo de extensiones para Visual Studio Code! En este taller aprenderas a crear una extension completa desde cero que permite insertar snippets de codigo de manera rapida y eficiente.

## Objetivos del Taller

Al finalizar este taller, habras aprendido a:

- Configurar un proyecto de extension VSCode desde cero
- Implementar comandos y atajos de teclado personalizados  
- Crear interfaces de usuario interactivas con Quick Pick
- Gestionar datos persistentes en extensiones
- Desarrollar un sistema completo de plantillas personalizables
- Empaquetar y preparar una extension para distribucion

## Requisitos Previos

### Software Necesario
- **Node.js** (version 16 o superior)
- **Visual Studio Code** (version reciente)
- **Git** (para control de versiones)

### Conocimientos Recomendados
- JavaScript/TypeScript basico
- Familiaridad con VSCode como editor
- Conceptos basicos de desarrollo web

## Estructura del Taller

```
microkernel-ejemplo/
├── README.md                    # ← Estas aqui (Guia del taller)
├── taller/                      # ← Archivos para completar durante el taller
│   ├── src/                     # Codigo fuente a desarrollar
│   ├── docs/                    # Documentacion a crear
│   ├── package.json             # Configuracion base del proyecto
│   └── instrucciones.md         # Pasos detallados del taller
├── solucion/                    # ← Solucion completa de referencia
│   ├── src/                     # Codigo fuente completo
│   ├── docs/                    # Documentacion completa
│   ├── out/                     # Codigo compilado
│   └── [todos los archivos]     # Proyecto terminado
└── fragmentos/                  # ← Fragmentos de codigo para copiar/pegar
    ├── paso1-setup.md
    ├── paso2-comandos.md
    ├── paso3-snippets.md
    ├── paso4-templates.md
    ├── paso5-ui.md
    └── paso6-packaging.md
```

## Como Usar Este Taller

### Modalidad Autoguiada
1. **Lee las instrucciones**: Comienza con `taller/instrucciones.md`
2. **Sigue los pasos**: Cada paso tiene objetivos claros y codigo de referencia
3. **Usa los fragmentos**: En `fragmentos/` encontraras codigo para copiar
4. **Consulta la solucion**: Si te atascas, revisa `solucion/` como referencia

### Modalidad Con Instructor
1. **Sigue al instructor**: Los pasos se realizaran en conjunto
2. **Participa activamente**: Haz preguntas y experimenta
3. **Usa los recursos**: Los fragmentos y solucion estan disponibles como apoyo

## Pasos del Taller

### Paso 1: Configuracion Inicial (30 min)
**Objetivo**: Preparar el entorno y estructura basica del proyecto

- [ ] Configurar estructura de archivos
- [ ] Crear `package.json` con metadatos de extension
- [ ] Configurar TypeScript y herramientas de desarrollo
- [ ] Realizar primer commit

**Archivos a crear**:
- `taller/package.json`
- `taller/tsconfig.json` 
- `taller/.vscode/launch.json`

### Paso 2: Comandos Basicos (45 min)
**Objetivo**: Implementar la estructura basica de comandos de la extension

- [ ] Crear punto de entrada principal (`extension.ts`)
- [ ] Registrar comandos basicos
- [ ] Configurar atajos de teclado
- [ ] Probar la extension en modo desarrollo

**Archivos a crear**:
- `taller/src/extension.ts`
- Actualizar `taller/package.json` con contribuciones

### Paso 3: Sistema de Snippets (60 min)
**Objetivo**: Implementar la funcionalidad central de insercion de snippets

- [ ] Crear base de datos de snippets predefinidos
- [ ] Implementar insercion basica de texto
- [ ] Organizar snippets por categorias y lenguajes
- [ ] Probar insercion en diferentes tipos de archivos

**Archivos a crear**:
- `taller/src/snippets.ts`
- Actualizar `taller/src/extension.ts`

### Paso 4: Interfaz de Usuario (75 min)
**Objetivo**: Crear interfaces intuitivas para seleccionar y gestionar snippets

- [ ] Implementar Quick Pick mejorado con categorias
- [ ] Crear menu principal centralizado
- [ ] Desarrollar busqueda avanzada con filtros
- [ ] Implementar navegacion por lenguaje y categoria

**Archivos a crear**:
- `taller/src/userInterface.ts`
- Actualizar archivos existentes

### Paso 5: Plantillas Personalizadas (90 min)
**Objetivo**: Desarrollar sistema completo CRUD para plantillas personalizadas

- [ ] Implementar gestion de plantillas personalizadas
- [ ] Crear sistema de persistencia de datos
- [ ] Desarrollar funciones de importacion/exportacion
- [ ] Crear dashboard de estadisticas

**Archivos a crear**:
- `taller/src/templateManager.ts`
- Actualizar archivos existentes

### Paso 6: Documentacion y Empaquetado (45 min)
**Objetivo**: Preparar la extension para distribucion profesional

- [ ] Crear documentacion completa
- [ ] Configurar empaquetado para marketplace
- [ ] Generar archivos de distribucion
- [ ] Probar instalacion local

**Archivos a crear**:
- `taller/CHANGELOG.md`
- `taller/CONTRIBUTING.md`
- `taller/docs/USER_GUIDE.md`
- `taller/LICENSE`

## Duracion Estimada

| Paso | Tiempo | Acumulado |
|------|--------|-----------|
| **Paso 1**: Configuracion | 30 min | 30 min |
| **Paso 2**: Comandos | 45 min | 1h 15min |
| **Paso 3**: Snippets | 60 min | 2h 15min |
| **Paso 4**: UI | 75 min | 3h 30min |
| **Paso 5**: Plantillas | 90 min | 5h |
| **Paso 6**: Empaquetado | 45 min | 5h 45min |
| **Total** | | **~6 horas** |

## Niveles de Dificultad

### Principiante
- Sigue los pasos exactamente como se indican
- Usa los fragmentos de codigo proporcionados
- Consulta la solucion cuando sea necesario

### Intermedio  
- Intenta implementar cada funcion antes de ver los fragmentos
- Experimenta con variaciones del codigo
- Agrega funcionalidades adicionales

### Avanzado
- Implementa las funciones usando solo las especificaciones
- Mejora el codigo con patrones de diseño avanzados
- Extiende la funcionalidad mas alla de los requisitos

## Herramientas y Comandos Utiles

### Comandos de Desarrollo
```bash
# Instalar dependencias
npm install

# Compilar TypeScript
npm run compile

# Modo watch para desarrollo
npm run watch

# Linting del codigo
npm run lint

# Empaquetar extension
npm run package
```

### Atajos de VSCode para Desarrollo
- `F5`: Abrir ventana de desarrollo con extension cargada
- `Ctrl+Shift+F5`: Recargar ventana de desarrollo
- `Ctrl+Shift+I`: Abrir DevTools para debug
- `Ctrl+Shift+P`: Command Palette

## Resultado Final

Al completar el taller habras creado una extension VSCode completa con:

### Funcionalidades Principales
- **18 comandos** implementados con atajos de teclado
- **20+ snippets predefinidos** en 4 lenguajes de programacion
- **Sistema CRUD completo** para plantillas personalizadas
- **6 interfaces de usuario** diferentes y intuitivas
- **Importacion/exportacion** de snippets en formato JSON
- **Dashboard de estadisticas** visual y detallado

### Metricas del Proyecto
- **~1,770 lineas** de codigo TypeScript bien estructurado
- **4 modulos principales** con responsabilidades claras
- **Documentacion completa** lista para distribucion
- **Configuracion profesional** para VSCode Marketplace

### Capacidades Tecnicas Adquiridas
- Desarrollo de extensiones VSCode con TypeScript
- Gestion de comandos y contribuciones
- Creacion de interfaces de usuario interactivas
- Persistencia de datos en extensiones
- Empaquetado y distribucion de extensiones

## Soporte y Recursos

### Durante el Taller
- **Instructor disponible** para preguntas y dudas
- **Fragmentos de codigo** en `fragmentos/` como referencia
- **Solucion completa** en `solucion/` para comparar

### Recursos Adicionales
- [Documentacion oficial VSCode Extensions](https://code.visualstudio.com/api)
- [Guia de TypeScript](https://www.typescriptlang.org/docs/)
- [VSCode Extension Samples](https://github.com/Microsoft/vscode-extension-samples)

## ¡Comencemos!

**¿Listo para crear tu primera extension VSCode?**

👉 **Siguiente paso**: Abre `taller/instrucciones.md` y comienza con el Paso 1

---

### Consejo para el Exito
*No tengas miedo de experimentar y hacer preguntas. La programacion se aprende mejor haciendo, y cada error es una oportunidad de aprendizaje. ¡Diviertete creando!*

---

**¡Feliz codificacion! 🎉**
