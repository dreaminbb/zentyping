import prettier from "prettier";
import * as path from "path"
import * as  fs from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";

class format_code {


                add_char_line_break(code: string): string {
                                return code.replace(/\n/g, '\\n')
                }

                async format_ts_code(params: string): Promise<string | undefined> {

                                try {

                                                const formatted = await prettier.format(params, {
                                                                parser: "typescript",
                                                                plugins: [require("prettier/parser-typescript")],
                                                });

                                                return this.add_char_line_break(formatted);
                                } catch (error) {
                                                console.error("Prettier formatting error:", error);
                                                return undefined;
                                }

                }

                async format_python_code(params: string): Promise<string | undefined> {
                                const python_tmp_file = path.join(__dirname, "python_format_tmp.py")
                                try {


                                                await fs.writeFile(python_tmp_file, params)

                                                await promisify(exec)(`black ${python_tmp_file}`);

                                                const formatted_python_code = await fs.readFile(python_tmp_file, 'utf-8');

                                                await fs.unlink(python_tmp_file);

                                                return this.add_char_line_break(formatted_python_code) as string

                                } catch (e) {
                                                await fs.unlink(python_tmp_file);
                                                console.error("Prettier formatting error:", e);
                                                return undefined
                                }
                }

                async format_rust_code(params: string, date: string): Promise<string | undefined> {

                                const rust_tpm_file_syntax_cherked = path.join(__dirname, `rust_syntax_tmp_${date}.rs`)
                                

                                try {

                                                await fs.writeFile(rust_tpm_file_syntax_cherked, params);

                                                await promisify(exec)(`rustfmt ${rust_tpm_file_syntax_cherked}`);

                                                const formatted_rust_code: string = await fs.readFile(rust_tpm_file_syntax_cherked, 'utf-8');

                                                await fs.unlink(rust_tpm_file_syntax_cherked); // 成功したら一時ファイルを削除

                                                return this.add_char_line_break(formatted_rust_code) as string

                                } catch (e) {
                                                await fs.unlink(rust_tpm_file_syntax_cherked);
                                                console.error("Prettier formatting error:", e);
                                                return undefined
                                }
                }
}


export default new format_code()