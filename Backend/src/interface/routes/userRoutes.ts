import { Router } from "express";
import {
  secondBatch,
  forgotCheckValidateSigunp,
  signup,
  login,
  forgotCheckValidate,
  otpCreation,
  otpValidation,
  changePassword,
  fetechProfileData,
  fetchPlanData,
  addMatch,
  manageReqRes,
  purchasePlan,
  fetchDataForProfile,
  fetchInterest,
  getUserProfile,
  otpForResetPassword,
  otpForUserResetPassword,
  resetPassword,
  editProfile,
  matchedUser,
  deleteMatched,
  reportAbuse,
  fetchSuggestion,
  getChats,
  getMessages,
  createTexts,
  getuserForChat,
 
} from "../controller/userCtrl";
import { userJwtAuthenticator } from "../middlewares/jwtUser";
import { upload } from "../Utility/multer";
import { matchedUsers } from "../../application/useCases/matchedUsers";
const router = Router();

router.post("/login", login);
router.get("/fetchforLanding", fetchDataForProfile);
router.post("/addMatch", userJwtAuthenticator, addMatch);
router.post("/firstBatchData", signup);
router.post("/otpCreation", otpCreation);
router.post("/otpValidation", otpValidation);
router.patch("/changePassword", changePassword);
router.get("/forgotEmail", forgotCheckValidate);
router.patch("/manageReqRes", userJwtAuthenticator, manageReqRes);
router.post("/forgotEmail", forgotCheckValidateSigunp);
router.post("/uploadProfile", upload.single("file"), secondBatch);
router.get("/fetchProfile", userJwtAuthenticator,fetechProfileData);
router.get("/fetchPlanData", fetchPlanData);
router.post("/purchasePlan", userJwtAuthenticator, purchasePlan);
router.get("/getInterest", fetchInterest);
router.get('/getUserProfile',userJwtAuthenticator,getUserProfile )
router.post('/otpRstPsword',userJwtAuthenticator,otpForResetPassword)
router.post('/validateUserOTP',userJwtAuthenticator,otpForUserResetPassword)
router.delete('/deleteMatched',userJwtAuthenticator,deleteMatched)

///////////from userPassword///////////////////


router.patch('/resetPassword',userJwtAuthenticator,resetPassword)
router.put('/editProfile',userJwtAuthenticator,upload.single('file'),editProfile)
router.get('/matchedUsers',userJwtAuthenticator,matchedUser)
router.post('/reportAbuse',userJwtAuthenticator,reportAbuse)
router.get('/fetchSuggestion',userJwtAuthenticator,fetchSuggestion)
router.post('/getChats',userJwtAuthenticator,getChats)
router.post('/createChats',userJwtAuthenticator,createTexts)
router.get('/getMessages/:id',userJwtAuthenticator,getMessages)
router.get('/userForChat/:id',getuserForChat)




export default router;
