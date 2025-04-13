import { test, expect } from 'bun:test'
import check_ts_syntax from "../module/code/syntax";
import format_ts_code from "../module/code/format";

test('check_ts_syntax', async () => {
                const test1 = "async function listAllUsers(): Promise<User[]> {\n    const db = await openDatabase('database.db');\n    try {\n        const users = await db.all(\"SELECT * FROM users\");\n        console.log(`Found ${users.length} users.`);\n        users.forEach(user => console.log(user));\n        return users;\n    } catch (e) {\n        console.error(`An error occurred: ${e}`);\n        return [];\n    } finally {\n        await db.close();\n    }\n}"
                const result = await check_ts_syntax(test1);
                expect(result.valid).toBe(true);
                if (result) {
                                const code = await format_ts_code(test1)
                                console.log(code)
                }
});
