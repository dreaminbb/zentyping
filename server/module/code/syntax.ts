import * as ts from 'typescript';

async function check_ts_syntax(code: string): Promise<{ valid: boolean; error: string }> {
                try {
                                // Create a virtual file system
                                const fileName = 'code.ts';
                                const fileMap = new Map<string, string>();
                                fileMap.set(fileName, code);

                                // Properly configure compiler options to avoid conflicts with built-in types
                                const compilerOptions: ts.CompilerOptions = {
                                                noEmit: true,
                                                target: ts.ScriptTarget.ESNext,
                                                module: ts.ModuleKind.ESNext,
                                                esModuleInterop: true,
                                                strict: false, // Set to false to allow more flexible syntax checking
                                                noImplicitAny: false,
                                                skipLibCheck: true,
                                                // Avoid DOM library to prevent conflicts with built-in fetch declaration
                                                lib: ['esnext'], // Only include ESNext features, not DOM
                                                types: [] // No additional type definitions
                                };

                                // Create language service host
                                const serviceHost: ts.LanguageServiceHost = {
                                                getScriptFileNames: () => [fileName],
                                                getScriptVersion: () => '1',
                                                getScriptSnapshot: (name) => {
                                                                if (name === fileName) {
                                                                                return ts.ScriptSnapshot.fromString(code);
                                                                }
                                                                const lib = ts.getDefaultLibFilePath(compilerOptions);
                                                                if (name === lib) {
                                                                                return ts.ScriptSnapshot.fromString(''); // Empty lib content
                                                                }
                                                                return undefined;
                                                },
                                                getCurrentDirectory: () => '',
                                                getCompilationSettings: () => compilerOptions,
                                                getDefaultLibFileName: () => 'lib.d.ts',
                                                fileExists: (path) => path === fileName || path === 'lib.d.ts',
                                                readFile: (path) => path === fileName ? code : '',
                                                readDirectory: () => []
                                };

                                // Create language service
                                const languageService = ts.createLanguageService(serviceHost);

                                // Check for syntax and semantic errors
                                const syntacticDiagnostics = languageService.getSyntacticDiagnostics(fileName);

                                if (syntacticDiagnostics.length > 0) {
                                                // Only check basic syntax, not semantic errors related to types
                                                const formatHost: ts.FormatDiagnosticsHost = {
                                                                getCanonicalFileName: path => path,
                                                                getCurrentDirectory: () => '',
                                                                getNewLine: () => '\n'
                                                };

                                                const errors = syntacticDiagnostics.map(diagnostic => {
                                                                if (diagnostic.file) {
                                                                                const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
                                                                                return `Error: ${message}`;
                                                                } else {
                                                                                return ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
                                                                }
                                                }).join('\n');
                                                return { valid: false, error: errors };
                                }

                                return { valid: true, error: '' };
                } catch (e) {
                                return { valid: false, error: `An error occurred: ${e instanceof Error ? e.message : String(e)}` };
                }
}

export default check_ts_syntax;