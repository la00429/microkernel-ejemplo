import * as vscode from 'vscode';
import { Snippet } from './snippets';
import { UserTemplate } from './templateManager';

// Interfaz para items de Quick Pick mejorados
export interface EnhancedQuickPickItem extends vscode.QuickPickItem {
    snippet?: Snippet;
    category?: string;
    action?: string;
    data?: any;
}

// Clase para manejar interfaces de usuario avanzadas
export class UserInterface {
    
    // Quick Pick mejorado para selección de snippets
    static async showSnippetSelector(
        snippets: Snippet[], 
        currentLanguage?: string,
        title: string = 'Seleccionar Snippet'
    ): Promise<Snippet | undefined> {
        
        if (snippets.length === 0) {
            vscode.window.showInformationMessage('No hay snippets disponibles');
            return undefined;
        }

        // Agrupar snippets por categoría
        const categories = [...new Set(snippets.map(s => s.category))].sort();
        
        // Crear items organizados por categoría
        const items: EnhancedQuickPickItem[] = [];
        
        // Agregar header con estadísticas
        items.push({
            label: '📊 Información',
            description: `${snippets.length} snippets disponibles`,
            detail: currentLanguage ? `Filtrado para: ${currentLanguage}` : 'Todos los lenguajes',
            kind: vscode.QuickPickItemKind.Separator
        });

        // Agregar snippets por categoría
        for (const category of categories) {
            const categorySnippets = snippets.filter(s => s.category === category);
            
            // Separator para la categoría
            items.push({
                label: `📁 ${category}`,
                description: `${categorySnippets.length} snippets`,
                kind: vscode.QuickPickItemKind.Separator
            });

            // Snippets de la categoría
            for (const snippet of categorySnippets) {
                const icon = this.getSnippetIcon(snippet);
                const languageTag = snippet.language ? `[${snippet.language}]` : '[universal]';
                const prefixTag = snippet.prefix ? ` 🏷️${snippet.prefix}` : '';
                
                items.push({
                    label: `${icon} ${snippet.name}`,
                    description: `${languageTag} ${snippet.description}`,
                    detail: `${snippet.category}${prefixTag}`,
                    snippet: snippet
                });
            }
        }

        const quickPick = vscode.window.createQuickPick<EnhancedQuickPickItem>();
        quickPick.title = title;
        quickPick.placeholder = 'Busca por nombre, descripción, categoría o prefijo...';
        quickPick.items = items;
        quickPick.matchOnDescription = true;
        quickPick.matchOnDetail = true;
        quickPick.canSelectMany = false;

        return new Promise((resolve) => {
            quickPick.onDidChangeSelection(selection => {
                if (selection[0]?.snippet) {
                    resolve(selection[0].snippet);
                    quickPick.hide();
                }
            });

            quickPick.onDidHide(() => {
                resolve(undefined);
                quickPick.dispose();
            });

            quickPick.show();
        });
    }

    // Menú principal de acciones de snippets
    static async showMainMenu(): Promise<string | undefined> {
        const items: EnhancedQuickPickItem[] = [
            {
                label: '🚀 Insertar Snippet',
                description: 'Buscar e insertar un snippet',
                detail: 'Menú principal de inserción de snippets',
                action: 'insert'
            },
            {
                label: '🔍 Buscar Snippets',
                description: 'Buscar snippets por texto',
                detail: 'Búsqueda avanzada en todos los snippets',
                action: 'search'
            },
            {
                label: '📁 Explorar por Categoría',
                description: 'Navegar snippets por categoría',
                detail: 'Organización por categorías',
                action: 'category'
            },
            {
                label: '',
                kind: vscode.QuickPickItemKind.Separator
            },
            {
                label: '➕ Crear Snippet Personalizado',
                description: 'Crear un nuevo snippet',
                detail: 'Asistente para crear snippets personalizados',
                action: 'create'
            },
            {
                label: '✏️ Gestionar Snippets Personalizados',
                description: 'Editar, eliminar snippets',
                detail: 'Administración de snippets personalizados',
                action: 'manage'
            },
            {
                label: '',
                kind: vscode.QuickPickItemKind.Separator
            },
            {
                label: '📊 Ver Estadísticas',
                description: 'Dashboard de estadísticas',
                detail: 'Información detallada sobre tus snippets',
                action: 'stats'
            },
            {
                label: '📋 Ver Lista Completa',
                description: 'Vista web de todos los snippets',
                detail: 'Interfaz web interactiva',
                action: 'list'
            },
            {
                label: '',
                kind: vscode.QuickPickItemKind.Separator
            },
            {
                label: '📥 Importar/Exportar',
                description: 'Gestionar archivos de snippets',
                detail: 'Importar o exportar snippets',
                action: 'import_export'
            }
        ];

        const selected = await vscode.window.showQuickPick(items, {
            title: '📝 Quick Snippet Inserter - Menú Principal',
            placeHolder: 'Selecciona una acción...'
        });

        return selected?.action;
    }

