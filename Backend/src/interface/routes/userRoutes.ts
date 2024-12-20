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
} from "../controller/userCtrl";
import { userJwtAuthenticator } from "../middlewares/jwtUser";
import { upload } from "../Utility/multer";
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
router.get("/fetchProfile", userJwtAuthenticator, fetechProfileData);
router.get("/fetchPlanData", fetchPlanData);
router.post("/purchasePlan", userJwtAuthenticator, purchasePlan);
router.get("/getInterest", fetchInterest);
// router.post("/payment", subscriptionPayment);

export default router;
