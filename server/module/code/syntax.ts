import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs/promises';
import { exec } from "child_process";
import { promisify } from "util";


class syntax_check {

                async check_ts_syntax(code: string): Promise<{ valid: boolean; error: string }> {
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

                async check_python_syntax(code: string): Promise<{ valid: boolean; error: string }> {

                                const tmp_file = path.join(__dirname, "python_syntax_tmp.py")
                                try {

                                                await fs.writeFile(tmp_file, code);
                                                // Pythonのシンタックスチェックを実行
                                                await promisify(exec)(`python3 -m py_compile ${tmp_file}`);
                                                await fs.unlink(tmp_file);

                                                return { valid: true, error: '' };
                                } catch (e) {
                                                await fs.unlink(tmp_file);
                                                return { valid: false, error: `An error occurred: ${e instanceof Error ? e.message : String(e)}` };
                                }

                }


                async check_rust_syntax(code: string): Promise<{ valid: boolean; date?: string, error: string }> {

                                const date: string = new Date().toISOString().replace(/[-:.]/g, "_");
                                const rust_tmp_file = path.join(__dirname, `rust_syntax_tmp_${date}.rs`)

                                try {
                                                await fs.writeFile(rust_tmp_file, code);
                                                const { stderr } = await promisify(exec)(`rustc --crate-type lib ${rust_tmp_file} -o /tmp/dummy`);
                                                if (stderr) {
                                                                if (stderr.includes("warning: function `main` is never used")) {
                                                                                await fs.unlink("/tmp/dummy").catch(() => { });
                                                                                return { valid: true, date: date, error: '' };
                                                                }

                                                                await fs.unlink(rust_tmp_file).catch(() => { });
                                                                await fs.unlink("/tmp/dummy").catch(() => { });
                                                                return { valid: false, error: `An error occurred: ${stderr}` };
                                                }
                                                
                                                await fs.unlink("/tmp/dummy").catch(() => { });

                                                return { valid: true, date: date, error: '' };
                                } catch (e) {
                                                await fs.unlink(rust_tmp_file).catch(() => { });
                                                await fs.unlink("/tmp/dummy").catch(() => { });
                                                return { valid: false, error: `An error occurred: ${e instanceof Error ? e.message : String(e)}` };
                                }
                }
}

export default new syntax_check()