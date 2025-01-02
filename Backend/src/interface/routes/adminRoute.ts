import { Router } from "express";
import { login,fetechData,
    fetchFeature,
    userBlockAndUnblock,
    addPlan,
    fetechPlanData,editPlan,
    softDlt,
    fetchDashData,
    sendWarningMails,
    getReports,
    blockAbuser,
    rejecReport,
    reportToggle,
    deleteMsg
} from "../controller/adminCtrl";
import { adminJwtAuthenticator } from "../middlewares/jwtAdmin";
const router=Router()


router.post('/login',login)

//fetch data to user table
router.get('/fetchData',fetechData)
router.get('/fetchPlanData',fetechPlanData)

router.patch('/block&Unblock',adminJwtAuthenticator,userBlockAndUnblock)
router.post('/insertPlan',adminJwtAuthenticator,addPlan)
router.put('/editPlan',adminJwtAuthenticator,editPlan)
router.patch('/removePlan',adminJwtAuthenticator,softDlt)
router.get('/fetchFeature',adminJwtAuthenticator,fetchFeature)
router.get('/getDataToDash',adminJwtAuthenticator,fetchDashData)
router.patch('/sendWarningMale',adminJwtAuthenticator,sendWarningMails)
router.patch('/blockAbuser',adminJwtAuthenticator,blockAbuser)
router.get('/getReports',adminJwtAuthenticator,getReports)
router.patch('/rejecReport',adminJwtAuthenticator,rejecReport)
router.patch('/reportToggle',adminJwtAuthenticator,reportToggle)
router.delete('/deleteMsg',adminJwtAuthenticator,deleteMsg)




export default router 
// router.get('/checkToken',tokenAuthenticated)