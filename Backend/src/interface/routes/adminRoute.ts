import { Router } from "express";
import { login,fetechData,fetchFeature,userBlockAndUnblock,addPlan, fetechPlanData,editPlan,softDlt} from "../controller/adminCtrl";
import { adminJwtAuthenticator } from "../middlewares/jwtAdmin";
const router=Router()


router.post('/login',login)

//fetch data to user table
router.get('/fetchData',fetechData)
router.get('/fetchPlanData',fetechPlanData)

router.patch('/block&Unblock',adminJwtAuthenticator,userBlockAndUnblock)
router.post('/insertPlan',addPlan)
router.put('/editPlan',editPlan)
router.patch('/removePlan',softDlt)
router.get('/fetchFeature',fetchFeature)


export default router 
// router.get('/checkToken',tokenAuthenticated)