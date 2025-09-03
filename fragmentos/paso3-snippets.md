# Paso 3: Sistema de Snippets - Fragmentos de Codigo

## src/snippets.ts - Base de Datos de Snippets

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
    // JavaScript/TypeScript - Debug
    {
        id: 'js-console-log',
        name: 'console.log',
        description: 'Log basico de consola',
        content: 'console.log(${1:mensaje});$0',
        language: 'javascript',
        category: 'Debug',
        prefix: 'cl'
    },
    {
        id: 'js-console-error',
        name: 'console.error',
        description: 'Log de error en consola',
        content: 'console.error(${1:error});$0',
        language: 'javascript',
        category: 'Debug',
        prefix: 'ce'
    },

    // JavaScript/TypeScript - Functions
    {
        id: 'js-function',
        name: 'function',
        description: 'Funcion basica de JavaScript',
        content: 'function ${1:nombreFuncion}(${2:parametros}) {\n\t${3:// codigo aqui}\n\treturn ${4:resultado};\n}$0',
        language: 'javascript',
        category: 'Functions',
        prefix: 'fn'
    },
    {
        id: 'js-arrow-function',
        name: 'arrow-function',
        description: 'Funcion flecha de ES6',
        content: 'const ${1:nombreFuncion} = (${2:parametros}) => {\n\t${3:// codigo aqui}\n\treturn ${4:resultado};\n};$0',
        language: 'javascript',
        category: 'Functions',
        prefix: 'af'
    },
    {
        id: 'js-async-function',
        name: 'async-function',
        description: 'Funcion asincrona con manejo de errores',
        content: 'async function ${1:nombreFuncion}(${2:parametros}) {\n\ttry {\n\t\t${3:// codigo asincrono}\n\t\treturn ${4:resultado};\n\t} catch (error) {\n\t\tconsole.error(error);\n\t\tthrow error;\n\t}\n}$0',
        language: 'javascript',
        category: 'Functions',
        prefix: 'afn'
    },

    // JavaScript/TypeScript - Classes
    {
        id: 'js-class',
        name: 'class',
        description: 'Clase basica de JavaScript',
        content: 'class ${1:NombreClase} {\n\tconstructor(${2:parametros}) {\n\t\t${3:// inicializacion}\n\t}\n\n\t${4:metodo}() {\n\t\t${5:// codigo del metodo}\n\t}\n}$0',
        language: 'javascript',
        category: 'Classes',
        prefix: 'cls'
    },

    // JavaScript/TypeScript - Error Handling
    {
        id: 'js-try-catch',
        name: 'try-catch',
        description: 'Bloque try-catch',
        content: 'try {\n\t${1:// codigo que puede fallar}\n} catch (error) {\n\tconsole.error(${2:"Error:"}, error);\n\t${3:// manejo del error}\n}$0',
        language: 'javascript',
        category: 'Error Handling',
        prefix: 'tc'
    },

    // HTML - Boilerplate
    {
        id: 'html-boilerplate',
        name: 'html5-boilerplate',
        description: 'Plantilla HTML5 basica',
        content: '<!DOCTYPE html>\n<html lang="${1:es}">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>${2:Titulo}</title>\n</head>\n<body>\n\t${3:<!-- Contenido aqui -->}\n</body>\n</html>$0',
        language: 'html',
        category: 'Boilerplate',
        prefix: 'html5'
    },
    {
        id: 'html-div-class',
        name: 'div-class',
        description: 'Div con clase CSS',
        content: '<div class="${1:nombre-clase}">\n\t${2:<!-- Contenido -->}\n</div>$0',
        language: 'html',
        category: 'Elements',
        prefix: 'div'
    },

    // CSS - Layout
    {
        id: 'css-flexbox-center',
        name: 'flexbox-center',
        description: 'Centrar con Flexbox',
        content: '.${1:contenedor} {\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\t${2:/* Propiedades adicionales */}\n}$0',
        language: 'css',
        category: 'Layout',
        prefix: 'flex-center'
    },
    {
        id: 'css-grid-template',
        name: 'grid-template',
        description: 'Plantilla basica de CSS Grid',
        content: '.${1:contenedor} {\n\tdisplay: grid;\n\tgrid-template-columns: ${2:1fr 1fr};\n\tgrid-gap: ${3:20px};\n\t${4:/* Propiedades adicionales */}\n}$0',
        language: 'css',
        category: 'Layout',
        prefix: 'grid'
    },

    // Python - Functions
    {
        id: 'py-function',
        name: 'def-function',
        description: 'Funcion de Python',
        content: 'def ${1:nombre_funcion}(${2:parametros}):\n\t"""${3:Descripcion de la funcion}"""\n\t${4:# codigo aqui}\n\treturn ${5:resultado}$0',
        language: 'python',
        category: 'Functions',
        prefix: 'def'
    },
    {
        id: 'py-class',
        name: 'class-python',
        description: 'Clase de Python',
        content: 'class ${1:NombreClase}:\n\t"""${2:Descripcion de la clase}"""\n\t\n\tdef __init__(self, ${3:parametros}):\n\t\t${4:# inicializacion}\n\t\tpass\n\t\n\tdef ${5:metodo}(self):\n\t\t"""${6:Descripcion del metodo}"""\n\t\t${7:# codigo del metodo}\n\t\tpass$0',
        language: 'python',
        category: 'Classes',
        prefix: 'class'
    }
];

