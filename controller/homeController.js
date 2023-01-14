const express = require("express");
const path = require('path');
const user = require("../model/userModel");
const homeModal = require("../model/homeModel");
const needModal = require("../model/needModel");
const nodemailer = require("nodemailer");
const randomStrings = require("randomstring");
const config = require("../config/config")


// Render this Pages 
//================================================================//
exports.homePage = (req, res) => {
    console.log("Home Page");
    res.render("index");
} //======================================//
exports.loginPage = async (req, res) => {
    console.log("Login Page");
    res.render("login");
} //======================================//
exports.signupPage = (req, res) => {
    console.log("Sign Page");
    res.render("signup");
} //======================================//
exports.AddHousePage = (req, res) => {
    console.log("AddHouse Page");
    res.render("AddHouse");
} //======================================//
exports.addListingPage = (req, res) => {
    console.log("add listing page");
    res.render("addlisting");
} //======================================//
exports.roomslistPage = (req, res) => {
    console.log("Rooms Page");
    homeModal.find({}, function (err, data) {
        user.find({}, function (err, detail) {
            res.render("roomsPage", {
                houseList: data,
                lister: detail
            });
        })
    })
} 

//======================================//
exports.NeedHousePage = (req, res) => {
    console.log("NeedHouse Page");
    res.render("NeedHouse");
} //======================================//



exports.roomNeedPage = (req, res) => {
    console.log("Need Room Page");
    needModal.find({lookingFor:"Room"}, function (err, data) {
            user.find({}, function (err, detail) {
                user.findOne({_id:req.session.user_id },function(err,current_user){
                    console.log(current_user);
                    res.render("NeedRoomPage", {
                    needHouseList: data,
                    lister: detail,
                    user:current_user
                });
            })
        })
    })
}


//======================================//
exports.profilePage = (req, res) => {
    user.findOne({ _id: req.session.user_id }, function (err, detail) {
        res.render("profile", {
            user: detail
        });
    })
} //======================================//


exports.deleteProfile= (req, res) => {
    try{
    user.findOne({_id:req.params.id}, async function (err, result){
        
        
        homeModal.deleteOne({userEmailId:result.email})
        .then(() =>{
            console.log("Email match, room lister data deleted");
        })
        .catch(err=>{
            res.send(err);
        });
    
        needModal.deleteOne({userEmail:result.email})
        .then(() =>{
            console.log("Email match, needroom data deleted");
        })
        .catch(err=>{
            res.send(err);
        });
    
        user.deleteOne({_id:req.params.id})
        .then(() =>{
            console.log("id match, user deleted")
            req.session.destroy();
            res.redirect("/")
        })
        .catch(err=>{
            res.send(err);
        });
        
    })}catch(err){console.log(err);}
    }
    

//================================================================//


// Render signup page [ create new account ]
//================================================================//
exports.signupPost = ("/signup", async (req, res) => {

    try {
        user.findOne({ email: req.body.email }, async function (err, result) {
            if (err) {
                console.log(err);
            }
            if (result) {
                res.render('signup', { message: "This Email Already Exist" });
            }
            else {
                console.log(req.body);
                
                const registeruser = new user({
                    name: req.body.name,
                    email: req.body.email,
                    contact: req.body.contact,
                    password: req.body.password,
                    profileImg: "userDefault.jpg",
                    personQlt:req.body.check1
                })
                const userData = await registeruser.save();
                if (userData) {
                    sentVerifyMail(req.body.name, req.body.email, userData._id)
                    res.redirect('/');
                    console.log("Data Send");
                }
            }
        })
    }
    catch (error) {
        res.status(400).send(error);
        res.send("Registration Failed");
    }
})
//================================================================//

