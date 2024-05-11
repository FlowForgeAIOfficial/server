import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, registerUser, updateAccountDetails } from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser);
router.route("/changePassword").post(verifyUser , changeCurrentPassword);
router.route("/getCurrentUser" ).get(verifyUser , getCurrentUser);
router.route("/updateAccount").put(verifyUser , updateAccountDetails);


//secured routes
export default router