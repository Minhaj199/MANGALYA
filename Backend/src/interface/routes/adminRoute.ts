import { Router } from "express";
import { login,fetechData,userBlockAndUnblock,tokenAuthenticated } from "../controller/adminCtrl";
import { adminJwtAuthenticator } from "../middlewares/jwtAdmin";
const router=Router()


router.post('/login',login)

//fetch data to user table
router.get('/fetchData',adminJwtAuthenticator,fetechData)
router.get('/checkToken',tokenAuthenticated)
router.patch('/block&Unblock',adminJwtAuthenticator,userBlockAndUnblock)

export default router 