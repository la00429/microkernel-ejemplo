# Paso 2: Comandos Basicos - Fragmentos de Codigo

## src/extension.ts - Version Basica

```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "quick-snippet-inserter" is now active!');

    // Comando basico de insercion
    let insertSnippetCommand = vscode.commands.registerCommand('quickSnippet.insertSnippet', () => {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            vscode.window.showErrorMessage('No hay editor activo');
            return;
        }

        // Insertar texto simple por ahora
        const snippet = new vscode.SnippetString('console.log(${1:mensaje});$0');
        editor.insertSnippet(snippet);
        
        vscode.window.showInformationMessage('¡Snippet insertado!');
    });

    // Comando de informacion
    let showInfoCommand = vscode.commands.registerCommand('quickSnippet.showInfo', () => {
        vscode.window.showInformationMessage('Quick Snippet Inserter v0.0.1 - ¡Listo para usar!');
    });

    context.subscriptions.push(insertSnippetCommand, showInfoCommand);
}

export function deactivate() {
    console.log('Extension "quick-snippet-inserter" is being deactivated');
}
```

## package.json - Actualizacion de Contribuciones

Agrega estas secciones a tu `package.json` existente:

```json
{
  "activationEvents": [
    "onCommand:quickSnippet.insertSnippet",
    "onCommand:quickSnippet.showInfo"
  ],
  "contributes": {
    "commands": [
      {
        "command": "quickSnippet.insertSnippet",
        "title": "Insertar Snippet Rapido",
        "category": "Quick Snippet"
      },
      {
        "command": "quickSnippet.showInfo",
        "title": "Mostrar Informacion",
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
        "command": "quickSnippet.showInfo",
        "key": "ctrl+shift+i",
        "mac": "cmd+shift+i"
      }
    ],
    "menus": {
      "editor/context": [
        {
          "command": "quickSnippet.insertSnippet",
          "when": "editorTextFocus",
          "group": "1_modification@1"
        }
      ],
      "commandPalette": [
        {
          "command": "quickSnippet.insertSnippet",
          "when": "editorIsOpen"
        }
      ]
    }
  }
}
```

## Probar la Extension

### Pasos para Probar:

1. **Compilar**: 
   ```bash
   npm run compile
   ```

2. **Abrir ventana de desarrollo**:
   - Presiona `F5` o usa el menu Debug > Start Debugging
   - Se abrira una nueva ventana de VSCode con tu extension cargada

3. **Probar comandos**:
   - Crea un archivo nuevo (ej: `test.js`)
   - Presiona `Ctrl+Shift+S` para insertar snippet
   - Usa `Ctrl+Shift+P` y busca "Quick Snippet" para ver todos los comandos
   - Click derecho en el editor para ver el menu contextual

4. **Verificar funcionalidad**:
   - ¿Se inserta el console.log?
   - ¿Aparecen los mensajes de informacion?
   - ¿Funcionan los atajos de teclado?

### Solucion de Problemas:

- **Error "command not found"**: Verifica que el comando este registrado en package.json
- **Atajo no funciona**: Asegurate de que el editor tenga foco
- **Extension no se activa**: Revisa los activationEvents en package.json
- **Errores de compilacion**: Ejecuta `npm run lint` para ver problemas

### Comandos de Debug:

```bash
# Ver logs de la extension
# En la ventana de desarrollo, abre Developer Tools (F12)
# Ve a la consola para ver los console.log

# Recargar extension sin cerrar ventana
# Presiona Ctrl+R en la ventana de desarrollo
```

## Extension.ts - Version con Manejo de Errores

```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating Quick Snippet Inserter extension...');

    // Comando principal de insercion
    let insertSnippetCommand = vscode.commands.registerCommand('quickSnippet.insertSnippet', async () => {
        try {
            const editor = vscode.window.activeTextEditor;
            
            if (!editor) {
                vscode.window.showWarningMessage('Por favor, abre un archivo para insertar snippets');
                return;
            }

            // Insertar snippet con soporte para placeholders
            const snippet = new vscode.SnippetString('console.log(${1:mensaje});$0');
            await editor.insertSnippet(snippet);
            
            vscode.window.showInformationMessage('✅ Snippet insertado correctamente!');
            
        } catch (error) {
            console.error('Error inserting snippet:', error);
            vscode.window.showErrorMessage('❌ Error al insertar snippet');
        }
    });

    // Comando de informacion con detalles
    let showInfoCommand = vscode.commands.registerCommand('quickSnippet.showInfo', () => {
        const message = `
🚀 Quick Snippet Inserter v0.0.1

📋 Comandos disponibles:
• Ctrl+Shift+S: Insertar snippet
• Ctrl+Shift+I: Mostrar informacion

🔧 Estado: Activo y funcionando
        `.trim();
        
        vscode.window.showInformationMessage(message, { modal: false });
    });

    context.subscriptions.push(insertSnippetCommand, showInfoCommand);
    
    console.log('Quick Snippet Inserter extension activated successfully!');
}

export function deactivate() {
    console.log('Quick Snippet Inserter extension deactivated');
}
```
