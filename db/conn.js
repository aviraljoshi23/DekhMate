const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/DekhMate",{
    
}).then(()=>{
    console.log("Connection Successful");
}).catch((err)=>{
    console.log("Connection Faild");
})