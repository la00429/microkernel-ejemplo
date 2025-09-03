# Paso 5: Plantillas Personalizadas - Fragmentos de Codigo

## src/templateManager.ts - Gestor Completo de Plantillas

```typescript
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Snippet } from './snippets';

export interface TemplateFile {
    version: string;
    templates: Snippet[];
    metadata: {
        name: string;
        description: string;
        author: string;
        createdAt: string;
        updatedAt: string;
    };
}

export class TemplateManager {
    private userTemplatesPath: string;
    private userTemplates: Snippet[] = [];

    constructor(private context: vscode.ExtensionContext) {
        this.userTemplatesPath = path.join(
            context.globalStorageUri.fsPath, 
            'user-templates.json'
        );
        this.ensureStorageDirectory();
    }

    private ensureStorageDirectory() {
        const dir = path.dirname(this.userTemplatesPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    async loadUserTemplates(): Promise<Snippet[]> {
        try {
            if (fs.existsSync(this.userTemplatesPath)) {
                const data = fs.readFileSync(this.userTemplatesPath, 'utf8');
                const parsed: TemplateFile = JSON.parse(data);
                
                // Validar estructura del archivo
                if (parsed.templates && Array.isArray(parsed.templates)) {
                    this.userTemplates = parsed.templates;
                    console.log(`Loaded ${this.userTemplates.length} user templates`);
                    return this.userTemplates;
                }
            }
        } catch (error) {
            console.error('Error loading user templates:', error);
            vscode.window.showErrorMessage('Error al cargar plantillas personalizadas');
        }
        
        this.userTemplates = [];
        return [];
    }

    async saveUserTemplates(templates: Snippet[]): Promise<void> {
        try {
            const templateFile: TemplateFile = {
                version: "1.0.0",
                templates: templates,
                metadata: {
                    name: "Plantillas Personalizadas",
                    description: "Snippets personalizados del usuario",
                    author: "Usuario",
                    createdAt: this.userTemplates.length === 0 ? new Date().toISOString() : this.getCreationDate(),
                    updatedAt: new Date().toISOString()
                }
            };
            
            this.ensureStorageDirectory();
            fs.writeFileSync(this.userTemplatesPath, JSON.stringify(templateFile, null, 2));
            this.userTemplates = templates;
            
            console.log(`Saved ${templates.length} user templates`);
            
        } catch (error) {
            console.error('Error saving user templates:', error);
            throw new Error(`Error guardando plantillas: ${error}`);
        }
    }

    private getCreationDate(): string {
        try {
            if (fs.existsSync(this.userTemplatesPath)) {
                const data = fs.readFileSync(this.userTemplatesPath, 'utf8');
                const parsed: TemplateFile = JSON.parse(data);
                return parsed.metadata?.createdAt || new Date().toISOString();
            }
        } catch (error) {
            console.error('Error getting creation date:', error);
        }
        return new Date().toISOString();
    }

    async addTemplate(template: Snippet): Promise<void> {
        const templates = await this.loadUserTemplates();
        
        // Verificar que el ID sea unico
        if (templates.find(t => t.id === template.id)) {
            throw new Error(`Ya existe un template con el ID: ${template.id}`);
        }
        
        // Verificar que el nombre sea unico
        if (templates.find(t => t.name === template.name)) {
            throw new Error(`Ya existe un template con el nombre: ${template.name}`);
        }
        
        templates.push(template);
        await this.saveUserTemplates(templates);
        
        vscode.window.showInformationMessage(`✅ Template "${template.name}" agregado exitosamente!`);
    }

    async updateTemplate(templateId: string, updatedTemplate: Snippet): Promise<void> {
        const templates = await this.loadUserTemplates();
        const index = templates.findIndex(t => t.id === templateId);
        
        if (index === -1) {
            throw new Error(`Template con ID ${templateId} no encontrado`);
        }
        
        // Verificar nombre unico (excepto el actual)
        const existingWithName = templates.find(t => t.name === updatedTemplate.name && t.id !== templateId);
        if (existingWithName) {
            throw new Error(`Ya existe otro template con el nombre: ${updatedTemplate.name}`);
        }
        
        templates[index] = { ...updatedTemplate, id: templateId };
        await this.saveUserTemplates(templates);
        
        vscode.window.showInformationMessage(`✅ Template "${updatedTemplate.name}" actualizado exitosamente!`);
    }

    async deleteTemplate(templateId: string): Promise<void> {
        const templates = await this.loadUserTemplates();
        const templateToDelete = templates.find(t => t.id === templateId);
        
        if (!templateToDelete) {
            throw new Error(`Template con ID ${templateId} no encontrado`);
        }

        // Confirmar eliminacion
        const confirmation = await vscode.window.showWarningMessage(
            `¿Estas seguro de que quieres eliminar el template "${templateToDelete.name}"?`,
            { modal: true },
            'Si, eliminar',
            'Cancelar'
        );

        if (confirmation === 'Si, eliminar') {
            const updatedTemplates = templates.filter(t => t.id !== templateId);
            await this.saveUserTemplates(updatedTemplates);
            
            vscode.window.showInformationMessage(`🗑️ Template "${templateToDelete.name}" eliminado exitosamente!`);
        }
    }

    async getAllTemplates(): Promise<Snippet[]> {
        return await this.loadUserTemplates();
    }

    async getTemplateById(id: string): Promise<Snippet | undefined> {
        const templates = await this.loadUserTemplates();
        return templates.find(t => t.id === id);
    }

    async exportTemplates(exportPath?: string): Promise<void> {
        const templates = await this.loadUserTemplates();
        
        if (templates.length === 0) {
            vscode.window.showInformationMessage('No hay plantillas personalizadas para exportar');
            return;
        }

        let filePath: string;

        if (exportPath) {
            filePath = exportPath;
        } else {
            const uri = await vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.file('my-snippets.json'),
                filters: {
                    'JSON Files': ['json']
                },
                saveLabel: 'Exportar Snippets'
            });

            if (!uri) {
                return; // Usuario cancelo
            }

            filePath = uri.fsPath;
        }

        try {
            const exportData: TemplateFile = {
                version: "1.0.0",
                templates: templates,
                metadata: {
                    name: "Snippets Exportados",
                    description: `${templates.length} snippets personalizados exportados`,
                    author: "Usuario",
                    createdAt: this.getCreationDate(),
                    updatedAt: new Date().toISOString()
                }
            };

            fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
            
            vscode.window.showInformationMessage(
                `✅ ${templates.length} snippets exportados exitosamente!`,
                'Abrir archivo'
            ).then(selection => {
                if (selection) {
                    vscode.commands.executeCommand('vscode.open', vscode.Uri.file(filePath));
                }
            });

        } catch (error) {
            console.error('Error exporting templates:', error);
            vscode.window.showErrorMessage(`Error exportando snippets: ${error}`);
        }
    }

    async importTemplates(importPath?: string): Promise<void> {
        let filePath: string;

        if (importPath) {
            filePath = importPath;
        } else {
            const uri = await vscode.window.showOpenDialog({
                canSelectMany: false,
                filters: {
                    'JSON Files': ['json']
                },
                openLabel: 'Importar Snippets'
            });

            if (!uri || uri.length === 0) {
                return; // Usuario cancelo
            }

            filePath = uri[0].fsPath;
        }

        try {
            if (!fs.existsSync(filePath)) {
                vscode.window.showErrorMessage('El archivo seleccionado no existe');
                return;
            }

            const data = fs.readFileSync(filePath, 'utf8');
            const importData: TemplateFile = JSON.parse(data);

            // Validar estructura
            if (!importData.templates || !Array.isArray(importData.templates)) {
                vscode.window.showErrorMessage('El archivo no tiene un formato valido');
                return;
            }

            // Validar que cada template tenga los campos requeridos
            const invalidTemplates = importData.templates.filter(t => 
                !t.id || !t.name || !t.content || !t.language
            );

            if (invalidTemplates.length > 0) {
                vscode.window.showErrorMessage(`${invalidTemplates.length} snippets tienen formato invalido`);
                return;
            }

            const currentTemplates = await this.loadUserTemplates();
            let importedCount = 0;
            let skippedCount = 0;

            // Procesar cada template
            for (const template of importData.templates) {
                // Verificar duplicados por nombre
                const existingByName = currentTemplates.find(t => t.name === template.name);
                
                if (existingByName) {
                    const action = await vscode.window.showWarningMessage(
                        `Ya existe un snippet llamado "${template.name}". ¿Que quieres hacer?`,
                        'Reemplazar',
                        'Omitir',
                        'Cancelar importacion'
                    );

                    if (action === 'Cancelar importacion') {
                        return;
                    } else if (action === 'Omitir') {
                        skippedCount++;
                        continue;
                    } else if (action === 'Reemplazar') {
                        // Actualizar el existente
                        await this.updateTemplate(existingByName.id, {
                            ...template,
                            id: existingByName.id // Mantener ID original
                        });
                        importedCount++;
                    }
                } else {
                    // Generar nuevo ID si es necesario
                    let newId = template.id;
                    if (currentTemplates.find(t => t.id === newId)) {
                        newId = `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    }

                    await this.addTemplate({
                        ...template,
                        id: newId
                    });
                    importedCount++;
                }
            }

            const message = `✅ Importacion completada!\n• ${importedCount} snippets importados\n• ${skippedCount} snippets omitidos`;
            vscode.window.showInformationMessage(message);

        } catch (error) {
            console.error('Error importing templates:', error);
            vscode.window.showErrorMessage(`Error importando snippets: ${error}`);
        }
    }

    async getStatistics(): Promise<{
        totalTemplates: number;
        languageDistribution: { [key: string]: number };
        categoryDistribution: { [key: string]: number };
        recentTemplates: Snippet[];
    }> {
        const templates = await this.loadUserTemplates();
        
        const languageDistribution: { [key: string]: number } = {};
        const categoryDistribution: { [key: string]: number } = {};

        templates.forEach(template => {
            // Contar por lenguaje
            languageDistribution[template.language] = (languageDistribution[template.language] || 0) + 1;
            
            // Contar por categoria
            categoryDistribution[template.category] = (categoryDistribution[template.category] || 0) + 1;
        });

        // Obtener templates recientes (ultimos 5)
        const recentTemplates = templates
            .sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime())
            .slice(0, 5);

        return {
            totalTemplates: templates.length,
            languageDistribution,
            categoryDistribution,
            recentTemplates
        };
    }

    async createTemplateWizard(): Promise<Snippet | undefined> {
        try {
            // Paso 1: Nombre
            const name = await vscode.window.showInputBox({
                prompt: '📝 Paso 1/6: Nombre del snippet',
                placeHolder: 'ej: mi-snippet-personalizado',
                validateInput: async (value) => {
                    if (!value || value.trim().length === 0) {
                        return 'El nombre no puede estar vacio';
                    }
                    if (!/^[a-zA-Z0-9-_\s]+$/.test(value)) {
                        return 'Solo se permiten letras, numeros, espacios, guiones y guiones bajos';
                    }
                    
                    // Verificar nombre unico
                    const templates = await this.loadUserTemplates();
                    if (templates.find(t => t.name === value.trim())) {
                        return 'Ya existe un snippet con ese nombre';
                    }
                    
                    return null;
                }
            });

            if (!name) return undefined;

            // Paso 2: Descripcion
            const description = await vscode.window.showInputBox({
                prompt: '📄 Paso 2/6: Descripcion del snippet',
                placeHolder: 'ej: Mi snippet personalizado para...',
                value: `Snippet personalizado: ${name.trim()}`
            });

            if (!description) return undefined;

            // Paso 3: Lenguaje
            const languages = [
                'javascript', 'typescript', 'html', 'css', 'scss', 'sass',
                'python', 'java', 'cpp', 'c', 'csharp', 'php', 'ruby',
                'go', 'rust', 'swift', 'kotlin', 'dart', 'vue', 'react',
                'angular', 'svelte', 'json', 'yaml', 'xml', 'markdown', 'otros'
            ];
            
            const language = await vscode.window.showQuickPick(languages, {
                placeHolder: '🌐 Paso 3/6: Selecciona el lenguaje'
            });

            if (!language) return undefined;

            // Paso 4: Categoria
            const existingCategories = new Set((await this.loadUserTemplates()).map(t => t.category));
            const defaultCategories = ['Debug', 'Functions', 'Classes', 'Error Handling', 'Loops', 'Conditionals', 'Custom'];
            const allCategories = Array.from(new Set([...defaultCategories, ...existingCategories])).sort();
            
            const category = await vscode.window.showQuickPick(allCategories, {
                placeHolder: '📂 Paso 4/6: Selecciona una categoria'
            });

            if (!category) return undefined;

            // Paso 5: Prefijo
            const defaultPrefix = name.trim().toLowerCase().replace(/\s+/g, '-').substring(0, 5);
            const prefix = await vscode.window.showInputBox({
                prompt: '⌨️ Paso 5/6: Prefijo para autocompletar (opcional)',
                placeHolder: 'ej: msc',
                value: defaultPrefix
            });

            // Paso 6: Contenido
            const editor = vscode.window.activeTextEditor;
            const selectedText = editor?.document.getText(editor.selection) || '';
            
            const content = await vscode.window.showInputBox({
                prompt: '💻 Paso 6/6: Contenido del snippet (usa ${1:placeholder} para campos editables)',
                placeHolder: 'ej: console.log(${1:mensaje});$0',
                value: selectedText || `// ${description}\n\${1:codigo_aqui}\$0`,
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
                id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: name.trim(),
                description: description.trim(),
                content: content,
                language: language,
                category: category,
                prefix: prefix?.trim() || defaultPrefix
            };

            return newSnippet;

        } catch (error) {
            console.error('Error in template wizard:', error);
            vscode.window.showErrorMessage('Error creando snippet personalizado');
            return undefined;
        }
    }

    async openTemplateFile(): Promise<void> {
        try {
            if (!fs.existsSync(this.userTemplatesPath)) {
                // Crear archivo vacio si no existe
                await this.saveUserTemplates([]);
            }

            const document = await vscode.workspace.openTextDocument(this.userTemplatesPath);
            await vscode.window.showTextDocument(document);
            
        } catch (error) {
            console.error('Error opening template file:', error);
            vscode.window.showErrorMessage('Error abriendo archivo de plantillas');
        }
    }

    async reloadTemplates(): Promise<void> {
        try {
            const templates = await this.loadUserTemplates();
            vscode.window.showInformationMessage(`🔄 ${templates.length} plantillas recargadas exitosamente!`);
        } catch (error) {
            console.error('Error reloading templates:', error);
            vscode.window.showErrorMessage('Error recargando plantillas');
        }
    }
}
```

## src/extension.ts - Integracion del Template Manager

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
    SnippetQuickPick
} from './userInterface';
import { TemplateManager } from './templateManager';

let templateManager: TemplateManager;

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating Quick Snippet Inserter extension...');

    // Inicializar gestor de plantillas
    templateManager = new TemplateManager(context);

    // Cargar plantillas personalizadas al inicio
    templateManager.loadUserTemplates().then(() => {
        console.log('User templates loaded');
    });

    // Menu principal actualizado
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
                    vscode.commands.executeCommand('quickSnippet.createTemplate');
                    break;
                case 'manage':
                    vscode.commands.executeCommand('quickSnippet.manageTemplates');
                    break;
                case 'viewAll':
                    vscode.commands.executeCommand('quickSnippet.viewAllSnippets');
                    break;
                case 'info':
                    vscode.commands.executeCommand('quickSnippet.showStatistics');
                    break;
            }
        }
    });

    // Insertar snippet (incluyendo personalizados)
    let insertSnippetCommand = vscode.commands.registerCommand('quickSnippet.insertSnippet', async () => {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            vscode.window.showWarningMessage('Por favor, abre un archivo para insertar snippets');
            return;
        }

        // Combinar snippets predefinidos y personalizados
        const userTemplates = await templateManager.getAllTemplates();
        const allSnippets = [...predefinedSnippets, ...userTemplates];

        const quickPick = new SnippetQuickPick();
        const selectedSnippet = await quickPick.showSnippetPicker(allSnippets);

        if (selectedSnippet) {
            await showProgressWithMessage('Insertando snippet...', async () => {
                const snippetString = new vscode.SnippetString(selectedSnippet.content);
                await editor.insertSnippet(snippetString);
            });
            
            vscode.window.showInformationMessage(`✅ Snippet "${selectedSnippet.name}" insertado!`);
        }
    });

    // Crear template personalizado
    let createTemplateCommand = vscode.commands.registerCommand('quickSnippet.createTemplate', async () => {
        try {
            const newTemplate = await templateManager.createTemplateWizard();
            
            if (newTemplate) {
                await templateManager.addTemplate(newTemplate);
                
                // Ofrecer usar el snippet inmediatamente
                const useNow = await vscode.window.showInformationMessage(
                    `✅ Snippet "${newTemplate.name}" creado exitosamente!`,
                    'Usar ahora',
                    'Ver todos mis snippets'
                );

                if (useNow === 'Usar ahora' && vscode.window.activeTextEditor) {
                    const snippetString = new vscode.SnippetString(newTemplate.content);
                    await vscode.window.activeTextEditor.insertSnippet(snippetString);
                } else if (useNow === 'Ver todos mis snippets') {
                    vscode.commands.executeCommand('quickSnippet.viewUserTemplates');
                }
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error creando snippet: ${error}`);
        }
    });

    // Gestionar templates personalizados
    let manageTemplatesCommand = vscode.commands.registerCommand('quickSnippet.manageTemplates', async () => {
        const actions = [
            'Ver mis snippets',
            'Editar snippet',
            'Eliminar snippet',
            'Importar snippets',
            'Exportar snippets',
            'Abrir archivo de snippets',
            'Recargar snippets'
        ];

        const selected = await vscode.window.showQuickPick(actions, {
            placeHolder: '🛠️ ¿Que quieres hacer con tus snippets personalizados?'
        });

        if (selected) {
            switch (selected) {
                case 'Ver mis snippets':
                    vscode.commands.executeCommand('quickSnippet.viewUserTemplates');
                    break;
                case 'Editar snippet':
                    vscode.commands.executeCommand('quickSnippet.editTemplate');
                    break;
                case 'Eliminar snippet':
                    vscode.commands.executeCommand('quickSnippet.deleteTemplate');
                    break;
                case 'Importar snippets':
                    vscode.commands.executeCommand('quickSnippet.importTemplates');
                    break;
                case 'Exportar snippets':
                    vscode.commands.executeCommand('quickSnippet.exportTemplates');
                    break;
                case 'Abrir archivo de snippets':
                    vscode.commands.executeCommand('quickSnippet.openTemplateFile');
                    break;
                case 'Recargar snippets':
                    vscode.commands.executeCommand('quickSnippet.reloadTemplates');
                    break;
            }
        }
    });

    // Ver templates de usuario
    let viewUserTemplatesCommand = vscode.commands.registerCommand('quickSnippet.viewUserTemplates', async () => {
        const userTemplates = await templateManager.getAllTemplates();
        
        if (userTemplates.length === 0) {
            vscode.window.showInformationMessage(
                'No tienes snippets personalizados aun',
                'Crear uno ahora'
            ).then(selection => {
                if (selection) {
                    vscode.commands.executeCommand('quickSnippet.createTemplate');
                }
            });
            return;
        }

        const quickPick = new SnippetQuickPick();
        const selectedSnippet = await quickPick.showSnippetPicker(userTemplates);

        if (selectedSnippet && vscode.window.activeTextEditor) {
            const snippetString = new vscode.SnippetString(selectedSnippet.content);
            await vscode.window.activeTextEditor.insertSnippet(snippetString);
            
            vscode.window.showInformationMessage(`✅ Snippet "${selectedSnippet.name}" insertado!`);
        }
    });

    // Editar template
    let editTemplateCommand = vscode.commands.registerCommand('quickSnippet.editTemplate', async () => {
        const userTemplates = await templateManager.getAllTemplates();
        
        if (userTemplates.length === 0) {
            vscode.window.showInformationMessage('No tienes snippets personalizados para editar');
            return;
        }

        const items = userTemplates.map(t => ({
            label: t.name,
            description: t.description,
            detail: `${t.language} - ${t.category}`,
            template: t
        }));

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Selecciona el snippet a editar'
        });

        if (selected) {
            // TODO: Implementar editor de templates (simplificado por ahora)
            vscode.window.showInformationMessage(
                `Editar "${selected.template.name}" - Esta funcionalidad se completara en la version final`,
                'Abrir archivo manualmente'
            ).then(action => {
                if (action) {
                    vscode.commands.executeCommand('quickSnippet.openTemplateFile');
                }
            });
        }
    });

    // Eliminar template
    let deleteTemplateCommand = vscode.commands.registerCommand('quickSnippet.deleteTemplate', async () => {
        const userTemplates = await templateManager.getAllTemplates();
        
        if (userTemplates.length === 0) {
            vscode.window.showInformationMessage('No tienes snippets personalizados para eliminar');
            return;
        }

        const items = userTemplates.map(t => ({
            label: t.name,
            description: t.description,
            detail: `${t.language} - ${t.category}`,
            template: t
        }));

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Selecciona el snippet a eliminar'
        });

        if (selected) {
            try {
                await templateManager.deleteTemplate(selected.template.id);
            } catch (error) {
                vscode.window.showErrorMessage(`Error eliminando snippet: ${error}`);
            }
        }
    });

    // Importar templates
    let importTemplatesCommand = vscode.commands.registerCommand('quickSnippet.importTemplates', async () => {
        try {
            await showProgressWithMessage('Importando snippets...', async () => {
                await templateManager.importTemplates();
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Error importando snippets: ${error}`);
        }
    });

    // Exportar templates
    let exportTemplatesCommand = vscode.commands.registerCommand('quickSnippet.exportTemplates', async () => {
        try {
            await showProgressWithMessage('Exportando snippets...', async () => {
                await templateManager.exportTemplates();
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Error exportando snippets: ${error}`);
        }
    });

    // Abrir archivo de templates
    let openTemplateFileCommand = vscode.commands.registerCommand('quickSnippet.openTemplateFile', async () => {
        await templateManager.openTemplateFile();
    });

    // Recargar templates
    let reloadTemplatesCommand = vscode.commands.registerCommand('quickSnippet.reloadTemplates', async () => {
        await templateManager.reloadTemplates();
    });

    // Mostrar estadisticas
    let showStatisticsCommand = vscode.commands.registerCommand('quickSnippet.showStatistics', async () => {
        try {
            const stats = await templateManager.getStatistics();
            const predefinedCount = predefinedSnippets.length;
            const totalCount = predefinedCount + stats.totalTemplates;

            const languageStats = Object.entries(stats.languageDistribution)
                .map(([lang, count]) => `• ${lang}: ${count}`)
                .join('\n');

            const categoryStats = Object.entries(stats.categoryDistribution)
                .map(([cat, count]) => `• ${cat}: ${count}`)
                .join('\n');

            const message = `
🚀 **Quick Snippet Inserter - Estadisticas**

📊 **Resumen:**
• Total de snippets: ${totalCount}
• Snippets predefinidos: ${predefinedCount}
• Snippets personalizados: ${stats.totalTemplates}

🌐 **Por lenguaje (personalizados):**
${languageStats || '• Ninguno aun'}

📂 **Por categoria (personalizados):**
${categoryStats || '• Ninguno aun'}

📈 **Snippets recientes:**
${stats.recentTemplates.map(t => `• ${t.name}`).join('\n') || '• Ninguno aun'}
            `.trim();

            vscode.window.showInformationMessage(message, { modal: false });

        } catch (error) {
            vscode.window.showErrorMessage(`Error obteniendo estadisticas: ${error}`);
        }
    });

    // Registrar todos los comandos
    context.subscriptions.push(
        mainMenuCommand,
        insertSnippetCommand,
        createTemplateCommand,
        manageTemplatesCommand,
        viewUserTemplatesCommand,
        editTemplateCommand,
        deleteTemplateCommand,
        importTemplatesCommand,
        exportTemplatesCommand,
        openTemplateFileCommand,
        reloadTemplatesCommand,
        showStatisticsCommand
    );
    
    console.log('Quick Snippet Inserter extension activated successfully!');
}