// Funciones de utilidad para filtrar snippets
export function getSnippetsByLanguage(language: string): Snippet[] {
    return predefinedSnippets.filter(snippet => 
        snippet.language.toLowerCase() === language.toLowerCase()
    );
}

export function getSnippetsByCategory(category: string): Snippet[] {
    return predefinedSnippets.filter(snippet => 
        snippet.category.toLowerCase() === category.toLowerCase()
    );
}

export function getAllLanguages(): string[] {
    const languages = new Set(predefinedSnippets.map(snippet => snippet.language));
    return Array.from(languages).sort();
}

export function getAllCategories(): string[] {
    const categories = new Set(predefinedSnippets.map(snippet => snippet.category));
    return Array.from(categories).sort();
}

export function searchSnippets(query: string): Snippet[] {
    const lowerQuery = query.toLowerCase();
    return predefinedSnippets.filter(snippet =>
        snippet.name.toLowerCase().includes(lowerQuery) ||
        snippet.description.toLowerCase().includes(lowerQuery) ||
        snippet.category.toLowerCase().includes(lowerQuery) ||
        snippet.prefix.toLowerCase().includes(lowerQuery)
    );
}

export function getSnippetById(id: string): Snippet | undefined {
    return predefinedSnippets.find(snippet => snippet.id === id);
}

// Detectar lenguaje del archivo actual
export function detectLanguageFromFileName(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
        case 'js':
        case 'jsx':
        case 'ts':
        case 'tsx':
            return 'javascript';
        case 'html':
        case 'htm':
            return 'html';
        case 'css':
        case 'scss':
        case 'sass':
            return 'css';
        case 'py':
            return 'python';
        case 'java':
            return 'java';
        case 'cpp':
        case 'cc':
        case 'cxx':
            return 'cpp';
        case 'c':
            return 'c';
        case 'php':
            return 'php';
        case 'rb':
            return 'ruby';
        case 'go':
            return 'go';
        case 'rs':
            return 'rust';
        default:
            return 'plaintext';
    }
}
```

## src/extension.ts - Actualizacion para Usar Snippets

```typescript
import * as vscode from 'vscode';
import { predefinedSnippets, getSnippetsByLanguage, detectLanguageFromFileName } from './snippets';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating Quick Snippet Inserter extension...');

    // Comando principal de insercion con seleccion
    let insertSnippetCommand = vscode.commands.registerCommand('quickSnippet.insertSnippet', async () => {
        try {
            const editor = vscode.window.activeTextEditor;
            
            if (!editor) {
                vscode.window.showWarningMessage('Por favor, abre un archivo para insertar snippets');
                return;
            }

            // Crear lista de opciones para QuickPick
            const quickPickItems = predefinedSnippets.map(snippet => ({
                label: snippet.name,
                description: snippet.description,
                detail: `${snippet.language} - ${snippet.category}`,
                snippet: snippet
            }));

            // Mostrar selector
            const selected = await vscode.window.showQuickPick(quickPickItems, {
                placeHolder: 'Selecciona un snippet para insertar',
                matchOnDescription: true,
                matchOnDetail: true
            });

            if (selected) {
                // Insertar el snippet seleccionado
                const snippetString = new vscode.SnippetString(selected.snippet.content);
                await editor.insertSnippet(snippetString);
                
                vscode.window.showInformationMessage(`✅ Snippet "${selected.snippet.name}" insertado!`);
            }
            
        } catch (error) {
            console.error('Error inserting snippet:', error);
            vscode.window.showErrorMessage('❌ Error al insertar snippet');
        }
    });

    // Comando para insertar snippets por lenguaje
    let insertByLanguageCommand = vscode.commands.registerCommand('quickSnippet.insertByLanguage', async () => {
        try {
            const editor = vscode.window.activeTextEditor;
            
            if (!editor) {
                vscode.window.showWarningMessage('Por favor, abre un archivo para insertar snippets');
                return;
            }

            // Detectar lenguaje del archivo actual
            const fileName = editor.document.fileName;
            const detectedLanguage = detectLanguageFromFileName(fileName);
            
            // Filtrar snippets por lenguaje
            const languageSnippets = getSnippetsByLanguage(detectedLanguage);
            
            if (languageSnippets.length === 0) {
                vscode.window.showInformationMessage(`No hay snippets disponibles para ${detectedLanguage}`);
                return;
            }

            // Crear lista de opciones
            const quickPickItems = languageSnippets.map(snippet => ({
                label: snippet.name,
                description: snippet.description,
                detail: snippet.category,
                snippet: snippet
            }));

            // Mostrar selector
            const selected = await vscode.window.showQuickPick(quickPickItems, {
                placeHolder: `Snippets para ${detectedLanguage}`,
                matchOnDescription: true
            });

            if (selected) {
                const snippetString = new vscode.SnippetString(selected.snippet.content);
                await editor.insertSnippet(snippetString);
                
                vscode.window.showInformationMessage(`✅ Snippet "${selected.snippet.name}" insertado!`);
            }
            
        } catch (error) {
            console.error('Error inserting snippet by language:', error);
            vscode.window.showErrorMessage('❌ Error al insertar snippet');
        }
    });

    // Comando rapido para console.log
    let quickLogCommand = vscode.commands.registerCommand('quickSnippet.quickLog', async () => {
        try {
            const editor = vscode.window.activeTextEditor;
            
            if (!editor) {
                vscode.window.showWarningMessage('Por favor, abre un archivo para insertar console.log');
                return;
            }

            const snippet = new vscode.SnippetString('console.log(${1:mensaje});$0');
            await editor.insertSnippet(snippet);
            
        } catch (error) {
            console.error('Error inserting quick log:', error);
            vscode.window.showErrorMessage('❌ Error al insertar console.log');
        }
    });

    context.subscriptions.push(
        insertSnippetCommand,
        insertByLanguageCommand,
        quickLogCommand
    );
    
    console.log('Quick Snippet Inserter extension activated successfully!');
}

