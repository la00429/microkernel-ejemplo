import * as vscode from 'vscode';

// Interfaz para definir un snippet
interface Snippet {
    name: string;
    description: string;
    content: string;
    language?: string;
}

// Snippets de ejemplo básicos
const defaultSnippets: Snippet[] = [
    {
        name: 'console.log',
        description: 'Log de consola básico',
        content: 'console.log("$1");',
        language: 'javascript'
    },
    {
        name: 'function',
        description: 'Función básica de JavaScript',
        content: 'function ${1:nombreFuncion}(${2:parametros}) {\n\t${3:// código aquí}\n\treturn ${4:valor};\n}',
        language: 'javascript'
    },
    {
        name: 'class',
        description: 'Clase básica de JavaScript',
        content: 'class ${1:NombreClase} {\n\tconstructor(${2:parametros}) {\n\t\t${3:// inicialización}\n\t}\n\n\t${4:// métodos}\n}',
        language: 'javascript'
    }
];

export function activate(context: vscode.ExtensionContext) {
    console.log('🚀 Quick Snippet Inserter está activo!');

    // Comando principal: Insertar Snippet
    let insertSnippetCommand = vscode.commands.registerCommand('quickSnippet.insertSnippet', async () => {
        try {
            // Obtener el editor activo
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('No hay ningún editor abierto');
                return;
            }

            // Mostrar lista de snippets disponibles
            const snippetItems = defaultSnippets.map(snippet => ({
                label: snippet.name,
                description: snippet.description,
                snippet: snippet
            }));

            const selectedItem = await vscode.window.showQuickPick(snippetItems, {
                placeHolder: 'Selecciona un snippet para insertar'
            });

            if (selectedItem) {
                await insertSnippetAtCursor(editor, selectedItem.snippet);
                vscode.window.showInformationMessage(`✅ Snippet "${selectedItem.label}" insertado`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error al insertar snippet: ${error}`);
        }
    });

    // Comando: Listar todos los snippets
    let listSnippetsCommand = vscode.commands.registerCommand('quickSnippet.listSnippets', () => {
        const panel = vscode.window.createWebviewPanel(
            'snippetList',
            'Lista de Snippets',
            vscode.ViewColumn.One,
            {}
        );

        panel.webview.html = generateSnippetListHTML();
    });

    // Comando: Insertar snippet específico (console.log)
    let insertConsoleLogCommand = vscode.commands.registerCommand('quickSnippet.insertConsoleLog', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No hay ningún editor abierto');
            return;
        }

        const consoleLogSnippet = defaultSnippets.find(s => s.name === 'console.log');
        if (consoleLogSnippet) {
            await insertSnippetAtCursor(editor, consoleLogSnippet);
            vscode.window.showInformationMessage('✅ console.log insertado');
        }
    });

    // Comando: Abrir configuración
    let openSettingsCommand = vscode.commands.registerCommand('quickSnippet.openSettings', () => {
        vscode.commands.executeCommand('workbench.action.openSettings', 'quickSnippet');
    });

    // Registrar todos los comandos
    context.subscriptions.push(
        insertSnippetCommand,
        listSnippetsCommand,
        insertConsoleLogCommand,
        openSettingsCommand
    );

    // Mostrar mensaje de bienvenida
    vscode.window.showInformationMessage('🎉 Quick Snippet Inserter está listo! Usa Ctrl+Shift+S para insertar snippets');
}

// Función para insertar snippet en la posición del cursor
async function insertSnippetAtCursor(editor: vscode.TextEditor, snippet: Snippet) {
    const position = editor.selection.active;
    const snippetString = new vscode.SnippetString(snippet.content);
    
    await editor.insertSnippet(snippetString, position);
}

// Generar HTML para la lista de snippets
function generateSnippetListHTML(): string {
    const snippetsList = defaultSnippets.map(snippet => 
        `<div class="snippet-item">
            <h3>${snippet.name}</h3>
            <p><strong>Descripción:</strong> ${snippet.description}</p>
            <p><strong>Lenguaje:</strong> ${snippet.language || 'Cualquiera'}</p>
            <pre><code>${snippet.content}</code></pre>
        </div>`
    ).join('');

    return `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lista de Snippets</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .snippet-item { border: 1px solid #ccc; margin: 10px 0; padding: 15px; border-radius: 5px; }
            h3 { margin-top: 0; color: #007acc; }
            pre { background-color: #f5f5f5; padding: 10px; border-radius: 3px; overflow-x: auto; }
            code { font-family: 'Courier New', monospace; }
        </style>
    </head>
    <body>
        <h1>📝 Snippets Disponibles</h1>
        <p>Total de snippets: ${defaultSnippets.length}</p>
        ${snippetsList}
    </body>
    </html>`;
}

export function deactivate() {
    console.log('👋 Quick Snippet Inserter desactivado');
} 