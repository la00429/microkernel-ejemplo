# Paso 1: Configuracion Inicial - Fragmentos de Codigo

## package.json Completo

```json
{
  "name": "quick-snippet-inserter",
  "displayName": "Quick Snippet Inserter",
  "description": "Plugin para insertar rapidamente plantillas de codigo predefinidas",
  "version": "0.0.1",
  "publisher": "tu-nombre",
  "engines": {
    "vscode": "^1.74.0"
  },
  "categories": [
    "Snippets",
    "Productivity",
    "Keymaps"
  ],
  "keywords": [
    "snippets",
    "templates",
    "productivity",
    "code-generation"
  ],
  "activationEvents": [],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [],
    "keybindings": [],
    "configuration": {
      "title": "Quick Snippet Inserter",
      "properties": {
        "quickSnippet.autoSave": {
          "type": "boolean",
          "default": true,
          "description": "Guardar automaticamente snippets personalizados"
        }
      }
    }
  },
  "scripts": {
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./",
    "pretest": "npm run compile && npm run lint",
    "lint": "eslint src --ext ts",
    "test": "node ./out/test/runTest.js",
    "package": "vsce package",
    "publish": "vsce publish"
  },
  "devDependencies": {
    "@types/vscode": "^1.74.0",
    "@types/node": "16.x",
    "@types/mocha": "^10.0.1",
    "@types/glob": "^8.1.0",
    "@typescript-eslint/eslint-plugin": "^5.45.0",
    "@typescript-eslint/parser": "^5.45.0",
    "eslint": "^8.28.0",
    "glob": "^8.1.0",
    "mocha": "^10.1.0",
    "typescript": "^4.9.4",
    "@vscode/test-electron": "^2.2.0",
    "@vscode/vsce": "^2.15.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/tu-usuario/quick-snippet-inserter.git"
  },
  "bugs": {
    "url": "https://github.com/tu-usuario/quick-snippet-inserter/issues"
  },
  "homepage": "https://github.com/tu-usuario/quick-snippet-inserter#readme",
  "license": "MIT"
}
```

## tsconfig.json

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
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "exclude": [
    "node_modules",
    ".vscode-test"
  ]
}
```

## .vscode/launch.json

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
      ],
      "outFiles": [
        "${workspaceFolder}/out/**/*.js"
      ],
      "preLaunchTask": "${workspaceFolder}/npm: compile"
    },
    {
      "name": "Extension Tests",
      "type": "extensionHost",
      "request": "launch",
      "args": [
        "--extensionDevelopmentPath=${workspaceFolder}",
        "--extensionTestsPath=${workspaceFolder}/out/test/suite/index"
      ],
      "outFiles": [
        "${workspaceFolder}/out/test/**/*.js"
      ],
      "preLaunchTask": "${workspaceFolder}/npm: compile"
    }
  ]
}
```

## .vscode/tasks.json

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "npm",
      "script": "compile",
      "group": "build",
      "presentation": {
        "panel": "shared"
      },
      "problemMatcher": "$tsc"
    },
    {
      "type": "npm",
      "script": "watch",
      "isBackground": true,
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "panel": "shared"
      },
      "problemMatcher": "$tsc-watch"
    }
  ]
}
```

## .gitignore

```
out/
node_modules/
.vscode-test/
*.vsix
.DS_Store
.vscode/settings.json
```

## .eslintrc.json

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "@typescript-eslint/naming-convention": [
      "warn",
      {
        "selector": "import",
        "format": ["camelCase", "PascalCase"]
      }
    ],
    "@typescript-eslint/semi": "warn",
    "curly": "warn",
    "eqeqeq": "warn",
    "no-throw-literal": "warn",
    "semi": "off"
  },
  "ignorePatterns": [
    "out",
    "dist",
    "**/*.d.ts"
  ]
}
```

## Comandos para Ejecutar

```bash
# Instalar dependencias
npm install

# Compilar el proyecto
npm run compile

# Compilar en modo watch
npm run watch

# Linting
npm run lint

# Verificar que todo funciona
code . 
# Luego presiona F5 para probar
```