export function deactivate() {
    console.log('Quick Snippet Inserter extension deactivated');
}
```

## package.json - Comandos Adicionales

Agrega estos comandos a tu seccion `contributes.commands`:

```json
{
  "contributes": {
    "commands": [
      {
        "command": "quickSnippet.insertSnippet",
        "title": "Insertar Snippet Rapido",
        "category": "Quick Snippet"
      },
      {
        "command": "quickSnippet.insertByLanguage",
        "title": "Insertar Snippet por Lenguaje",
        "category": "Quick Snippet"
      },
      {
        "command": "quickSnippet.quickLog",
        "title": "Insertar console.log Rapido",
        "category": "Quick Snippet"
      }
    ],
    "keybindings": [
      {
        "command": "quickSnippet.insertSnippet",
        "key": "ctrl+shift+s",
        "mac": "cmd+shift+s",
        "when": "editorTextFocus"
      },
      {
        "command": "quickSnippet.insertByLanguage",
        "key": "ctrl+shift+l",
        "mac": "cmd+shift+l",
        "when": "editorTextFocus"
      },
      {
        "command": "quickSnippet.quickLog",
        "key": "ctrl+shift+q",
        "mac": "cmd+shift+q",
        "when": "editorTextFocus"
      }
    ]
  }
}
```

## Probar el Sistema de Snippets

### Pasos para Probar:

1. **Compilar y ejecutar**:
   ```bash
   npm run compile
   # Presiona F5 para abrir ventana de desarrollo
   ```

2. **Probar snippets generales**:
   - Crea un archivo `test.js`
   - Presiona `Ctrl+Shift+S`
   - Selecciona diferentes snippets de la lista
   - Verifica que se insertan correctamente

3. **Probar snippets por lenguaje**:
   - Abre archivos con diferentes extensiones (.js, .html, .css, .py)
   - Presiona `Ctrl+Shift+L` en cada archivo
   - Verifica que solo aparecen snippets del lenguaje correspondiente

4. **Probar console.log rapido**:
   - En un archivo JavaScript
   - Presiona `Ctrl+Shift+Q`
   - Verifica que se inserta directamente

### Funcionalidades a Verificar:

- ✅ Lista de snippets se muestra correctamente
- ✅ Busqueda por nombre y descripcion funciona
- ✅ Filtrado por lenguaje funciona
- ✅ Placeholders (${1:texto}) funcionan
- ✅ Navegacion con Tab entre placeholders
- ✅ Mensajes de confirmacion aparecen
