// const modelDescriptionArray = (dropArray  , mapArray) =>{
//     var orderArray = new Array(dropArray.length);
//     for(let i=0 ; i<mapArray.length ; i++){
//         orderArray[i] = mapArray[i].key
//         orderArray[i+1] = mapArray[i].value;
//     }
//     var modelDetailsArray = []
//     for(let i=0 ; i<orderArray.length ; i++){
//         var obj = dropArray.find(a => a.key == orderArray[i]);
//         var functionCode = obj.value;
//         if(functionCode === 'gptNode' || functionCode === 'TextToAudio' || functionCode === 'TextToImage'){
//             var data = obj.data;
//             modelDetailsArray.push({
//                 functionCode, data
//             })
//         }else{
//             modelDetailsArray.push({functionCode : functionCode})
//         }
//     }
//     console.log(modelDetailsArray);
//     return modelDetailsArray;
// }
// export default modelDescriptionArray

import { asyncHandler } from "../asyncHandler";

async function findPath(start, end, path = []) {
    return new Promise((resolve, reject) => {
      path = [...path, start];
      if (start === end) {
        console.log(path);
        resolve();
        return;
      }
      if (!adjacencyList[start]) {
        reject(new Error("Node not found"));
        return;
      }
      const promises = [];
      for (const neighbor of adjacencyList[start]) {
        if (!path.includes(neighbor)) {
          promises.push(findPath(neighbor, end, path));
        }
      }
      Promise.all(promises)
        .then(() => resolve())
        .catch(reject);
    });
  }

 const nodeInfo = (dropArray) =>{
    const mapping = {};

    dropArray.forEach(item => {
        const {key , value  ,data} = item;
        mapping[key] ={value , data};
    })
    return mapping;
};

 const createPaths = asyncHandler(async(req , res , next) =>{
    try {
        const adjacencyList = {};
        req.mapArray.forEach(item => {
            const key = item.key;
            const value  = item.value;
            if(!adjacencyList[key]){
                adjacencyList[key] = [];
            }
            adjacencyList[key].push(value)
        });

        const paths = findPath(req.startNode , req.endNode);
        console.log(paths);

        
        next();
        
    } catch (error) {
        throw new APIError(500 , "Internal server error")
    }
 });



export {
    createPaths,
    nodeInfo
}