    // Menú de gestión de snippets personalizados
    static async showManagementMenu(): Promise<string | undefined> {
        const items: EnhancedQuickPickItem[] = [
            {
                label: '✏️ Editar Snippet Existente',
                description: 'Modificar un snippet personalizado',
                detail: 'Cambiar contenido, descripción, categoría, etc.',
                action: 'edit'
            },
            {
                label: '🗑️ Eliminar Snippet',
                description: 'Eliminar un snippet personalizado',
                detail: 'Eliminación con confirmación de seguridad',
                action: 'delete'
            },
            {
                label: '📄 Abrir Archivo de Snippets',
                description: 'Editar manualmente el archivo JSON',
                detail: 'Para usuarios avanzados',
                action: 'open_file'
            },
            {
                label: '🔄 Recargar Snippets',
                description: 'Recargar desde archivo',
                detail: 'Útil después de edición manual',
                action: 'reload'
            }
        ];

        const selected = await vscode.window.showQuickPick(items, {
            title: '🛠️ Gestión de Snippets Personalizados',
            placeHolder: 'Selecciona una acción...'
        });

        return selected?.action;
    }

    // Menú de importación/exportación
    static async showImportExportMenu(): Promise<string | undefined> {
        const items: EnhancedQuickPickItem[] = [
            {
                label: '📥 Importar desde Archivo',
                description: 'Cargar snippets desde archivo JSON',
                detail: 'Agregar snippets de archivo externo',
                action: 'import'
            },
            {
                label: '📤 Exportar a Archivo',
                description: 'Guardar snippets en archivo JSON',
                detail: 'Crear respaldo o compartir snippets',
                action: 'export'
            }
        ];

        const selected = await vscode.window.showQuickPick(items, {
            title: '📁 Importar/Exportar Snippets',
            placeHolder: 'Selecciona una acción...'
        });

        return selected?.action;
    }

    // Selector de categorías
    static async showCategorySelector(
        snippets: Snippet[],
        title: string = 'Seleccionar Categoría'
    ): Promise<string | undefined> {
        
        const categoryStats = new Map<string, number>();
        snippets.forEach(snippet => {
            const count = categoryStats.get(snippet.category) || 0;
            categoryStats.set(snippet.category, count + 1);
        });

        const items: EnhancedQuickPickItem[] = Array.from(categoryStats.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([category, count]) => ({
                label: `📁 ${category}`,
                description: `${count} snippet${count > 1 ? 's' : ''}`,
                detail: this.getCategoryDescription(category),
                category: category
            }));

        const selected = await vscode.window.showQuickPick(items, {
            title: title,
            placeHolder: 'Selecciona una categoría...'
        });

        return selected?.category;
    }

    // Selector de lenguajes
    static async showLanguageSelector(
        snippets: Snippet[],
        title: string = 'Seleccionar Lenguaje'
    ): Promise<string | undefined> {
        
        const languageStats = new Map<string, number>();
        snippets.forEach(snippet => {
            const lang = snippet.language || 'universal';
            const count = languageStats.get(lang) || 0;
            languageStats.set(lang, count + 1);
        });

        const items: EnhancedQuickPickItem[] = [
            {
                label: '🌐 Todos los lenguajes',
                description: `${snippets.length} snippets totales`,
                detail: 'Mostrar snippets de todos los lenguajes',
                category: 'all'
            },
            {
                label: '',
                kind: vscode.QuickPickItemKind.Separator
            },
            ...Array.from(languageStats.entries())
                .sort((a, b) => b[1] - a[1]) // Ordenar por cantidad, descendente
                .map(([language, count]) => ({
                    label: `${this.getLanguageIcon(language)} ${language}`,
                    description: `${count} snippet${count > 1 ? 's' : ''}`,
                    detail: this.getLanguageDescription(language),
                    category: language
                }))
        ];

        const selected = await vscode.window.showQuickPick(items, {
            title: title,
            placeHolder: 'Selecciona un lenguaje...'
        });

        return selected?.category;
    }

