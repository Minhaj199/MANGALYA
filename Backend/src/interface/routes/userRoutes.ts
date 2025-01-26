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
  MsgCount,
  MessageViewed,
 
  saveImage,
  getNewToken,
 
} from "../controller/userCtrl";


import { userJwtAuthenticator } from "../middlewares/jwtUser";
import { upload } from "../utility/multer";
import { UserRepsitories } from "../../Infrastructure/repositories/userRepository"; 
import { PurchasedPlan } from "../../Infrastructure/repositories/orderRepository";
import { OtpRepository } from "../../Infrastructure/repositories/otpRepository";
import { FeaturesRepository, InterestRepo, TokenRepository } from "../../Infrastructure/repositories/otherRepo";
import { ReportUser } from "../../Infrastructure/repositories/reportUser";
import { ChatRoomRepository } from "../../Infrastructure/repositories/chatRepository";
import { MessageRepository } from "../../Infrastructure/repositories/messageRepository";
import { PlanRepository } from "../../Infrastructure/repositories/planRepositories"; 
import { AuthService } from "../../application/services/authService";
import { Cloudinary } from "../utility/cloudinary"; 
import { BcryptAdapter } from "../../Infrastructure/bcryptAdapter";
import { JWTAdapter } from "../../Infrastructure/jwt";
import { EmailService } from "../../Infrastructure/emailService";
import { PartnerProfileService } from "../../application/services/partnersProfileService";
import { UserProfileService } from "../../application/services/userService";
import { PaymentSerivice } from "../../application/services/paymentService";
import { ReportAbuseService } from "../../application/services/reportAbuseService";
import { ChatService } from "../../application/services/chatService";
import { MessageService } from "../../application/services/messageServie";
import { OtpService } from "../../application/services/OtpService";
import { PlanService } from "../../application/services/planService";
import { FixedDataService } from "../../application/services/InterestAndFeatures";
const router = Router();


const otpService=new OtpService(new UserRepsitories,new OtpRepository,new EmailService)
export const authService=new AuthService(new UserRepsitories,new BcryptAdapter,new JWTAdapter(new TokenRepository))


export const partnerServiece=new PartnerProfileService(new UserRepsitories,new InterestRepo)
export const userProfileService=new UserProfileService(new PlanRepository,new Cloudinary,new UserRepsitories,authService)
const chatRoom=new ChatService(new UserRepsitories,new ChatRoomRepository,new MessageService(new MessageRepository, new ChatRoomRepository,new Cloudinary))
export const messageService=new MessageService(new MessageRepository, new ChatRoomRepository,new Cloudinary)
export const resportAbuserService=new ReportAbuseService(new ReportUser,new EmailService,new UserRepsitories)
const planService=new PlanService(new PlanRepository)
const paymentService=new PaymentSerivice(new PurchasedPlan,new UserRepsitories)
const interestService=new FixedDataService(new InterestRepo,new FeaturesRepository)


router.post("/login",(req,res)=>  login(req,res,authService))
router.post("/firstBatchData",(req,res)=> signup(req,res,authService));
router.get("/fetchforLanding",(req,res)=>fetchDataForProfile(req,res,partnerServiece));
router.post("/otpCreation",(req,res)=>otpCreation(req,res,authService,otpService));
router.post("/otpValidation",(req,res)=> otpValidation(req,res,otpService));
router.patch("/changePassword",(req,res)=> changePassword(req,res,authService));
router.post("/forgotEmail", (req,res)=>forgotCheckValidateSigunp(req,res,otpService));
router.post("/uploadProfile", upload.single("file"),(req,res)=> secondBatch(req,res,userProfileService));
router.get("/forgotEmail",(req,res)=> forgotCheckValidate(req,res,otpService));
router.post("/addMatch", userJwtAuthenticator,(req,res)=> addMatch(req,res,partnerServiece));
router.patch("/manageReqRes", userJwtAuthenticator,(req,res)=> manageReqRes(req,res,partnerServiece));
router.get("/fetchProfile", userJwtAuthenticator,(req,res)=>fetechProfileData(req,res,partnerServiece));
router.get("/fetchPlanData",(req,res)=> fetchPlanData(req,res,planService))
router.post("/purchasePlan", userJwtAuthenticator,(req,res)=>purchasePlan(req,res,paymentService));
router.get("/getInterest",(req,res)=> fetchInterest(req,res,interestService));
router.get('/getUserProfile',userJwtAuthenticator,(req,res)=>getUserProfile(req,res,userProfileService) )
router.post('/otpRstPsword',userJwtAuthenticator,(req,res)=>otpForResetPassword(req,res,otpService))
router.post('/validateUserOTP',userJwtAuthenticator,(req,res)=>otpForUserResetPassword(req,res,otpService))
router.patch('/resetPassword',userJwtAuthenticator,(req,res)=>resetPassword(req,res,authService))
router.delete('/deleteMatched',userJwtAuthenticator,(req,res)=>deleteMatched(req,res,partnerServiece))
router.put('/editProfile',userJwtAuthenticator,upload.single('file'),(req,res)=>editProfile(req,res,userProfileService))
router.get('/matchedUsers',userJwtAuthenticator,(req,res)=>matchedUser(req,res,partnerServiece))
router.post('/reportAbuse',userJwtAuthenticator,(req,res)=>reportAbuse(req,res,resportAbuserService))
router.get('/fetchSuggestion',userJwtAuthenticator,(req,res)=>fetchSuggestion(req,res,partnerServiece))
router.post('/getChats',userJwtAuthenticator,(req,res)=>getChats(req,res,chatRoom))
router.post('/createChats',userJwtAuthenticator,(req,res)=>createTexts(req,res,chatRoom))
router.get('/getMessages/:id',userJwtAuthenticator,(req,res)=>getMessages(req,res,messageService))
router.get('/userForChat/:id',userJwtAuthenticator,(req,res)=>getuserForChat(req,res,chatRoom))
router.get('/countMessages',userJwtAuthenticator,(req,res)=>MsgCount(req,res,messageService))
router.patch('/messageReaded',userJwtAuthenticator,(req,res)=>MessageViewed(req,res,messageService))
router.post('/saveImage',userJwtAuthenticator,upload.single('file'),(req,res)=>saveImage(req,res,messageService))
router.post('/getNewToken',(req,res)=>getNewToken(req,res,authService))


export default router;
