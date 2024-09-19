import { register } from "@controllers/registerController"
import { login } from "@controllers/loginController"
import { Router } from "express"

let router: Router = Router()

router.post("/auth/register", register)
router.post("/auth/login", login)

export default router