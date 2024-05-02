const modelDescriptionArray = (dropArray  , mapArray) =>{
    var orderArray = new Array(dropArray.length);
    for(let i=0 ; i<mapArray.length ; i++){
        orderArray[i] = mapArray[i].key
        orderArray[i+1] = mapArray[i].value;
    }
    var modelDetailsArray = []
    for(let i=0 ; i<orderArray.length ; i++){
        var obj = dropArray.find(a => a.key == orderArray[i]);
        var functionCode = obj.value;
        if(functionCode === 'gptNode' || functionCode === 'TextToAudio' || functionCode === 'TextToImage'){
            var data = obj.data;
            modelDetailsArray.push({
                functionCode, data
            })
        }else{
            modelDetailsArray.push({functionCode : functionCode})
        }
    }
    console.log(modelDetailsArray);
    return modelDetailsArray;
}
export default modelDescriptionArray

// export const nodeInfo = (dropArray) =>{
//     const mapping = {};

//     dropArray.forEach(item => {
//         const {key , value  ,data} = item;
//         mapping[key] ={value , data};
//     })
//     return mapping;
// };

// export const createAdjacencyList = (mapArray) => {
//     const adjacencyList = {};

//     mapArray.forEach(item => {
//         const key = item.key;
//         const value  = item.value;
//         if(!adjacencyList[key]){
//             adjacencyList[key] = [];
//         }
//         adjacencyList[key].push(value)
//     });
//     return adjacencyList;
// };







