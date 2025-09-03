# Paso 4: Interfaz de Usuario - Fragmentos de Codigo

## src/userInterface.ts - Interfaces Avanzadas

```typescript
import * as vscode from 'vscode';
import { Snippet, getAllLanguages, getAllCategories, searchSnippets } from './snippets';

export interface QuickPickSnippetItem extends vscode.QuickPickItem {
    snippet: Snippet;
}

export class SnippetQuickPick {
    private quickPick: vscode.QuickPick<QuickPickSnippetItem>;

    constructor() {
        this.quickPick = vscode.window.createQuickPick<QuickPickSnippetItem>();
        this.setupQuickPick();
    }

    private setupQuickPick() {
        this.quickPick.placeholder = 'Busca y selecciona un snippet...';
        this.quickPick.matchOnDescription = true;
        this.quickPick.matchOnDetail = true;
        this.quickPick.canSelectMany = false;
    }

    async showSnippetPicker(snippets: Snippet[]): Promise<Snippet | undefined> {
        return new Promise((resolve) => {
            // Convertir snippets a items de QuickPick
            const items: QuickPickSnippetItem[] = snippets.map(snippet => ({
                label: `$(symbol-snippet) ${snippet.name}`,
                description: snippet.description,
                detail: `${this.getLanguageIcon(snippet.language)} ${snippet.language} • ${snippet.category}`,
                snippet: snippet
            }));

            this.quickPick.items = items;
            this.quickPick.title = `📋 Snippets Disponibles (${snippets.length})`;

            this.quickPick.onDidChangeSelection(selection => {
                if (selection[0]) {
                    resolve(selection[0].snippet);
                    this.quickPick.hide();
                }
            });

            this.quickPick.onDidHide(() => {
                resolve(undefined);
                this.quickPick.dispose();
            });

            this.quickPick.show();
        });
    }

    private getLanguageIcon(language: string): string {
        const icons: { [key: string]: string } = {
            'javascript': '$(symbol-function)',
            'html': '$(symbol-tag)',
            'css': '$(symbol-color)',
            'python': '$(symbol-snake)',
            'java': '$(symbol-class)',
            'cpp': '$(symbol-misc)',
            'c': '$(symbol-misc)',
            'php': '$(symbol-web)',
            'ruby': '$(symbol-gem)',
            'go': '$(symbol-go)',
            'rust': '$(symbol-rust)'
        };
        return icons[language] || '$(symbol-file)';
    }
}

export async function showMainMenu(): Promise<string | undefined> {
    const options = [
        {
            label: '$(add) Insertar Snippet',
            description: 'Seleccionar e insertar un snippet de codigo',
            action: 'insert'
        },
        {
            label: '$(filter) Snippets por Lenguaje',
            description: 'Ver snippets filtrados por lenguaje de programacion',
            action: 'byLanguage'
        },
        {
            label: '$(tag) Snippets por Categoria',
            description: 'Ver snippets organizados por categoria',
            action: 'byCategory'
        },
        {
            label: '$(search) Buscar Snippets',
            description: 'Buscar snippets por nombre o descripcion',
            action: 'search'
        },
        {
            label: '$(new-file) Crear Snippet Personalizado',
            description: 'Crear un nuevo snippet personalizado',
            action: 'create'
        },
        {
            label: '$(list-unordered) Ver Todos los Snippets',
            description: 'Mostrar lista completa de snippets disponibles',
            action: 'viewAll'
        },
        {
            label: '$(info) Informacion de la Extension',
            description: 'Ver informacion y estadisticas',
            action: 'info'
        }
    ];

    const selected = await vscode.window.showQuickPick(options, {
        placeHolder: '🚀 ¿Que quieres hacer?',
        title: 'Quick Snippet Inserter - Menu Principal'
    });

    return selected?.action;
}

export async function showLanguageSelector(): Promise<string | undefined> {
    const languages = getAllLanguages();
    
    const options = languages.map(lang => ({
        label: `$(symbol-file) ${lang.charAt(0).toUpperCase() + lang.slice(1)}`,
        description: `Ver snippets de ${lang}`,
        language: lang
    }));

    // Agregar opcion para ver todos
    options.unshift({
        label: '$(globe) Todos los Lenguajes',
        description: 'Ver snippets de todos los lenguajes',
        language: 'all'
    });

    const selected = await vscode.window.showQuickPick(options, {
        placeHolder: 'Selecciona un lenguaje de programacion',
        title: '🌐 Filtrar por Lenguaje'
    });

    return selected?.language;
}

export async function showCategorySelector(): Promise<string | undefined> {
    const categories = getAllCategories();
    
    const categoryIcons: { [key: string]: string } = {
        'Debug': '$(bug)',
        'Functions': '$(symbol-function)',
        'Classes': '$(symbol-class)',
        'Error Handling': '$(warning)',
        'Loops': '$(sync)',
        'Conditionals': '$(question)',
        'Boilerplate': '$(file-code)',
        'Elements': '$(symbol-tag)',
        'Forms': '$(form)',
        'Layout': '$(layout)',
        'Responsive': '$(device-mobile)'
    };

    const options = categories.map(category => ({
        label: `${categoryIcons[category] || '$(folder)'} ${category}`,
        description: `Ver snippets de la categoria ${category}`,
        category: category
    }));

    // Agregar opcion para ver todas
    options.unshift({
        label: '$(list-tree) Todas las Categorias',
        description: 'Ver snippets de todas las categorias',
        category: 'all'
    });

    const selected = await vscode.window.showQuickPick(options, {
        placeHolder: 'Selecciona una categoria',
        title: '📂 Filtrar por Categoria'
    });

    return selected?.category;
}

export async function showSearchInput(): Promise<string | undefined> {
    const query = await vscode.window.showInputBox({
        prompt: '🔍 Buscar snippets por nombre, descripcion o categoria',
        placeHolder: 'Escribe tu busqueda...',
        validateInput: (value) => {
            if (value && value.trim().length < 2) {
                return 'La busqueda debe tener al menos 2 caracteres';
            }
            return null;
        }
    });

    return query?.trim();
}

export async function showSnippetPreview(snippet: Snippet): Promise<boolean> {
    const previewContent = `
