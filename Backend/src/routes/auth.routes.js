import { Router } from "express";
import { validateRegisterUser,vlidateLoginUser } from "../validator/auth.validator.js";
import { register, login, googleAuthCallback} from "../controller/auth.controller.js";
import passport from "passport";

const authRouter = Router();

authRouter.post('/register', validateRegisterUser, register);
authRouter.post('/login', vlidateLoginUser, login)
authRouter.get('/google',passport.authenticate("google",{scope:["profile","email"]}))
authRouter.get('/google/callback', passport.authenticate("google",{session:false}), googleAuthCallback)

export default authRouter;