# Instrucciones Detalladas del Taller

## Paso 1: Configuracion Inicial (30 min)

### Objetivo
Preparar el entorno y estructura basica del proyecto de extension VSCode.

### Tareas a Realizar

#### 1.1 Crear package.json base
Crea el archivo `package.json` en la carpeta `taller/` con la configuracion basica de la extension:

```json
{
  "name": "quick-snippet-inserter",
  "displayName": "Quick Snippet Inserter",
  "description": "Plugin para insertar rapidamente plantillas de codigo predefinidas",
  "version": "0.0.1",
  "engines": {
    "vscode": "^1.74.0"
  },
  "categories": [
    "Snippets",
    "Productivity"
  ],
  "activationEvents": [],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [],
    "keybindings": []
  },
  "scripts": {
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./"
  },
  "devDependencies": {
    "@types/vscode": "^1.74.0",
    "@types/node": "16.x",
    "typescript": "^4.9.4"
  }
}
```

#### 1.2 Configurar TypeScript
Crea el archivo `tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2020",
    "outDir": "out",
    "lib": [
      "ES2020"
    ],
    "sourceMap": true,
    "rootDir": "src",
    "strict": true
  }
}
```

#### 1.3 Configurar debug en VSCode
Crea la carpeta `.vscode` y el archivo `launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run Extension",
      "type": "extensionHost",
      "request": "launch",
      "args": [
        "--extensionDevelopmentPath=${workspaceFolder}"
      ]
    }
  ]
}
```

#### 1.4 Verificar configuracion
- Ejecuta `npm install` para instalar dependencias
- Compila el proyecto con `npm run compile`
- Realiza el primer commit

### Archivos Creados
- `taller/package.json`
- `taller/tsconfig.json`
- `taller/.vscode/launch.json`

---

## Paso 2: Comandos Basicos (45 min)

### Objetivo
Implementar la estructura basica de comandos de la extension.

### Tareas a Realizar

#### 2.1 Crear extension.ts
Crea el archivo `src/extension.ts` con el punto de entrada principal:

**FRAGMENTO A COMPLETAR:**
```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "quick-snippet-inserter" is now active!');

    // TODO: Registrar comando basico de insercion
    let disposable = vscode.commands.registerCommand('quickSnippet.insertSnippet', () => {
        // TODO: Implementar logica basica
        vscode.window.showInformationMessage('¡Snippet insertado!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
```

#### 2.2 Actualizar package.json
Agrega las contribuciones de comandos y atajos:

**FRAGMENTO A COMPLETAR:**
```json
"contributes": {
    "commands": [
        {
            "command": "quickSnippet.insertSnippet",
            "title": "Insertar Snippet Rapido"
        }
    ],
    "keybindings": [
        {
            "command": "quickSnippet.insertSnippet",
            "key": "ctrl+shift+s",
            "when": "editorTextFocus"
        }
    ]
}
```

#### 2.3 Probar la extension
- Compila: `npm run compile`
- Presiona F5 para abrir ventana de desarrollo
- Prueba el comando con Ctrl+Shift+S

### Archivos Creados/Modificados
- `taller/src/extension.ts`
- `taller/package.json` (actualizado)

---

## Paso 3: Sistema de Snippets (60 min)

### Objetivo
Implementar la funcionalidad central de insercion de snippets.

### Tareas a Realizar

#### 3.1 Crear snippets.ts
Crea el archivo `src/snippets.ts` con la base de datos de snippets:

**FRAGMENTO A COMPLETAR:**
```typescript
export interface Snippet {
    id: string;
    name: string;
    description: string;
    content: string;
    language: string;
    category: string;
    prefix: string;
}

export const predefinedSnippets: Snippet[] = [
    {
        id: 'js-console-log',
        name: 'console.log',
        description: 'Log basico de consola',
        content: 'console.log(${1:mensaje});$0',
        language: 'javascript',
        category: 'Debug',
        prefix: 'cl'
    },
    // TODO: Agregar mas snippets
];

export function getSnippetsByLanguage(language: string): Snippet[] {
    // TODO: Implementar filtrado por lenguaje
    return predefinedSnippets.filter(snippet => snippet.language === language);
}

export function getSnippetsByCategory(category: string): Snippet[] {
    // TODO: Implementar filtrado por categoria
    return predefinedSnippets.filter(snippet => snippet.category === category);
}
```

#### 3.2 Implementar insercion de texto
Actualiza `extension.ts` para insertar texto real:

