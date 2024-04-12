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
    
    return modelDetailsArray;
}
export default modelDescriptionArray

