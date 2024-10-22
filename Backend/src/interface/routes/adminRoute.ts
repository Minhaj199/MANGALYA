import { Router } from "express";
import { login,fetechData,userBlockAndUnblock} from "../controller/adminCtrl";
import { adminJwtAuthenticator } from "../middlewares/jwtAdmin";
const router=Router()


router.post('/login',login)

//fetch data to user table
router.get('/fetchData',adminJwtAuthenticator,fetechData)

router.patch('/block&Unblock',adminJwtAuthenticator,userBlockAndUnblock)

export default router 
// router.get('/checkToken',tokenAuthenticated)