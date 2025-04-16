import { test, expect } from 'bun:test'
import db_class from '../module/db'


test('is code author exist', async () => {
                // connect to db
                console.log(process.env.DB_URL as string, process.env.DB_NAME as string)
                await db_class.init(process.env.DB_URL as string, process.env.DB_NAME as string)

                const lang: string = 'python'
                const user_github_uid: string = ''
                const result: any = await db_class.check_code_author_exist(user_github_uid, lang)
                if (result === undefined) {
                                throw new Error('result is undefined')
                }
                console.log(result.exist)

                expect(result.exist).toBe(true)

})