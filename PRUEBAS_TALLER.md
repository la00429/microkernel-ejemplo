# 🧪 Guía de Pruebas del Taller

## ✅ Checklist de Verificación

### Pre-Taller (Instructor)
- [ ] **Estructura de archivos completa**
  ```bash
  ls -la  # Verificar carpetas: taller/, solucion/, fragmentos/
  ```

- [ ] **Dependencias instaladas en taller/**
  ```bash
  cd taller && npm install && npm run compile
  ```

- [ ] **Dependencias instaladas en solucion/**
  ```bash
  cd solucion && npm install && npm run compile
  ```

- [ ] **VSCode puede abrir ambos proyectos**
  ```bash
  code taller/    # Debe abrir sin errores
  code solucion/  # Debe abrir sin errores
  ```

### Durante el Taller (Cada Paso)

#### Paso 1: Configuración Inicial
- [ ] **package.json válido**
  ```bash
  cd taller && npm install  # Sin errores
  ```
- [ ] **tsconfig.json compila**
  ```bash
  npm run compile  # Sin errores TypeScript
  ```
- [ ] **F5 abre ventana de desarrollo** (aunque extensión no haga nada aún)

#### Paso 2: Comandos Básicos
- [ ] **Extensión se activa**
  - F5 abre ventana de desarrollo
  - En consola aparece: "Extension quick-snippet-inserter is now active!"
- [ ] **Comando aparece en Command Palette**
  - Ctrl+Shift+P → buscar "Quick Snippet" → debe aparecer
- [ ] **Atajo de teclado funciona**
  - Ctrl+Shift+S debe mostrar mensaje o hacer algo

#### Paso 3: Sistema de Snippets
- [ ] **Snippets se insertan correctamente**
  - Crear archivo test.js
  - Ctrl+Shift+S → seleccionar snippet → debe insertarse
- [ ] **Placeholders funcionan**
  - Después de insertar, debe haber texto seleccionado
  - Tab debe navegar entre placeholders

#### Paso 4: Interfaz de Usuario
- [ ] **QuickPick mejorado funciona**
  - Lista de snippets se ve bien formateada
  - Búsqueda en tiempo real funciona
  - Iconos y descripciones aparecen
- [ ] **Menú principal accesible**
  - Ctrl+Shift+M abre menú principal
  - Todas las opciones navegan correctamente

#### Paso 5: Plantillas Personalizadas
- [ ] **Crear snippet personalizado**
  - Ctrl+Shift+N abre asistente
  - Completar todos los pasos sin errores
  - Snippet se guarda y aparece en lista
- [ ] **Persistencia funciona**
  - Cerrar y reabrir VSCode
  - Snippets personalizados siguen ahí
- [ ] **Exportar/Importar funciona**
  - Exportar genera archivo JSON válido
  - Importar carga snippets correctamente

#### Paso 6: Documentación y Empaquetado
- [ ] **Documentación completa**
  - README.md, CHANGELOG.md, etc. creados
  - Contenido apropiado y sin errores
- [ ] **Empaquetado funciona**
  ```bash
  npm run package  # Genera archivo .vsix
  ```
- [ ] **Instalación local funciona**
  ```bash
  code --install-extension archivo.vsix
  ```

### Post-Taller (Verificación Final)
- [ ] **Extensión completa funcional**
  - Todos los comandos principales funcionan
  - Snippets predefinidos y personalizados disponibles
  - Interfaz de usuario intuitiva
- [ ] **Código bien estructurado**
  - Sin errores de TypeScript
  - Sin warnings de ESLint
  - Comentarios y documentación apropiada
- [ ] **Lista para distribución**
  - Archivo .vsix generado
  - Instalación local exitosa
  - Todos los comandos funcionan en instalación

## 🐛 Problemas Comunes y Soluciones

### "Extension no se activa"
```bash
# Verificar activationEvents en package.json
# Asegurar que comandos estén registrados
# Revisar consola de Developer Tools (F12)
```

### "npm install falla"
```bash
# Verificar Node.js versión 16+
node --version
npm --version

# Limpiar cache si es necesario
npm cache clean --force
```

### "TypeScript no compila"
```bash
# Verificar sintaxis en archivos .ts
# Comprobar imports y exports
# Revisar tsconfig.json
```

### "Comandos no aparecen"
```bash
# Verificar package.json → contributes → commands
# Comprobar registro en extension.ts
# Reiniciar ventana de desarrollo (Ctrl+R)
```

### "Snippets no se insertan"
```bash
# Verificar que hay editor activo
# Comprobar sintaxis de SnippetString
# Revisar contenido del snippet
```

## 📊 Métricas de Éxito

### Tiempo por Paso (Objetivo)
- Paso 1: 15-30 minutos
- Paso 2: 30-45 minutos  
- Paso 3: 45-60 minutos
- Paso 4: 60-75 minutos
- Paso 5: 75-90 minutos
- Paso 6: 30-45 minutos

### Funcionalidades Mínimas al Final
- [ ] Al menos 5 snippets predefinidos funcionando
- [ ] Interfaz QuickPick básica
- [ ] Crear al menos 1 snippet personalizado
- [ ] Snippet personalizado persiste entre sesiones
- [ ] Archivo .vsix se genera correctamente

### Indicadores de Calidad
- [ ] Código compila sin errores
- [ ] Extensión se activa correctamente
- [ ] Todos los comandos principales funcionan
- [ ] Interfaz de usuario es intuitiva
- [ ] Documentación está completa

## 🎯 Scripts de Prueba Automatizada

### test-taller.sh (Linux/Mac)
```bash
#!/bin/bash
echo "🧪 Probando estructura del taller..."

# Verificar estructura
if [ ! -d "taller" ] || [ ! -d "solucion" ] || [ ! -d "fragmentos" ]; then
    echo "❌ Estructura de carpetas incompleta"
    exit 1
fi

# Probar taller
cd taller
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install falló en taller"
    exit 1
fi

npm run compile
if [ $? -ne 0 ]; then
    echo "❌ Compilación falló en taller"
    exit 1
fi

# Probar solución
cd ../solucion
npm run compile
if [ $? -ne 0 ]; then
    echo "❌ Compilación falló en solución"
    exit 1
fi

echo "✅ Todas las pruebas básicas pasaron!"
```

### test-taller.bat (Windows)
```batch
@echo off
echo 🧪 Probando estructura del taller...

REM Verificar estructura
if not exist "taller" (
    echo ❌ Carpeta taller no existe
    exit /b 1
)
if not exist "solucion" (
    echo ❌ Carpeta solucion no existe
    exit /b 1
)
if not exist "fragmentos" (
    echo ❌ Carpeta fragmentos no existe
    exit /b 1
)

REM Probar taller
cd taller
call npm install
if %errorlevel% neq 0 (
    echo ❌ npm install falló en taller
    exit /b 1
)

call npm run compile
if %errorlevel% neq 0 (
    echo ❌ Compilación falló en taller
    exit /b 1
)

REM Probar solución
cd ..\solucion
call npm run compile
if %errorlevel% neq 0 (
    echo ❌ Compilación falló en solución
    exit /b 1
)

echo ✅ Todas las pruebas básicas pasaron!
```

## 📝 Formulario de Feedback

### Para Estudiantes
```
¿Qué paso te resultó más difícil? _______________
¿Qué paso te resultó más fácil? _______________
¿Los fragmentos de código fueron útiles? Sí/No
¿La documentación fue clara? Sí/No
¿Completaste el taller exitosamente? Sí/No
Tiempo total invertido: _____ horas
Calificación general (1-10): _____
```
