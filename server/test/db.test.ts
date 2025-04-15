import { test, expect } from 'bun:test'
import db_class from '../module/db'


test('is code author exist', async () => {
                // connect to db
                console.log(process.env.DB_URL as string, process.env.DB_NAME as string)
                await db_class.init(process.env.DB_URL as string, process.env.DB_NAME as string)

                const lang: string = ''
                const user_github_uid: string = ''
                const result: boolean | undefined = await db_class.check_code_author_exist(user_github_uid, lang)
                console.log(result)

                expect(result).toBe(true)

                if (result === undefined) {
                                throw new Error('result is undefined')
                }

})