📝 **${snippet.name}**
📄 ${snippet.description}

🏷️ **Categoria:** ${snippet.category}
🌐 **Lenguaje:** ${snippet.language}
⌨️ **Prefijo:** ${snippet.prefix}

💻 **Codigo:**
\`\`\`${snippet.language}
${snippet.content.replace(/\$\{\d+:([^}]*)\}/g, '$1').replace(/\$\d+/g, '').replace(/\$0/g, '')}
\`\`\`
    `.trim();

    const action = await vscode.window.showInformationMessage(
        previewContent,
        { modal: true },
        'Insertar',
        'Cancelar'
    );

    return action === 'Insertar';
}

export async function showProgressWithMessage(
    title: string,
    task: () => Promise<void>
): Promise<void> {
    return vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: title,
        cancellable: false
    }, async (progress) => {
        progress.report({ increment: 0, message: 'Iniciando...' });
        
        // Simular progreso
        for (let i = 0; i <= 100; i += 25) {
            progress.report({ 
                increment: 25, 
                message: i === 100 ? 'Completado!' : `Procesando... ${i}%`
            });
            
            if (i < 100) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }

        await task();
    });
}

export class SnippetListProvider implements vscode.TreeDataProvider<Snippet> {
    private _onDidChangeTreeData: vscode.EventEmitter<Snippet | undefined | null | void> = new vscode.EventEmitter<Snippet | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<Snippet | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private snippets: Snippet[]) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Snippet): vscode.TreeItem {
        const item = new vscode.TreeItem(element.name, vscode.TreeItemCollapsibleState.None);
        item.description = element.description;
        item.tooltip = `${element.category} - ${element.language}`;
        item.command = {
            command: 'quickSnippet.insertSpecific',
            title: 'Insertar Snippet',
            arguments: [element]
        };
        
        // Icono basado en el lenguaje
        const iconMap: { [key: string]: string } = {
            'javascript': 'symbol-function',
            'html': 'symbol-tag',
            'css': 'symbol-color',
            'python': 'symbol-snake'
        };
        
        item.iconPath = new vscode.ThemeIcon(iconMap[element.language] || 'symbol-file');
        
        return item;
    }

    getChildren(element?: Snippet): Thenable<Snippet[]> {
        if (!element) {
            return Promise.resolve(this.snippets);
        }
        return Promise.resolve([]);
    }
}