**FRAGMENTO A COMPLETAR:**
```typescript
import { predefinedSnippets } from './snippets';

// En la funcion activate:
let insertCommand = vscode.commands.registerCommand('quickSnippet.insertSnippet', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No hay editor activo');
        return;
    }

    // TODO: Mostrar lista de snippets para seleccionar
    const selectedSnippet = predefinedSnippets[0]; // Por ahora, usar el primero
    
    // TODO: Insertar snippet con soporte para placeholders
    const snippet = new vscode.SnippetString(selectedSnippet.content);
    await editor.insertSnippet(snippet);
});
```

### Archivos Creados/Modificados
- `taller/src/snippets.ts`
- `taller/src/extension.ts` (actualizado)

---

## Paso 4: Interfaz de Usuario (75 min)

### Objetivo
Crear interfaces intuitivas para seleccionar y gestionar snippets.

### Tareas a Realizar

#### 4.1 Crear userInterface.ts
Crea el archivo `src/userInterface.ts`:

**FRAGMENTO A COMPLETAR:**
```typescript
import * as vscode from 'vscode';
import { Snippet } from './snippets';

export async function showSnippetPicker(snippets: Snippet[]): Promise<Snippet | undefined> {
    // TODO: Crear QuickPick con snippets organizados
    const items: vscode.QuickPickItem[] = snippets.map(snippet => ({
        label: snippet.name,
        description: snippet.description,
        detail: `${snippet.language} - ${snippet.category}`
    }));

    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Selecciona un snippet para insertar'
    });

    if (selected) {
        // TODO: Encontrar y retornar el snippet seleccionado
        return snippets.find(s => s.name === selected.label);
    }

    return undefined;
}

export async function showMainMenu(): Promise<string | undefined> {
    // TODO: Implementar menu principal con opciones
    const options = [
        'Insertar Snippet',
        'Crear Snippet Personalizado',
        'Ver Lista de Snippets'
    ];

    return await vscode.window.showQuickPick(options, {
        placeHolder: 'Selecciona una accion'
    });
}
```

#### 4.2 Integrar interfaz en extension.ts
Actualiza el comando principal para usar la nueva interfaz:

**FRAGMENTO A COMPLETAR:**
```typescript
import { showSnippetPicker, showMainMenu } from './userInterface';

// Actualizar comando:
let insertCommand = vscode.commands.registerCommand('quickSnippet.insertSnippet', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No hay editor activo');
        return;
    }

    // TODO: Usar la interfaz de seleccion
    const selectedSnippet = await showSnippetPicker(predefinedSnippets);
    
    if (selectedSnippet) {
        const snippet = new vscode.SnippetString(selectedSnippet.content);
        await editor.insertSnippet(snippet);
    }
});
```

### Archivos Creados/Modificados
- `taller/src/userInterface.ts`
- `taller/src/extension.ts` (actualizado)

---

## Paso 5: Plantillas Personalizadas (90 min)

### Objetivo
Desarrollar sistema completo CRUD para plantillas personalizadas.

### Tareas a Realizar

#### 5.1 Crear templateManager.ts
Crea el archivo `src/templateManager.ts`:

**FRAGMENTO A COMPLETAR:**
```typescript
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Snippet } from './snippets';

export class TemplateManager {
    private userTemplatesPath: string;

    constructor(context: vscode.ExtensionContext) {
        // TODO: Configurar ruta de almacenamiento
        this.userTemplatesPath = path.join(context.globalStorageUri.fsPath, 'user-templates.json');
    }

    async loadUserTemplates(): Promise<Snippet[]> {
        // TODO: Cargar plantillas del archivo JSON
        try {
            if (fs.existsSync(this.userTemplatesPath)) {
                const data = fs.readFileSync(this.userTemplatesPath, 'utf8');
                const parsed = JSON.parse(data);
                return parsed.templates || [];
            }
        } catch (error) {
            console.error('Error loading user templates:', error);
        }
        return [];
    }

    async saveUserTemplates(templates: Snippet[]): Promise<void> {
        // TODO: Guardar plantillas en archivo JSON
        try {
            const data = {
                version: "1.0.0",
                templates: templates,
                metadata: {
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            };
            
            // Asegurar que el directorio existe
            const dir = path.dirname(this.userTemplatesPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(this.userTemplatesPath, JSON.stringify(data, null, 2));
        } catch (error) {
            throw new Error(`Error saving templates: ${error}`);
        }
    }

    async createNewTemplate(): Promise<Snippet | undefined> {
        // TODO: Implementar asistente para crear plantillas
        const name = await vscode.window.showInputBox({
            prompt: 'Nombre del snippet',
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'El nombre no puede estar vacio';
                }
                return null;
            }
        });

        if (!name) return undefined;

        // TODO: Solicitar mas campos (descripcion, contenido, etc.)
        // TODO: Retornar nuevo snippet
        return undefined;
    }
}
```

