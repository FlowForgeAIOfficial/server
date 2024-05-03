const getStartEndNode = (dropArray) => {
    try {
        const nodes = []
        dropArray.forEach(element => {
            if(element.value == "input"){
                nodes.push(element.key)
            }
            if(element.value == "output"){
                nodes.push(element.key)
            }
        });
        return nodes
    } catch (error) {
        return error
    }
}

export default getStartEndNode