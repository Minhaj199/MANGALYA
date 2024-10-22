import { Router } from "express";
import { forgotCheckValidateSigunp,signup,login,forgotCheckValidate ,otpCreation,otpValidation,changePassword, fetechProfileData,} from "../controller/userCtrl";

const router=Router()


router.post('/firstBatchData',signup)
router.post('/login',login)
router.get('/forgotEmail',forgotCheckValidate)
router.get('/fetchProfile',fetechProfileData)
router.post('/otpCreation',otpCreation)
router.post('/otpValidation',otpValidation)
router.patch('/changePassword',changePassword)
router.post('/forgotEmail',forgotCheckValidateSigunp)


export default router