    // Progress bar para operaciones largas
    static async withProgress<T>(
        title: string,
        operation: (progress: vscode.Progress<{message?: string; increment?: number}>) => Promise<T>
    ): Promise<T> {
        return vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: title,
            cancellable: false
        }, operation);
    }

    // Notificaciones mejoradas
    static showSuccessMessage(message: string, actions?: string[]): Thenable<string | undefined> {
        return vscode.window.showInformationMessage(`✅ ${message}`, ...actions || []);
    }

    static showErrorMessage(message: string, actions?: string[]): Thenable<string | undefined> {
        return vscode.window.showErrorMessage(`❌ ${message}`, ...actions || []);
    }

    static showWarningMessage(message: string, actions?: string[]): Thenable<string | undefined> {
        return vscode.window.showWarningMessage(`⚠️ ${message}`, ...actions || []);
    }

    // Input box mejorado para búsqueda
    static async showSearchInput(placeholder: string = 'Buscar snippets...'): Promise<string | undefined> {
        return vscode.window.showInputBox({
            prompt: 'Ingresa términos de búsqueda',
            placeHolder: placeholder,
            validateInput: (value) => {
                if (value.trim().length < 2) {
                    return 'Ingresa al menos 2 caracteres para buscar';
                }
                return null;
            }
        });
    }

    // Confirmación mejorada
    static async showConfirmation(
        message: string,
        confirmText: string = 'Confirmar',
        isDestructive: boolean = false
    ): Promise<boolean> {
        const result = await vscode.window.showWarningMessage(
            message,
            { modal: true },
            confirmText,
            'Cancelar'
        );
        return result === confirmText;
    }

    // Obtener icono para snippet según tipo/lenguaje
    private static getSnippetIcon(snippet: Snippet): string {
        if (snippet.language) {
            switch (snippet.language.toLowerCase()) {
                case 'javascript':
                case 'typescript': return '🟨';
                case 'html': return '🌐';
                case 'css': return '🎨';
                case 'python': return '🐍';
                case 'java': return '☕';
                case 'csharp': return '💙';
                default: return '📄';
            }
        }
        
        // Icono según categoría si no hay lenguaje específico
        switch (snippet.category.toLowerCase()) {
            case 'debug': return '🐛';
            case 'functions': return '⚡';
            case 'classes': return '🏗️';
            case 'loops': return '🔄';
            case 'conditionals': return '🔀';
            case 'custom': return '⭐';
            default: return '📝';
        }
    }

    // Obtener icono para lenguaje
    private static getLanguageIcon(language: string): string {
        switch (language.toLowerCase()) {
            case 'javascript': return '🟨';
            case 'typescript': return '🔷';
            case 'html': return '🌐';
            case 'css': return '🎨';
            case 'python': return '🐍';
            case 'java': return '☕';
            case 'csharp': return '💙';
            case 'universal': return '🌍';
            default: return '📄';
        }
    }

    // Descripción de categoría
    private static getCategoryDescription(category: string): string {
        switch (category.toLowerCase()) {
            case 'debug': return 'Herramientas de depuración y logging';
            case 'functions': return 'Plantillas de funciones y métodos';
            case 'classes': return 'Estructuras de clases y objetos';
            case 'loops': return 'Estructuras de control repetitivo';
            case 'conditionals': return 'Estructuras de control condicional';
            case 'custom': return 'Snippets personalizados del usuario';
            case 'boilerplate': return 'Plantillas básicas y estructura inicial';
            case 'elements': return 'Elementos y componentes';
            case 'forms': return 'Formularios y entrada de datos';
            case 'layout': return 'Diseño y disposición de elementos';
            case 'responsive': return 'Diseño adaptativo y responsive';
            case 'error handling': return 'Manejo de errores y excepciones';
            default: return 'Snippets variados';
        }
    }

    // Descripción de lenguaje
    private static getLanguageDescription(language: string): string {
        switch (language.toLowerCase()) {
            case 'javascript': return 'Lenguaje de programación para web';
            case 'typescript': return 'JavaScript con tipado estático';
            case 'html': return 'Lenguaje de marcado para web';
            case 'css': return 'Hojas de estilo en cascada';
            case 'python': return 'Lenguaje de programación versátil';
            case 'java': return 'Lenguaje orientado a objetos';
            case 'csharp': return 'Lenguaje de Microsoft .NET';
            case 'universal': return 'Aplicable a cualquier lenguaje';
            default: return 'Lenguaje de programación';
        }
    }

    // Multi-step input para crear snippets
    static async showMultiStepSnippetCreator(): Promise<{
        name: string;
        description: string;
        content: string;
        language?: string;
        category: string;
        prefix?: string;
    } | undefined> {

        const state: any = {};

        // Paso 1: Nombre
        const name = await vscode.window.showInputBox({
            title: 'Crear Snippet - Paso 1/6',
            prompt: 'Nombre del snippet',
            placeHolder: 'Ej: mi-funcion-util',
            validateInput: (value) => {
                if (!value.trim()) return 'El nombre es obligatorio';
                if (!/^[a-zA-Z0-9-_]+$/.test(value.trim())) {
                    return 'Solo se permiten letras, números, guiones y guiones bajos';
                }
                return null;
            }
        });

        if (!name) return undefined;
        state.name = name.trim();

        // Paso 2: Descripción
        const description = await vscode.window.showInputBox({
            title: 'Crear Snippet - Paso 2/6',
            prompt: 'Descripción del snippet',
            placeHolder: 'Ej: Función útil para...',
            validateInput: (value) => {
                if (!value.trim()) return 'La descripción es obligatoria';
                return null;
            }
        });

        if (!description) return undefined;
        state.description = description.trim();

        // Paso 3: Categoría
        const categories = ['Custom', 'Functions', 'Classes', 'Debug', 'Loops', 'Conditionals', 'Boilerplate', 'Elements', 'Forms', 'Layout', 'Responsive', 'Error Handling', 'Other'];
        const categoryItems = categories.map(cat => ({
            label: `📁 ${cat}`,
            description: this.getCategoryDescription(cat),
            category: cat
        }));

        const selectedCategory = await vscode.window.showQuickPick(categoryItems, {
            title: 'Crear Snippet - Paso 3/6',
            placeHolder: 'Selecciona una categoría'
        });

        if (!selectedCategory) return undefined;
        state.category = selectedCategory.category;

        // Paso 4: Lenguaje
        const languages = ['javascript', 'typescript', 'html', 'css', 'python', 'java', 'csharp', 'other'];
        const languageItems = [
            { label: '🌍 Universal', description: 'Aplicable a cualquier lenguaje', language: undefined },
            { label: '', kind: vscode.QuickPickItemKind.Separator },
            ...languages.map(lang => ({
                label: `${this.getLanguageIcon(lang)} ${lang}`,
                description: this.getLanguageDescription(lang),
                language: lang === 'other' ? undefined : lang
            }))
        ];

        const selectedLanguage = await vscode.window.showQuickPick(languageItems, {
            title: 'Crear Snippet - Paso 4/6',
            placeHolder: 'Selecciona un lenguaje (opcional)'
        });

        if (!selectedLanguage) return undefined;
        state.language = 'language' in selectedLanguage ? selectedLanguage.language : undefined;

        // Paso 5: Prefijo (opcional)
        const prefix = await vscode.window.showInputBox({
            title: 'Crear Snippet - Paso 5/6',
            prompt: 'Prefijo para autocompletado (opcional)',
            placeHolder: 'Ej: mfu (máximo 10 caracteres)',
            validateInput: (value) => {
                if (value && value.length > 10) {
                    return 'El prefijo no puede tener más de 10 caracteres';
                }
                if (value && !/^[a-zA-Z0-9]+$/.test(value)) {
                    return 'Solo se permiten letras y números en el prefijo';
                }
                return null;
            }
        });

        state.prefix = prefix?.trim() || undefined;

        // Paso 6: Contenido
        const content = await vscode.window.showInputBox({
            title: 'Crear Snippet - Paso 6/6',
            prompt: 'Contenido del snippet',
            placeHolder: 'Ej: function ${1:nombre}() { ${2:// código} }',
            value: state.language === 'javascript' ? 
                'function ${1:nombre}() {\n\t${2:// código aquí}\n\treturn ${3:valor};\n}$0' :
                'TODO: ${1:implementar}$0',
            validateInput: (value) => {
                if (!value.trim()) return 'El contenido es obligatorio';
                return null;
            }
        });

        if (!content) return undefined;
        state.content = content;

        return state;
    }
} 