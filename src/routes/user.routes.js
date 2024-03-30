import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, registerUser, updateAccountDetails } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser);
router.route("/changePassword" , verifyJwt , changeCurrentPassword);
router.route("/getCurrentUser" , verifyJwt , getCurrentUser);
router.route("/updateAccount" , verifyJwt , updateAccountDetails);


//secured routes
export default router