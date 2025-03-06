import { Router, type Response, type Request } from "express"
import db_class from "../module/db";
import { lang_list, error_code_data } from "../config";

const router = Router();

// todo UUIDを生成

router.post('/fetch', async (req: Request, res: Response): Promise<any> => {

                if (!req.body || !req.body.lang || !req.body.key) return res.status(400).send({
                                'error': 'wrong parameter'
                })

                const lang: string = req.body.lang

                if (!lang_list.includes(lang)) return res.status(400).send({
                                'error': 'wrong parameter',
                                code: [error_code_data]
                })


                const collection = db_class.code_collection_obj?.[lang]
                console.log(collection)
                if (!collection) return res.status(500).send({
                                message: 'server error at db',
                                status: 500,
                                code: [error_code_data]
                })

                const code_mount = req.body.mount ?? 10
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
                                code_data: random_codes
                })
})

export default router
