async function format_ts_code(params: string) {

                const prettier = await import("prettier");
                const formatted = await prettier.format(params, {
                                parser: "typescript",
                                plugins: [require("prettier/parser-typescript")],
                });
                const chenge_line_break_to_unix: string = formatted.replace(/\n/g, '\\n')

                return chenge_line_break_to_unix;

}

export default format_ts_code;