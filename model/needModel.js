const mongoose = require("mongoose")

const needModuleSchema = new mongoose.Schema({
    houseArea:{
        type: String,
        required:true
    },
    userEmail:{
        type: String,
        required:true
    },
    roomtype:{
        type: String,
        required:true
    },
    houseOccupany:{
        type: String,
        required:true
    },
    houseRent:{
        type: String,
        required:true,
    },
    Contact:{
        type: String,
        required:true,
    },
    dateToShift:{
        type: String,
        required:true,
    },
    gender:{
        type: String, 
        required:true
    },
    decription:{
        type: String, 
        required:true
    },
    lookingFor:{
        type: String, 
        required:true
    }
},
)
const NeedModule = new mongoose.model('Needed',needModuleSchema);
module.exports = NeedModule