const mongoose=require('mongoose')

const postSchema=mongoose.Schema({
    createdBy:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    postType:{
        type:String,
        required:true
    },
    likes:{
        type:Number,
        default:0
    },
    likedBy:[],
    posts:[{url:{type:String},uid:{type:String},fileType:{type:String}}],
    createdAt:{
        type:Date,
        default:Date.now
    },
    isPublic:{
        type:Boolean
    },
})
module.exports=new mongoose.model("Post",postSchema)