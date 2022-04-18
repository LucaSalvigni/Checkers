function log(msg){
    if(process.env.DEBUG){
        console.log(msg)
    }
}