const mongoose = require("mongoose")

const homeModuleSchema = new mongoose.Schema({
    userEmailId:{
        type:String,
        required:true
    },
    houseAddress:{
        type: String,
        required:true
    },
    houseType:{
        type: String,
        required:true
    },
    houseRent:{
        type: String,
        required:true,
    },
    houseRequiredRoomate:{
        type: String, 
        required:true
    },
    gender:{
        type: String, 
        required:true
    },
    houseImage1:{
        type: String, 
    },
    houseImage2:{
        type:String,
    },
    houseImage3:{
        type: String, 
    },
    houseDescription:{
        type:String,
        required:true
    }, 
    features:{
        type:Array
    }
},
)
const HomeModule = new mongoose.model('Houses',homeModuleSchema);
module.exports = HomeModule