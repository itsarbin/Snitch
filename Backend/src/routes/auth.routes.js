import { Router } from "express";
import { validateRegisterUser,vlidateLoginUser } from "../validator/auth.validator.js";
import { register, login} from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post('/register', validateRegisterUser, register);
authRouter.post('/login', vlidateLoginUser, login)

export default authRouter;