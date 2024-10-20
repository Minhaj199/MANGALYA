import { Router } from "express";
import { signup,login,forgotCheckValidate ,otpCreation,otpValidation} from "../controller/userCtrl";

const router=Router()


router.post('/firstBatchData',signup)
router.post('/login',login)
router.post('/forgotEmail',forgotCheckValidate)
router.post('/otpCreation',otpCreation)
router.post('/otpValidation',otpValidation)

export default router