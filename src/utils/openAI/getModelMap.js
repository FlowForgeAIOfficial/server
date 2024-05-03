function findPath(adjacencyList, startNode, endNode) {
  const paths = [];
  
  const stack = [[startNode]];
  
  while (stack.length > 0) {
      const currentPath = stack.pop();
      
      const currentNode = currentPath[currentPath.length - 1];
      
      if (currentNode === endNode) {
          paths.push(currentPath);
      } else {
          if (adjacencyList[currentNode]) {
              for (const neighbor of adjacencyList[currentNode]) {
                  const newPath = currentPath.concat(neighbor);
                  stack.push(newPath);
              }
          }
      }
  }
  
  return paths;
}



 const nodeInfo = (dropArray) =>{
    const mapping = {};

    dropArray.forEach(item => {
        const {key , value  ,data} = item;
        mapping[key] ={functionCode : value , data};
    })
    return mapping;
};





export {
    nodeInfo,
    findPath
}







