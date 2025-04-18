import { test, expect } from 'bun:test'
import db_class from '../module/db'


test('update user name', async () => {
                // connect to db
                console.log(process.env.DB_URL as string, process.env.DB_NAME as string)
                await db_class.init(process.env.DB_URL as string, process.env.DB_NAME as string)

                const user_github_uid: string = ''
                const user_name: string = 'dreaminbb'
                const result: any = await db_class.if_user_name_changed_update_db_user_github_name(user_github_uid, user_name)
                console.log(result)

                expect(result).toBe(true)

})

// test('is code author exist', async () => {
//                 // connect to db
//                 console.log(process.env.DB_URL as string, process.env.DB_NAME as string)
//                 await db_class.init(process.env.DB_URL as string, process.env.DB_NAME as string)

//                 const user_github_uid: string = ''
//                 const result: any = await db_class.fetch_code_use_github_uid(user_github_uid)

//                 if (result === undefined) {
//                                 throw new Error('result is undefined')
//                 }
//                 console.log(result.exist)

//                 expect(result.exist).toBe(true)

// })