const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    contact:{
        type: String,
        required:true,
    },
    password:{
        type: String,
        required:true
    },
    profileImg:{
        type: String,
        required:true
    },
    is_verified:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:""
    },
    count:{
        type:Number,
        default:2
    },
    personQlt:{
        type:[],
    },

},
//{ typeKey: '$type' }
)
const User = new mongoose.model('User',userSchema);
module.exports = User