#### 5.2 Integrar gestor de plantillas
Actualiza `extension.ts` para usar el gestor:

**FRAGMENTO A COMPLETAR:**
```typescript
import { TemplateManager } from './templateManager';

export function activate(context: vscode.ExtensionContext) {
    // TODO: Crear instancia del gestor de plantillas
    const templateManager = new TemplateManager(context);

    // TODO: Agregar comandos para gestionar plantillas personalizadas
    let createTemplateCommand = vscode.commands.registerCommand('quickSnippet.createTemplate', async () => {
        const newTemplate = await templateManager.createNewTemplate();
        if (newTemplate) {
            vscode.window.showInformationMessage(`Snippet "${newTemplate.name}" creado exitosamente!`);
        }
    });

    context.subscriptions.push(createTemplateCommand);
}
```

### Archivos Creados/Modificados
- `taller/src/templateManager.ts`
- `taller/src/extension.ts` (actualizado)

---

## Paso 6: Documentacion y Empaquetado (45 min)

### Objetivo
Preparar la extension para distribucion profesional.

### Tareas a Realizar

#### 6.1 Crear documentacion basica
Crea los archivos de documentacion:

**CHANGELOG.md:**
```markdown
# Change Log

## [0.0.1] - 2024-01-01
### Added
- Funcionalidad basica de insercion de snippets
- Sistema de plantillas personalizadas
- Interfaz de usuario con Quick Pick
- Soporte para multiples lenguajes de programacion
```

**docs/USER_GUIDE.md:**
```markdown
# Guia del Usuario

## Instalacion
1. Instala la extension desde el marketplace
2. Reinicia VSCode

## Uso Basico
- Presiona `Ctrl+Shift+S` para insertar un snippet
- Usa `Ctrl+Shift+N` para crear un snippet personalizado

## Comandos Disponibles
- `quickSnippet.insertSnippet`: Insertar snippet
- `quickSnippet.createTemplate`: Crear plantilla personalizada
```

#### 6.2 Configurar empaquetado
Actualiza `package.json` con scripts de empaquetado:

```json
"scripts": {
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./",
    "package": "vsce package",
    "publish": "vsce publish"
},
"devDependencies": {
    "@types/vscode": "^1.74.0",
    "@types/node": "16.x",
    "typescript": "^4.9.4",
    "@vscode/vsce": "^2.15.0"
}
```

#### 6.3 Probar empaquetado
- Instala VSCE: `npm install -g @vscode/vsce`
- Empaqueta: `npm run package`
- Prueba la instalacion local

### Archivos Creados
- `taller/CHANGELOG.md`
- `taller/docs/USER_GUIDE.md`
- `taller/package.json` (actualizado)

---

## Verificacion Final

### Lista de Verificacion
- [ ] La extension se compila sin errores
- [ ] Los comandos funcionan correctamente
- [ ] Se pueden insertar snippets predefinidos
- [ ] Se pueden crear snippets personalizados
- [ ] La interfaz de usuario es intuitiva
- [ ] La documentacion esta completa
- [ ] El empaquetado funciona correctamente

### Pruebas a Realizar
1. Abrir VSCode con la extension
2. Probar insercion de snippets con Ctrl+Shift+S
3. Crear un snippet personalizado
4. Verificar que se guarda correctamente
5. Probar en diferentes tipos de archivos

### Solucion de Problemas Comunes
- **Error de compilacion**: Verificar tsconfig.json y dependencias
- **Comandos no funcionan**: Revisar contribuciones en package.json
- **Snippets no se insertan**: Verificar que hay un editor activo
- **No se guardan plantillas**: Verificar permisos de escritura

---

## Siguientes Pasos

### Mejoras Opcionales
- Agregar mas snippets predefinidos
- Implementar importacion/exportacion
- Crear dashboard de estadisticas
- Agregar soporte para mas lenguajes
- Mejorar la interfaz de usuario

### Recursos para Continuar
- [VSCode Extension API](https://code.visualstudio.com/api)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [VSCode Extension Samples](https://github.com/Microsoft/vscode-extension-samples)

¡Felicitaciones! Has completado el taller y creado tu primera extension VSCode.
