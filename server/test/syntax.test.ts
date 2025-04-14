import { test, expect } from 'bun:test'
import syntax_cherk from "../module/code/syntax";
import format_code from "../module/code/format";

// test('check_ts_syntax_and_format', async () => {
//                 const test1 = "async function listAllUsers(): Promise<User[]> {\n    const db = await openDatabase('database.db');\n    try {\n        const users = await db.all(\"SELECT * FROM users\");\n        console.log(`Found ${users.length} users.`);\n        users.forEach(user => console.log(user));\n        return users;\n    } catch (e) {\n        console.error(`An error occurred: ${e}`);\n        return [];\n    } finally {\n        await db.close();\n    }\n}"
//                 const result = await syntax_cherk.check_ts_syntax(test1);
//                 expect(result.valid).toBe(true);

//                 if (result.valid === true) {
//                                 const code: undefined | string = await format_code.format_ts_code(test1)
//                                 console.log(code)
//                 }
// });


// test('check_python_syntax_and_format', async () => {
//                 const test2: string = "def update_user_info(user_id, new_email):\n    conn = sqlite3.connect('database.db')\n    cursor = conn.cursor()\n    try:\n        cursor.execute(\"UPDATE users SET email = ? WHERE id = \", (new_email, user_id))\n        conn.commit()\n        print(f\"User {user_id} updated successfully.\")\n    except sqlite3.Error as e:\n        print(f\"An error occurred: {e}\")\n    finally:\n        conn.close()"
//                 const result = await syntax_cherk.check_python_syntax(test2);
//                 console.log(result)
//                 expect(result.valid).toBe(true);

//                 if (result.valid === true) {
//                                 const code: undefined | string = await format_code.format_python_code(test2)
//                                 console.log(code)
//                 }
// })

test('check_rust_sysntax_and_format', async () => {
                const test3: string = "fn main() {\n    let x = 5;\n    let y = 10;\n    let sum = x + y;\n    println!(\"The sum of {} and {} is {}\", x, y, sum);\n}\n"
                const result = await syntax_cherk.check_rust_syntax(test3);
                console.log(result)
                expect(result.valid).toBe(true);

                if (result.valid === true) {
                                const code: undefined | string = await format_code.format_rust_code(test3, result.date as string)
                                console.log(code)
                                expect(code).not.toBeUndefined();
                }
})