export function deactivate() {
    console.log('Quick Snippet Inserter extension deactivated');
}
```

## package.json - Comandos de Template Manager

Agregar estos comandos a la seccion `contributes.commands`:

```json
{
  "contributes": {
    "commands": [
      {
        "command": "quickSnippet.createTemplate",
        "title": "Crear Snippet Personalizado",
        "category": "Quick Snippet",
        "icon": "$(new-file)"
      },
      {
        "command": "quickSnippet.manageTemplates",
        "title": "Gestionar Snippets Personalizados",
        "category": "Quick Snippet",
        "icon": "$(settings-gear)"
      },
      {
        "command": "quickSnippet.viewUserTemplates",
        "title": "Ver Mis Snippets",
        "category": "Quick Snippet",
        "icon": "$(list-unordered)"
      },
      {
        "command": "quickSnippet.importTemplates",
        "title": "Importar Snippets",
        "category": "Quick Snippet",
        "icon": "$(cloud-download)"
      },
      {
        "command": "quickSnippet.exportTemplates",
        "title": "Exportar Snippets",
        "category": "Quick Snippet",
        "icon": "$(cloud-upload)"
      },
      {
        "command": "quickSnippet.showStatistics",
        "title": "Estadisticas de Snippets",
        "category": "Quick Snippet",
        "icon": "$(graph)"
      }
    ],
    "keybindings": [
      {
        "command": "quickSnippet.createTemplate",
        "key": "ctrl+shift+n",
        "mac": "cmd+shift+n"
      },
      {
        "command": "quickSnippet.manageTemplates",
        "key": "ctrl+shift+t",
        "mac": "cmd+shift+t"
      },
      {
        "command": "quickSnippet.showStatistics",
        "key": "ctrl+shift+alt+s",
        "mac": "cmd+shift+alt+s"
      }
    ]
  }
}
```

## Probar el Sistema de Plantillas

### Funcionalidades a Verificar:

1. **Creacion de Snippets Personalizados**:
   - ✅ Asistente paso a paso funciona
   - ✅ Validacion de nombres unicos
   - ✅ Guardado persistente

2. **Gestion CRUD**:
   - ✅ Ver lista de snippets personalizados
   - ✅ Eliminar snippets con confirmacion
   - ✅ Edicion basica (abrir archivo)

3. **Importacion/Exportacion**:
   - ✅ Exportar a archivo JSON
   - ✅ Importar desde archivo JSON
   - ✅ Manejo de duplicados

4. **Persistencia**:
   - ✅ Snippets se mantienen entre sesiones
   - ✅ Archivo JSON bien formateado
   - ✅ Metadatos correctos

5. **Estadisticas**:
   - ✅ Conteo correcto de snippets
   - ✅ Distribucion por lenguaje y categoria
   - ✅ Snippets recientes

### Comandos para Probar:

```bash
# Compilar y probar
npm run compile

# En VSCode (F5 para debug):
# - Ctrl+Shift+N: Crear snippet personalizado
# - Ctrl+Shift+T: Gestionar snippets
# - Ctrl+Shift+Alt+S: Ver estadisticas
# - Command Palette: "Quick Snippet" para ver todos los comandos
```
