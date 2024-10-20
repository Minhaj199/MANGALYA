import { Router } from "express";
import { signup,login,forgotCheckValidate ,otpCreation} from "../controller/userCtrl";

const router=Router()


router.post('/signup',signup)
router.post('/login',login)
router.post('/forgotEmail',forgotCheckValidate)
router.post('/otpCreation',otpCreation)

export default router