const mongoose=require('mongoose')
const roomSchema=new mongoose.Schema({
    roomCode:{type:String,required:true,unique:true},
    roomName:{type:String,required:true},
    members:[
        {name:String,joinedAt:{type:Date,default:Date.now} }
    ],
    createdAt:{type:Date,default:Date.now}
})
module.exports=mongoose.model('Room',roomSchema)