export async function createSnippetWizard(): Promise<Snippet | undefined> {
    // Paso 1: Nombre
    const name = await vscode.window.showInputBox({
        prompt: '📝 Paso 1/6: Nombre del snippet',
        placeHolder: 'ej: mi-snippet-personalizado',
        validateInput: (value) => {
            if (!value || value.trim().length === 0) {
                return 'El nombre no puede estar vacio';
            }
            if (!/^[a-zA-Z0-9-_]+$/.test(value)) {
                return 'Solo se permiten letras, numeros, guiones y guiones bajos';
            }
            return null;
        }
    });

    if (!name) return undefined;

    // Paso 2: Descripcion
    const description = await vscode.window.showInputBox({
        prompt: '📄 Paso 2/6: Descripcion del snippet',
        placeHolder: 'ej: Mi snippet personalizado para...',
        value: `Snippet personalizado: ${name}`
    });

    if (!description) return undefined;

    // Paso 3: Lenguaje
    const languages = ['javascript', 'html', 'css', 'python', 'java', 'cpp', 'php', 'ruby', 'go', 'rust', 'otros'];
    const language = await vscode.window.showQuickPick(languages, {
        placeHolder: '🌐 Paso 3/6: Selecciona el lenguaje'
    });

    if (!language) return undefined;

    // Paso 4: Categoria
    const categories = getAllCategories();
    categories.push('Custom'); // Categoria por defecto para snippets personalizados
    
    const category = await vscode.window.showQuickPick(categories, {
        placeHolder: '📂 Paso 4/6: Selecciona una categoria'
    });

    if (!category) return undefined;

    // Paso 5: Prefijo
    const prefix = await vscode.window.showInputBox({
        prompt: '⌨️ Paso 5/6: Prefijo para autocompletar (opcional)',
        placeHolder: 'ej: msc',
        value: name.substring(0, 3)
    });

    // Paso 6: Contenido
    const content = await vscode.window.showInputBox({
        prompt: '💻 Paso 6/6: Contenido del snippet',
        placeHolder: 'ej: console.log(${1:mensaje});$0',
        validateInput: (value) => {
            if (!value || value.trim().length === 0) {
                return 'El contenido no puede estar vacio';
            }
            return null;
        }
    });

    if (!content) return undefined;

    // Crear el snippet
    const newSnippet: Snippet = {
        id: `custom-${Date.now()}`,
        name: name,
        description: description,
        content: content,
        language: language,
        category: category,
        prefix: prefix || name.substring(0, 3)
    };

    return newSnippet;
}
```

## src/extension.ts - Integracion de UI Avanzada

```typescript
import * as vscode from 'vscode';
import { 
    predefinedSnippets, 
    getSnippetsByLanguage, 
    getSnippetsByCategory,
    searchSnippets,
    detectLanguageFromFileName 
} from './snippets';
import { 
    showMainMenu,
    showLanguageSelector,
    showCategorySelector,
    showSearchInput,
    showProgressWithMessage,
    createSnippetWizard,
    SnippetQuickPick
} from './userInterface';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating Quick Snippet Inserter extension...');

    // Menu principal centralizado
    let mainMenuCommand = vscode.commands.registerCommand('quickSnippet.mainMenu', async () => {
        const action = await showMainMenu();
        
        if (action) {
            switch (action) {
                case 'insert':
                    vscode.commands.executeCommand('quickSnippet.insertSnippet');
                    break;
                case 'byLanguage':
                    vscode.commands.executeCommand('quickSnippet.insertByLanguage');
                    break;
                case 'byCategory':
                    vscode.commands.executeCommand('quickSnippet.insertByCategory');
                    break;
                case 'search':
                    vscode.commands.executeCommand('quickSnippet.searchSnippets');
                    break;
                case 'create':
                    vscode.commands.executeCommand('quickSnippet.createSnippet');
                    break;
                case 'viewAll':
                    vscode.commands.executeCommand('quickSnippet.viewAllSnippets');
                    break;
                case 'info':
                    vscode.commands.executeCommand('quickSnippet.showInfo');
                    break;
            }
        }
    });

    // Insertar snippet con interfaz mejorada
    let insertSnippetCommand = vscode.commands.registerCommand('quickSnippet.insertSnippet', async () => {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            vscode.window.showWarningMessage('Por favor, abre un archivo para insertar snippets');
            return;
        }

        const quickPick = new SnippetQuickPick();
        const selectedSnippet = await quickPick.showSnippetPicker(predefinedSnippets);

        if (selectedSnippet) {
            await showProgressWithMessage('Insertando snippet...', async () => {
                const snippetString = new vscode.SnippetString(selectedSnippet.content);
                await editor.insertSnippet(snippetString);
            });
            
            vscode.window.showInformationMessage(
                `✅ Snippet "${selectedSnippet.name}" insertado!`,
                'Ver mas snippets'
            ).then(selection => {
                if (selection) {
                    vscode.commands.executeCommand('quickSnippet.mainMenu');
                }
            });
        }
    });

    // Insertar por lenguaje con selector
    let insertByLanguageCommand = vscode.commands.registerCommand('quickSnippet.insertByLanguage', async () => {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            vscode.window.showWarningMessage('Por favor, abre un archivo para insertar snippets');
            return;
        }

        const selectedLanguage = await showLanguageSelector();
        
        if (selectedLanguage) {
            let snippetsToShow = selectedLanguage === 'all' 
                ? predefinedSnippets 
                : getSnippetsByLanguage(selectedLanguage);

            if (snippetsToShow.length === 0) {
                vscode.window.showInformationMessage(`No hay snippets disponibles para ${selectedLanguage}`);
                return;
            }

            const quickPick = new SnippetQuickPick();
            const selectedSnippet = await quickPick.showSnippetPicker(snippetsToShow);

            if (selectedSnippet) {
                const snippetString = new vscode.SnippetString(selectedSnippet.content);
                await editor.insertSnippet(snippetString);
                
                vscode.window.showInformationMessage(`✅ Snippet "${selectedSnippet.name}" insertado!`);
            }
        }
    });

    // Insertar por categoria
    let insertByCategoryCommand = vscode.commands.registerCommand('quickSnippet.insertByCategory', async () => {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            vscode.window.showWarningMessage('Por favor, abre un archivo para insertar snippets');
            return;
        }

        const selectedCategory = await showCategorySelector();
        
        if (selectedCategory) {
            let snippetsToShow = selectedCategory === 'all' 
                ? predefinedSnippets 
                : getSnippetsByCategory(selectedCategory);

            if (snippetsToShow.length === 0) {
                vscode.window.showInformationMessage(`No hay snippets en la categoria ${selectedCategory}`);
                return;
            }

            const quickPick = new SnippetQuickPick();
            const selectedSnippet = await quickPick.showSnippetPicker(snippetsToShow);

            if (selectedSnippet) {
                const snippetString = new vscode.SnippetString(selectedSnippet.content);
                await editor.insertSnippet(snippetString);
                
                vscode.window.showInformationMessage(`✅ Snippet "${selectedSnippet.name}" insertado!`);
            }
        }
    });

    // Buscar snippets
    let searchSnippetsCommand = vscode.commands.registerCommand('quickSnippet.searchSnippets', async () => {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            vscode.window.showWarningMessage('Por favor, abre un archivo para insertar snippets');
            return;
        }

        const query = await showSearchInput();
        
        if (query) {
            const searchResults = searchSnippets(query);

            if (searchResults.length === 0) {
                vscode.window.showInformationMessage(`No se encontraron snippets para "${query}"`);
                return;
            }

            const quickPick = new SnippetQuickPick();
            const selectedSnippet = await quickPick.showSnippetPicker(searchResults);

            if (selectedSnippet) {
                const snippetString = new vscode.SnippetString(selectedSnippet.content);
                await editor.insertSnippet(snippetString);
                
                vscode.window.showInformationMessage(`✅ Snippet "${selectedSnippet.name}" insertado!`);
            }
        }
    });

    // Crear snippet personalizado
    let createSnippetCommand = vscode.commands.registerCommand('quickSnippet.createSnippet', async () => {
        const newSnippet = await createSnippetWizard();
        
        if (newSnippet) {
            // TODO: Guardar snippet personalizado (implementar en paso 5)
            vscode.window.showInformationMessage(
                `✅ Snippet "${newSnippet.name}" creado exitosamente!`,
                'Usar ahora'
            ).then(async selection => {
                if (selection && vscode.window.activeTextEditor) {
                    const snippetString = new vscode.SnippetString(newSnippet.content);
                    await vscode.window.activeTextEditor.insertSnippet(snippetString);
                }
            });
        }
    });

    // Mostrar informacion
    let showInfoCommand = vscode.commands.registerCommand('quickSnippet.showInfo', () => {
        const totalSnippets = predefinedSnippets.length;
        const languages = new Set(predefinedSnippets.map(s => s.language)).size;
        const categories = new Set(predefinedSnippets.map(s => s.category)).size;

        const message = `
🚀 **Quick Snippet Inserter v0.0.1**

📊 **Estadisticas:**
• ${totalSnippets} snippets predefinidos
• ${languages} lenguajes soportados  
• ${categories} categorias disponibles

⌨️ **Atajos principales:**
• Ctrl+Shift+M: Menu principal
• Ctrl+Shift+S: Insertar snippet
• Ctrl+Shift+L: Por lenguaje
• Ctrl+Shift+C: Por categoria

🔧 **Estado:** Activo y funcionando
        `.trim();
        
        vscode.window.showInformationMessage(message, { modal: false });
    });

    context.subscriptions.push(
        mainMenuCommand,
        insertSnippetCommand,
        insertByLanguageCommand,
        insertByCategoryCommand,
        searchSnippetsCommand,
        createSnippetCommand,
        showInfoCommand
    );
    
    console.log('Quick Snippet Inserter extension activated successfully!');
}

