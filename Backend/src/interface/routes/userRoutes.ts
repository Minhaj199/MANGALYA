import { Router } from "express";
import { secondBatch,forgotCheckValidateSigunp,signup,login,forgotCheckValidate ,
    otpCreation,otpValidation,changePassword,
    fetechProfileData
    ,addMatch,manageReqRes} from "../controller/userCtrl";
import { userJwtAuthenticator } from "../middlewares/jwtUser";
import { upload } from "../../Infrastructure/multer";
const router=Router()


router.post('/login',login)
router.post('/addMatch',userJwtAuthenticator,addMatch)
router.post('/firstBatchData',signup)
router.post('/otpCreation',otpCreation)
router.post('/otpValidation',otpValidation)
router.patch('/changePassword',changePassword)
router.get('/forgotEmail',forgotCheckValidate)
router.patch('/manageReqRes',manageReqRes)
router.post('/forgotEmail',forgotCheckValidateSigunp)
router.post('/uploadProfile',upload.single('file'),secondBatch)
router.get('/fetchProfile',userJwtAuthenticator,fetechProfileData)



export default router