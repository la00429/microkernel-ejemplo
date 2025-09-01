import * as vscode from 'vscode';
import { 
    Snippet, 
    allSnippets, 
    getSnippetsByLanguage, 
    getSnippetsByCategory, 
    getAllCategories, 
    getAllLanguages, 
    searchSnippets 
} from './snippets';
import { TemplateManager } from './templateManager';

export function activate(context: vscode.ExtensionContext) {
    console.log('🚀 Quick Snippet Inserter está activo!');

    // Inicializar el gestor de plantillas
    const templateManager = new TemplateManager(context);

    // Función para obtener todos los snippets (predefinidos + usuario)
    function getAllSnippets(): Snippet[] {
        const userSnippets = templateManager.getUserSnippets();
        return [...allSnippets, ...userSnippets];
    }

    // Función para obtener snippets por lenguaje (predefinidos + usuario)
    function getSnippetsByLanguageExtended(language: string): Snippet[] {
        const allSnippetsExtended = getAllSnippets();
        return allSnippetsExtended.filter(snippet => 
            snippet.language === language || snippet.language === undefined
        );
    }

    // Función para buscar en todos los snippets (predefinidos + usuario)
    function searchSnippetsExtended(query: string): Snippet[] {
        const allSnippetsExtended = getAllSnippets();
        const lowerQuery = query.toLowerCase();
        return allSnippetsExtended.filter(snippet => 
            snippet.name.toLowerCase().includes(lowerQuery) ||
            snippet.description.toLowerCase().includes(lowerQuery) ||
            snippet.category.toLowerCase().includes(lowerQuery) ||
            (snippet.prefix && snippet.prefix.toLowerCase().includes(lowerQuery))
        );
    }

    // Comando principal: Insertar Snippet
    let insertSnippetCommand = vscode.commands.registerCommand('quickSnippet.insertSnippet', async () => {
        try {
            // Obtener el editor activo
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('No hay ningún editor abierto');
                return;
            }

            // Detectar el lenguaje del archivo actual
            const currentLanguage = editor.document.languageId;
            
            // Obtener snippets relevantes para el lenguaje actual (incluye usuario)
            let relevantSnippets = getSnippetsByLanguageExtended(currentLanguage);
            
            // Si no hay snippets específicos, mostrar todos
            if (relevantSnippets.length === 0) {
                relevantSnippets = getAllSnippets();
            }

            // Crear items para Quick Pick con categorías
            const snippetItems = relevantSnippets.map(snippet => ({
                label: `$(symbol-snippet) ${snippet.name}`,
                description: `${snippet.category} - ${snippet.description}`,
                detail: snippet.prefix ? `Prefijo: ${snippet.prefix} | Lenguaje: ${snippet.language || 'Cualquiera'}` : `Lenguaje: ${snippet.language || 'Cualquiera'}`,
                snippet: snippet
            }));

            const selectedItem = await vscode.window.showQuickPick(snippetItems, {
                placeHolder: `Selecciona un snippet para insertar (${relevantSnippets.length} disponibles)`,
                matchOnDescription: true,
                matchOnDetail: true
            });

            if (selectedItem) {
                await insertSnippetAtCursor(editor, selectedItem.snippet);
                vscode.window.showInformationMessage(`✅ Snippet "${selectedItem.snippet.name}" insertado`);
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

        panel.webview.html = generateSnippetListHTML(getAllSnippets());
    });

    // Comando: Insertar snippet específico (console.log)
    let insertConsoleLogCommand = vscode.commands.registerCommand('quickSnippet.insertConsoleLog', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No hay ningún editor abierto');
            return;
        }

        const consoleLogSnippet = getAllSnippets().find(s => s.name === 'console.log');
        if (consoleLogSnippet) {
            await insertSnippetAtCursor(editor, consoleLogSnippet);
            vscode.window.showInformationMessage('✅ console.log insertado');
        }
    });

    // Comando: Buscar snippets
    let searchSnippetsCommand = vscode.commands.registerCommand('quickSnippet.searchSnippets', async () => {
        try {
            const searchQuery = await vscode.window.showInputBox({
                placeHolder: 'Buscar snippets por nombre, descripción o categoría...',
                prompt: 'Ingresa términos de búsqueda'
            });

            if (!searchQuery) {
                return;
            }

            const foundSnippets = searchSnippetsExtended(searchQuery);
            
            if (foundSnippets.length === 0) {
                vscode.window.showInformationMessage(`No se encontraron snippets para "${searchQuery}"`);
                return;
            }

            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('No hay ningún editor abierto');
                return;
            }

            const snippetItems = foundSnippets.map(snippet => ({
                label: `$(search) ${snippet.name}`,
                description: `${snippet.category} - ${snippet.description}`,
                detail: `Lenguaje: ${snippet.language || 'Cualquiera'}`,
                snippet: snippet
            }));

            const selectedItem = await vscode.window.showQuickPick(snippetItems, {
                placeHolder: `${foundSnippets.length} resultados para "${searchQuery}"`,
                matchOnDescription: true
            });

            if (selectedItem) {
                await insertSnippetAtCursor(editor, selectedItem.snippet);
                vscode.window.showInformationMessage(`✅ Snippet "${selectedItem.snippet.name}" insertado`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error en la búsqueda: ${error}`);
        }
    });

    // Comando: Insertar por categoría
    let insertByCategoryCommand = vscode.commands.registerCommand('quickSnippet.insertByCategory', async () => {
        try {
            const categories = getAllCategories();
            
            const categoryItems = categories.map(category => ({
                label: `$(folder) ${category}`,
                description: `${getSnippetsByCategory(category).length} snippets`,
                category: category
            }));

            const selectedCategory = await vscode.window.showQuickPick(categoryItems, {
                placeHolder: 'Selecciona una categoría'
            });

            if (!selectedCategory) {
                return;
            }

            const categorySnippets = getSnippetsByCategory(selectedCategory.category);
            const editor = vscode.window.activeTextEditor;
            
            if (!editor) {
                vscode.window.showWarningMessage('No hay ningún editor abierto');
                return;
            }

            const snippetItems = categorySnippets.map(snippet => ({
                label: `$(symbol-snippet) ${snippet.name}`,
                description: snippet.description,
                detail: `Lenguaje: ${snippet.language || 'Cualquiera'}`,
                snippet: snippet
            }));

            const selectedItem = await vscode.window.showQuickPick(snippetItems, {
                placeHolder: `Snippets en categoría "${selectedCategory.category}"`
            });

            if (selectedItem) {
                await insertSnippetAtCursor(editor, selectedItem.snippet);
                vscode.window.showInformationMessage(`✅ Snippet "${selectedItem.snippet.name}" insertado`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error al insertar por categoría: ${error}`);
        }
    });

    // ========== COMANDOS DE GESTIÓN DE PLANTILLAS ==========

    // Comando: Crear plantilla personalizada
    let createTemplateCommand = vscode.commands.registerCommand('quickSnippet.createTemplate', async () => {
        await templateManager.createTemplate();
    });

    // Comando: Editar plantilla personalizada
    let editTemplateCommand = vscode.commands.registerCommand('quickSnippet.editTemplate', async () => {
        await templateManager.editTemplate();
    });

    // Comando: Eliminar plantilla personalizada
    let deleteTemplateCommand = vscode.commands.registerCommand('quickSnippet.deleteTemplate', async () => {
        await templateManager.deleteTemplate();
    });

    // Comando: Importar plantillas desde archivo
    let importTemplatesCommand = vscode.commands.registerCommand('quickSnippet.importTemplates', async () => {
        await templateManager.importTemplates();
    });

    // Comando: Exportar plantillas a archivo
    let exportTemplatesCommand = vscode.commands.registerCommand('quickSnippet.exportTemplates', async () => {
        await templateManager.exportTemplates();
    });

    // Comando: Abrir archivo de plantillas
    let openTemplatesFileCommand = vscode.commands.registerCommand('quickSnippet.openTemplatesFile', async () => {
        await templateManager.openTemplatesFile();
    });

    // Comando: Recargar plantillas
    let reloadTemplatesCommand = vscode.commands.registerCommand('quickSnippet.reloadTemplates', () => {
        templateManager.reloadTemplates();
    });

    // Comando: Ver estadísticas de plantillas
    let templateStatsCommand = vscode.commands.registerCommand('quickSnippet.templateStats', () => {
        const stats = templateManager.getStats();
        const userSnippets = templateManager.getUserTemplates();
        
        const panel = vscode.window.createWebviewPanel(
            'templateStats',
            'Estadísticas de Snippets',
            vscode.ViewColumn.One,
            {}
        );

        panel.webview.html = generateStatsHTML(stats, userSnippets);
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
        searchSnippetsCommand,
        insertByCategoryCommand,
        createTemplateCommand,
        editTemplateCommand,
        deleteTemplateCommand,
        importTemplatesCommand,
        exportTemplatesCommand,
        openTemplatesFileCommand,
        reloadTemplatesCommand,
        templateStatsCommand,
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
function generateSnippetListHTML(allSnippetsExtended: Snippet[]): string {
    // Agrupar snippets por categoría
    const categories = [...new Set(allSnippetsExtended.map((s: Snippet) => s.category))].sort();
    const languages = [...new Set(allSnippetsExtended.map((s: Snippet) => s.language).filter((lang): lang is string => lang !== undefined))].sort();
    
    const categorySections = categories.map((category: string) => {
        const categorySnippets = allSnippetsExtended.filter((snippet: Snippet) => snippet.category === category);
        const snippetsList = categorySnippets.map((snippet: Snippet) => 
            `<div class="snippet-item" data-language="${snippet.language || 'all'}">
                <h4>${snippet.name} ${snippet.prefix ? `<span class="prefix">[${snippet.prefix}]</span>` : ''}</h4>
                <p class="description">${snippet.description}</p>
                <div class="meta">
                    <span class="language">🔤 ${snippet.language || 'Cualquiera'}</span>
                    <span class="category">📁 ${snippet.category}</span>
                </div>
                <pre><code>${snippet.content.replace(/\$\{?\d+:?([^}]*)\}?/g, '$1').replace(/\$0/g, '')}</code></pre>
            </div>`
        ).join('');

        return `
        <div class="category-section">
            <h3 class="category-title">📂 ${category} (${categorySnippets.length})</h3>
            ${snippetsList}
        </div>`;
    }).join('');

    const languageButtons = languages.map((lang: string) => 
        `<button class="filter-btn" data-language="${lang}">${lang}</button>`
    ).join('');

    return `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lista de Snippets</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                padding: 20px; 
                line-height: 1.6;
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
            }
            
            .header {
                margin-bottom: 30px;
                border-bottom: 1px solid var(--vscode-panel-border);
                padding-bottom: 20px;
            }
            
            .stats {
                display: flex;
                gap: 20px;
                margin: 15px 0;
                flex-wrap: wrap;
            }
            
            .stat-item {
                background: var(--vscode-badge-background);
                color: var(--vscode-badge-foreground);
                padding: 5px 10px;
                border-radius: 12px;
                font-size: 0.9em;
            }
            
            .filters {
                margin: 20px 0;
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            
            .filter-btn {
                background: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
                border: 1px solid var(--vscode-button-border);
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.85em;
                transition: all 0.2s;
            }
            
            .filter-btn:hover {
                background: var(--vscode-button-secondaryHoverBackground);
            }
            
            .filter-btn.active {
                background: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
            }
            
            .category-section {
                margin: 30px 0;
            }
            
            .category-title {
                color: var(--vscode-textLink-foreground);
                border-bottom: 2px solid var(--vscode-textLink-foreground);
                padding-bottom: 8px;
                margin-bottom: 20px;
            }
            
            .snippet-item { 
                border: 1px solid var(--vscode-panel-border);
                margin: 15px 0; 
                padding: 20px; 
                border-radius: 8px;
                background: var(--vscode-editor-background);
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: all 0.2s;
            }
            
            .snippet-item:hover {
                border-color: var(--vscode-focusBorder);
                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            }
            
            .snippet-item h4 { 
                margin: 0 0 8px 0; 
                color: var(--vscode-symbolIcon-functionForeground);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .prefix {
                background: var(--vscode-terminal-ansiGreen);
                color: var(--vscode-terminal-background);
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 0.75em;
                font-weight: bold;
            }
            
            .description {
                color: var(--vscode-descriptionForeground);
                margin: 8px 0;
                font-style: italic;
            }
            
            .meta {
                display: flex;
                gap: 15px;
                margin: 10px 0;
                font-size: 0.85em;
            }
            
            .language, .category {
                color: var(--vscode-textPreformat-foreground);
            }
            
            pre { 
                background-color: var(--vscode-textCodeBlock-background);
                border: 1px solid var(--vscode-panel-border);
                padding: 15px; 
                border-radius: 6px; 
                overflow-x: auto;
                margin: 15px 0 0 0;
            }
            
            code { 
                font-family: var(--vscode-editor-font-family, 'Courier New', monospace);
                font-size: var(--vscode-editor-font-size, 14px);
                color: var(--vscode-editor-foreground);
            }
            
            .hidden {
                display: none;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>📝 Snippets Disponibles</h1>
            
            <div class="stats">
                <span class="stat-item">📊 Total: ${allSnippetsExtended.length} snippets</span>
                <span class="stat-item">🏷️ ${categories.length} categorías</span>
                <span class="stat-item">🔤 ${languages.length} lenguajes</span>
            </div>
            
            <div class="filters">
                <button class="filter-btn active" data-language="all">🌐 Todos</button>
                ${languageButtons}
            </div>
        </div>
        
        ${categorySections}
        
        <script>
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    // Actualizar botones activos
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    const selectedLang = this.dataset.language;
                    
                    // Filtrar snippets
                    document.querySelectorAll('.snippet-item').forEach(item => {
                        if (selectedLang === 'all' || item.dataset.language === selectedLang || item.dataset.language === 'all') {
                            item.classList.remove('hidden');
                        } else {
                            item.classList.add('hidden');
                        }
                    });
                    
                    // Ocultar/mostrar secciones vacías
                    document.querySelectorAll('.category-section').forEach(section => {
                        const visibleItems = section.querySelectorAll('.snippet-item:not(.hidden)');
                        if (visibleItems.length === 0) {
                            section.classList.add('hidden');
                        } else {
                            section.classList.remove('hidden');
                        }
                    });
                });
            });
        </script>
    </body>
    </html>`;
}

// Generar HTML para las estadísticas de snippets
function generateStatsHTML(stats: any, userTemplates: any[]): string {
    const builtInCount = allSnippets.length;
    const userCount = stats.total;
    const totalCount = builtInCount + userCount;

    const languageStats = Object.entries(stats.byLanguage)
        .map(([lang, count]) => `<tr><td>${lang}</td><td>${count}</td></tr>`)
        .join('');

    const categoryStats = Object.entries(stats.byCategory)
        .map(([cat, count]) => `<tr><td>${cat}</td><td>${count}</td></tr>`)
        .join('');

    const recentTemplates = userTemplates
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5)
        .map(template => `
            <div class="template-item">
                <h4>${template.name}</h4>
                <p>${template.description}</p>
                <small>Actualizado: ${new Date(template.updatedAt).toLocaleDateString()}</small>
            </div>
        `).join('');

    return `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Estadísticas de Snippets</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                padding: 20px; 
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
            }
            .dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
            .card { 
                background: var(--vscode-editor-background);
                border: 1px solid var(--vscode-panel-border);
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .card h3 { 
                margin-top: 0; 
                color: var(--vscode-textLink-foreground);
                border-bottom: 2px solid var(--vscode-textLink-foreground);
                padding-bottom: 8px;
            }
            .stat-number { 
                font-size: 2em; 
                font-weight: bold; 
                color: var(--vscode-symbolIcon-functionForeground);
                margin: 10px 0;
            }
            table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 10px;
            }
            th, td { 
                padding: 8px; 
                text-align: left; 
                border-bottom: 1px solid var(--vscode-panel-border);
            }
            th { 
                background: var(--vscode-badge-background);
                color: var(--vscode-badge-foreground);
            }
            .template-item {
                border: 1px solid var(--vscode-panel-border);
                padding: 12px;
                margin: 8px 0;
                border-radius: 4px;
                background: var(--vscode-textCodeBlock-background);
            }
            .template-item h4 { margin: 0 0 5px 0; }
            .template-item p { margin: 5px 0; color: var(--vscode-descriptionForeground); }
            .template-item small { color: var(--vscode-textPreformat-foreground); }
        </style>
    </head>
    <body>
        <h1>📊 Estadísticas de Snippets</h1>
        
        <div class="dashboard">
            <div class="card">
                <h3>📈 Resumen General</h3>
                <div class="stat-number">${totalCount}</div>
                <p>Snippets totales</p>
                <hr>
                <p>🏠 Predefinidos: <strong>${builtInCount}</strong></p>
                <p>👤 Personalizados: <strong>${userCount}</strong></p>
            </div>
            
            <div class="card">
                <h3>🔤 Por Lenguaje</h3>
                <table>
                    <thead>
                        <tr><th>Lenguaje</th><th>Cantidad</th></tr>
                    </thead>
                    <tbody>
                        ${languageStats || '<tr><td colspan="2">No hay snippets personalizados</td></tr>'}
                    </tbody>
                </table>
            </div>
            
            <div class="card">
                <h3>📁 Por Categoría</h3>
                <table>
                    <thead>
                        <tr><th>Categoría</th><th>Cantidad</th></tr>
                    </thead>
                    <tbody>
                        ${categoryStats || '<tr><td colspan="2">No hay snippets personalizados</td></tr>'}
                    </tbody>
                </table>
            </div>
            
            <div class="card">
                <h3>🕒 Recientemente Modificados</h3>
                ${recentTemplates || '<p>No hay snippets personalizados</p>'}
            </div>
        </div>
    </body>
    </html>`;
}

export function deactivate() {
    console.log('👋 Quick Snippet Inserter desactivado');
} 