export function deactivate() {
    console.log('Quick Snippet Inserter extension deactivated');
}
```

## package.json - Comandos y Atajos Completos

```json
{
  "contributes": {
    "commands": [
      {
        "command": "quickSnippet.mainMenu",
        "title": "Menu Principal",
        "category": "Quick Snippet",
        "icon": "$(home)"
      },
      {
        "command": "quickSnippet.insertSnippet",
        "title": "Insertar Snippet Rapido",
        "category": "Quick Snippet",
        "icon": "$(add)"
      },
      {
        "command": "quickSnippet.insertByLanguage",
        "title": "Snippets por Lenguaje",
        "category": "Quick Snippet",
        "icon": "$(filter)"
      },
      {
        "command": "quickSnippet.insertByCategory",
        "title": "Snippets por Categoria",
        "category": "Quick Snippet",
        "icon": "$(tag)"
      },
      {
        "command": "quickSnippet.searchSnippets",
        "title": "Buscar Snippets",
        "category": "Quick Snippet",
        "icon": "$(search)"
      },
      {
        "command": "quickSnippet.createSnippet",
        "title": "Crear Snippet Personalizado",
        "category": "Quick Snippet",
        "icon": "$(new-file)"
      },
      {
        "command": "quickSnippet.showInfo",
        "title": "Informacion de la Extension",
        "category": "Quick Snippet",
        "icon": "$(info)"
      }
    ],
    "keybindings": [
      {
        "command": "quickSnippet.mainMenu",
        "key": "ctrl+shift+m",
        "mac": "cmd+shift+m"
      },
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
        "command": "quickSnippet.insertByCategory",
        "key": "ctrl+shift+c",
        "mac": "cmd+shift+c",
        "when": "editorTextFocus"
      },
      {
        "command": "quickSnippet.searchSnippets",
        "key": "ctrl+shift+f",
        "mac": "cmd+shift+f",
        "when": "editorTextFocus"
      },
      {
        "command": "quickSnippet.createSnippet",
        "key": "ctrl+shift+n",
        "mac": "cmd+shift+n"
      }
    ],
    "menus": {
      "editor/context": [
        {
          "submenu": "quickSnippet.submenu",
          "when": "editorTextFocus",
          "group": "1_modification@1"
        }
      ],
      "quickSnippet.submenu": [
        {
          "command": "quickSnippet.insertSnippet",
          "group": "1_main@1"
        },
        {
          "command": "quickSnippet.insertByLanguage",
          "group": "1_main@2"
        },
        {
          "command": "quickSnippet.createSnippet",
          "group": "2_custom@1"
        }
      ]
    },
    "submenus": [
      {
        "id": "quickSnippet.submenu",
        "label": "Quick Snippets",
        "icon": "$(symbol-snippet)"
      }
    ]
  }
}
```

## Probar la Interfaz de Usuario

### Funcionalidades a Verificar:

1. **Menu Principal** (`Ctrl+Shift+M`):
   - ✅ Muestra todas las opciones disponibles
   - ✅ Navegacion intuitiva con iconos
   - ✅ Ejecuta comandos correctamente

2. **Seleccion de Snippets Mejorada**:
   - ✅ Iconos por lenguaje
   - ✅ Informacion detallada en cada item
   - ✅ Busqueda en tiempo real

3. **Filtros**:
   - ✅ Por lenguaje funciona correctamente
   - ✅ Por categoria muestra snippets relevantes
   - ✅ Busqueda encuentra resultados

4. **Asistente de Creacion**:
   - ✅ Guia paso a paso funciona
   - ✅ Validacion de campos
   - ✅ Vista previa del snippet

5. **Progress Bars y Notificaciones**:
   - ✅ Indicadores visuales durante operaciones
   - ✅ Mensajes informativos
   - ✅ Botones de accion en notificaciones