// Send a mail to user to verify DekhMate account via email 
//================================================================//
const sentVerifyMail = async (name, email, user_id) => {
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.emailUser,
                pass: config.emailPassword,
            }
        });
        const mailOption = {
            from: config.emailUser,
            to: email,
            subject: "For Verification Mail",
            html: '<p> Hi ' + name + ' You have succefully loged-in to (Click Here to verify):-  <a href="http://localhost:3000/verify?id=' + user_id + '">Verify Mail</a>'
        }
        transporter.sendMail(mailOption, function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Email Send ", data.response);
            }
        })
    }
    catch (err) {
        console.log(err.message);
    }
}
//================================================================//

// Verify User acount
//================================================================//
exports.accountVerification = (req, res) => {
    console.log("Account Verification Page");
    res.render("pleaseVerifiy");
}
//================================================================//

// Render Page after verifying email
//================================================================//
exports.verifyMail = async (req, res) => {
    try {

        const updateInfo = await user.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 } });
        console.log(updateInfo);
        res.render("email-verified");

    } catch (error) {
        console.log(error);

    }
}
//================================================================//


// Render Login page
//================================================================//
exports.loginPost = async (req, res) => {

    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}
//================================================================//

// Login verification
//================================================================//
exports.verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await user.findOne({ email: email })
        if (userData) {
            if (userData.password == password) {
                if (userData.is_verified === 0) {
                    res.render('login', { message: "Please verify your mail" });
                }
                else {
                    req.session.user_id = userData._id;
                    res.redirect('/');
                }
            }
            else {
                res.render('login', { message: "Email & Password is incorrect" });
            }
        }
        else {
            res.render('login', { message: "Email & Password is incorrect" });
        }
    } catch (error) {

    }
}



exports.NeedHousePost = ("/NeedHouse", async (req, res) => {
    try{
        needModal.findOne({userEmail:req.body.email},function (err, result) {
            if(err){
                console.log(err);
            }
            if (result) {
                res.render('NeedHouse', { message: "This Email Has Already put request" });
            }
            else {
                console.log(req.body);
                const personToList = new needModal({
                    houseArea: req.body.area,
                    userEmail: req.body.email,
                    houseOccupany: req.body.Occupany,
                    roomtype: req.body.type,
                    houseRent: req.body.rent,
                    gender: req.body.gender,
                    Contact: req.body.contact,
                    dateToShift: req.body.shiftingDate,
                    decription: req.body.description,
                    lookingFor: "Room"
                })
                const added = personToList.save();
                res.status(201).render("index");
                console.log("Data Send");
            }
            
        })
    }
    catch (error) {
        res.status(400).send(error);
        res.send("Something went wrong");
    }
})



//================================================================//


exports.forgetPassword = async (req, res) => {
    try {
        res.render("forget");
    }
    catch (error) {
        console.log(error.message);
    }
}
exports.forgetVerify = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await user.findOne({ email: email },)
        console.log(userData);
        if (userData) {
            if (userData.is_verified === 0) {
                res.render("forget", { message: "User email is not verified." })
            }
            else {
                const randomString = randomStrings.generate();
                const updateData = await user.updateOne({ email: email }, { $set: { token: randomString } });
                sentResetMail(userData.name, userData.email, randomString)
                res.render("forget", { message: "PLease check your mail to reset your password" })
            }
        }
        else {
            res.render("forget", { message: "user email is incorrect." });
        }
    }
    catch (error) {
        console.log(error.message);
    }
}
exports.forgetPasswordLoad = async (req, res) => {
    try {
        const token = req.query.token;
        const tokenData = await user.findOne({ token: token });
        if (tokenData) {
            res.render("forget-password", { user_id: tokenData._id });
        }
        else {
            res.render("404", { message: "Token is invalid" });
        }
    }
    catch (error) {
        console.log(error.message)
    }
}
exports.resetPassword = async (req, res) => {
    try {
        const password = req.body.password;
        const user_id = req.body.user_id;

        const updateData = await user.findByIdAndUpdate({ _id: user_id }, { $set: { password: password, token: "" } })
        res.redirect("/");
    }
    catch (error) {
        console.log(error.message);
    }
}

// send forgot password verify 

