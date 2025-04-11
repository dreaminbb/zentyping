import { Router, type Response, type Request } from "express"
import { randomUUIDv7 } from "bun";
import { config } from "../config";
import { create_token } from "../module/auth/jwt";
import { handle_sign_in } from "../module/auth/signin_login";

const router = Router();

router.post('/token', async (req: Request, res: Response): Promise<any> => {

                const sub: string = randomUUIDv7()
                console.log(config.PRODUCTION ?? req.body.username)

                try {
                                const token = create_token({ sub: sub, iat: Date.now() })
                                return res.status(200).send({
                                                message: 'success',
                                                status: 200,
                                                token: token
                                })
                } catch (e) {
                                console.error(e)
                                return res.status(500).send({
                                                message: 'server error',
                                                status: 500,
                                })
                }

})


router.post('/signin', async (req: Request, res: Response): Promise<any> => {

                const user_github_id: string = req.body.github_user_id
                console.log('\x1b[32m%s\x1b[0m', user_github_id)
                console.log(req.body)

                if (user_github_id === null || undefined) {
                                return res.status(400).send({
                                                message: 'github_id is required',
                                                status: 400,
                                })
                }

                const response = await handle_sign_in(user_github_id)
                console.log(response)

                if (response.token) {
                                console.log('there is a token')
                                res.status(response.status).cookie('jwt', response.token, {
                                                httpOnly: true,
                                                secure: config.PRODUCTION,
                                                sameSite: 'strict',
                                                maxAge: 1000 * 60 * 60 * 24 * 3 // 3 days
                                }).send({
                                                message: response.message,
                                                status: response.status,
                                })
                } else {
                                res.status(response.status).send(response)
                }

                if (!response.token) {
                                return res.status(response.status).send({
                                                message: response.message,
                                                status: response.status,
                                })
                }
})

export default router