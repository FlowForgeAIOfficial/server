import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import {  generateModelUrl } from "../middlewares/openAI.middleware.js";
import { useModel , getModels, getModel , saveCoordinates,getModelAxes , deleteModel} from "../controllers/openAI.controller.js";
import textToImage from "../utils/openAI/textToImage.js";
import { createPaths } from "../middlewares/openAI.middleware.js";
const router = Router()

router.route("/deployModel").post( verifyUser ,createPaths ,   generateModelUrl ,saveCoordinates );  //dropArray , mapArray , startNode ,endNode , coordinateObject
router.route("/useModel").post(useModel);
router.route("/getModels").get(verifyUser,getModels );
router.route("/getModel").get(verifyUser , getModel);
router.route("/getModelAxes").get(verifyUser , getModelAxes);
router.route('/deleteModel').delete(verifyUser , deleteModel)


router.route("/textToImage").post(textToImage);

export default router

// click deploy -> create model flow array with input values
// -> generate url based on the flow and save model flow and modelUrl in db
//  create a route which allows the user to get all models
//  create a route which allows the user to get model
// create a route which allows user to use the url to pass the data and use model
