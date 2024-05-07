import mongoose , {Schema ,model} from "mongoose"

const modelCoordinateSchema = new Schema(
    {
        modelId : {
            type : Schema.Types.ObjectId,
            ref : "UserAIModel",
            index: true
        },
        coordinateObject : {
            type : mongoose.Schema.Types.Mixed
        }
    },
    {
        timestamps : true
    }
)

export const ModelCoordinate = model("ModelCoordinate" , modelCoordinateSchema)