import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { generateModelDescriptionArray , generateModelUrl } from "../middlewares/openAI.middleware.js";
import { useModel , getModels, getModel , saveCoordinates,getModelAxes , deleteModel} from "../controllers/openAI.controller.js";
import textToImage from "../utils/openAI/textToImage.js";
const router = Router()

router.route("/deployModel").post( verifyJwt ,generateModelDescriptionArray ,   generateModelUrl ,saveCoordinates );
router.route("/useModel").post(verifyJwt ,useModel);
router.route("/getModels").get(verifyJwt , getModels);
router.route("/getModel").get(verifyJwt , getModel);
router.route("/getModelAxes").get(verifyJwt , getModelAxes);
router.route('/deleteModel').delete(verifyJwt , deleteModel)

router.route("/textToImage").post(textToImage);

export default router

// click deploy -> create model flow array with input values
// -> generate url based on the flow and save model flow and modelUrl in db
//  create a route which allows the user to get all models
//  create a route which allows the user to get model
// create a route which allows user to use the url to pass the data and use model