import { Router, type Response, type Request } from "express"
import db_class from "../module/db";
import { available_code_list, error_code_data } from "../config";
import { config } from "../config";

const router = Router();

// todo UUIDを生成

router.post('/fetch', async (req: Request, res: Response): Promise<any> => {


                const lang: string = req.body.lang
                const code_mount: number = req.body.mount
                console.info('lang:', lang, 'code_mount:', code_mount)
                console.log(req.body, 'req body')

                if (!req.body || !code_mount) {
                                if (!config.PRODUCTION) {
                                                console.log('request body is empty')
                                                console.log(!req.body)
                                                console.log(!code_mount)
                                                console.log(code_mount, typeof code_mount)
                                }
                                return res.status(400).send({
                                                'error': 'wrong parameter'
                                })
                }


                if (!available_code_list.includes(lang) && lang !== 'all') {

                                if (!config.PRODUCTION) {
                                                console.log('lang is not available')
                                }

                                return res.status(400).send({
                                                'error': 'wrong parameter',
                                                code: [error_code_data]
                                })

                }

                // If req parameter has mount butno lang return all lang code data each mount.
                // This process is only when user first access to the site.
                if (lang === 'all' && code_mount) {

                                const res_data: { [key: string]: Array<object> } = {}

                                for (const lang of available_code_list) {


                                                const collection = db_class.code_collection_obj?.[lang]

                                                console.log(collection ? 'collection is available' : 'collection is not available')

                                                if (!collection) return res.status(500).send({
                                                                message: 'server error at db',
                                                                status: 500,
                                                                code: [error_code_data]
                                                })

                                                const random_codes: Array<object> = (await collection.aggregate([
                                                                { $sample: { size: code_mount as number } }
                                                ]).toArray())

                                                if (!random_codes) return res.status(500).send({
                                                                message: 'server error',
                                                                status: 500,
                                                                code: [error_code_data]
                                                })

                                                res_data[lang as string] = random_codes
                                }

                                return res.status(200).send({
                                                message: 'success',
                                                status: 200,
                                                data: res_data
                                })
                }

                //* If req parameter has lang
                const collection = db_class.code_collection_obj?.[lang]

                if (!collection) return res.status(500).send({
                                message: 'server error at db',
                                status: 500,
                                code: [error_code_data]
                })


                const random_codes: Array<object> = (await collection.aggregate([
                                { $sample: { size: code_mount as number } }
                ]).toArray())

                if (!random_codes) return res.status(500).send({
                                message: 'server error',
                                status: 500,
                                code: [error_code_data]
                })

                return res.status(200).send({
                                message: 'success',
                                status: 200,
                                code: random_codes
                })
})

export default router