const sentResetMail = async (name, email, token) => {
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.emailUser,
                pass: config.emailPassword,
            }
        });
        const mailOption = {
            from: config.emailUser,
            to: email,
            subject: "For Reset password",
            html: '<p> Hi ' + name + ' Please click here to  <a href="http://localhost:3000/forget-password?token=' + token + '">Reset</a> your password'
        }
        transporter.sendMail(mailOption, function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Email Send ", data.response);
            }
        })
    }
    catch (err) {
        console.log(err.message);
    }
}
//=========================================================//
exports.logout = async (req, res) => {
    try {
        req.session.destroy();
        // res.redirect("/");
        res.render("index");
    }
    catch (error) {
        console.log(error)
    }
} //======================================//
const ContactMail = async(name,email,subject,message)=>{
    try{
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'dekhmate@gmail.com',
              pass: 'ttdaoildtavgjooc',
            }
          });
        const mailOption = {
            from:'dekhmate@gmail.com',
            to:email,
            subject:"ThankYou Mail from DekhMate",
            html:'<h3>'+subject+'</h3> <h4>'+message+'</h4><p> Hi Happy to inform you that'+ name +' has showned interest in you'
        }
        transporter.sendMail(mailOption,function(err,data){
            if(err){
                console.log(err);
            }
            else{
                console.log("Email Send ",data.response);
            }
        })
    }
    catch(err){
    }
}
exports.HomeContact = ("/index",(req,res)=>{
    try{
        console.log(req.body); 
        ContactMail(req.body.name,req.body.email,req.body.subject,req.body.message)
        // res.status(201).render("index");
        console.log("Data Send");      
    }
    catch(error){
        res.status(400).send(error);
        res.send("mail Failed");
    }
})

exports.profilePost = async (req, res) => {
    try{
        if(req.file){
            const userdata= await user.findByIdAndUpdate({_id:req.body.user_id},{$set:{
                name:req.body.fullName,
                email:req.body.email,
                contact:req.body.phone,
                profileImg: req.file.filename,
                personQlt:req.body.check1
            }})
         }
        else{
          const userdata= await user.findByIdAndUpdate({_id:req.body.user_id},{$set:{
                name:req.body.fullName,
                email:req.body.email,
                contact:req.body.phone,
                personQlt:req.body.check1
            }});
         }

         if(req.body.newpassword && req.body.renewpassword ){
            if(req.body.newpassword == req.body.renewpassword ){
            const userdata= await user.findByIdAndUpdate({_id:req.body.user_id},{$set:{
               password:req.body.renewpassword
              }
            });
            }
            else{
                console.log("Wrong Password")
            }         }
        res.redirect('/profile');
    }catch(error){
         console.log(error.message);
    } }

    const sendRequestMail = async(email,message,sender,count)=>{
        console.log(sender);
          try{
              var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'dekhmate@gmail.com',
                    pass: 'ttdaoildtavgjooc',
                  }
                });
              const mailOption = {
                  from:'dekhmate@gmail.com',
                  to:email,
                  subject:"Update from DekhMate",
                  html:'<h2> Hey Are you looking for the house </h2> <h3>'+message+'</h3><p> Hi '+email+' <br> '+sender+' made a request to contact with you. '
              }
              transporter.sendMail(mailOption,function(err,data){
                  if(err){
                      console.log(err);
                  }
                  else{
                      console.log("Email Send ",data.response);
                  }
              })
          }
          catch(err){
          }
      }
  
  exports.NeedHouseRequest = ("/NeedRoomPage",(req,res)=>{
          try{
              user.findOne({ _id: req.session.user_id }, function (err, detail) {
              console.log(detail.email); 
              user.updateOne({_id: req.session.user_id }, { $set: { is_count:detail.is_count-1 } });
              sendRequestMail(req.body.reciver,req.body.message,detail.email,detail.is_count)
              console.log("Data Send");
          })}
          catch(error){
              res.status(400).send(error);
              res.send("mail Failed");
          }
      });