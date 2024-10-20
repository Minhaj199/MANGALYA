import { Router } from "express";
import { login,fetechData } from "../controller/adminCtrl";

const router=Router()


router.post('/login',login)

//fetch data to user table
router.get('/fetchData',fetechData)

export default router 