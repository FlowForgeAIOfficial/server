import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { modelDataFrontend } from "../middlewares/modelDataFrontend.middleware.js";
import { generateModel } from "../controllers/openAI.controller.js";

const router = Router()

router.post("/createModel"  , modelDataFrontend , generateModel)

export default router