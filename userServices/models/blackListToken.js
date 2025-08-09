const mongoose = require('mongoose')

const blaclistTokenSchema = new mongoose.Schema({
    token:{
        type:String,
        require:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

module.exports=mongoose.model('blacklistToken',blaclistTokenSchema)