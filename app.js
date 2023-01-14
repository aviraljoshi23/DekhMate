const express = require("express");
const homeRoute  = require('./routes/homeRoute');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'));
require("./db/conn");
app.set("view engine","ejs");


app.use("/",homeRoute);
app.listen(port,(req,res)=>{
    console.log(`listening on http://localhost:${port}`);
})

