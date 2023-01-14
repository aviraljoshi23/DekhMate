const express = require("express");
const multer = require("multer")
const router = express.Router();
const needRoomModel = require("../model/needModel")
const homeModule = require("../model/homeModel")
const indexRouter = require("../controller/homeController");
const config = require("../config/config");
const session = require('express-session');


router.use(session({ secret: config.sessionSecret }))
const auth = require('../middleware/auth');


router.get("/", indexRouter.homePage);

router.get("/signup", auth.isLogOut, indexRouter.signupPage);

router.post("/signup", indexRouter.signupPost);

router.get("/verify", indexRouter.verifyMail);

router.get("/AcccountVerification", indexRouter.accountVerification);

router.get("/AddHouse", auth.isLogin, indexRouter.AddHousePage);

var fileName;
var str = "";
var img1, img2, img3;
var Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/")
    },
    filename: function (req, file, cb) {
        fileName = Date.now() + file.originalname;
        cb(null, fileName)
        str += fileName + " ";
        const myArray = str.split(" ");
        img1 = myArray[0];
        img2 = myArray[1];
        img3 = myArray[2];
    }
})
var upload = multer({ storage: Storage })
router.post("/AddHouse", upload.array('flate', 3), (req, res) => {
    try {
        homeModule.findOne({ userEmailId: req.body.email }, async function (err, result) {
            if (err) {
                console.log(err);
            }
            if (result) {
                console.log("already registered a request");
                res.render('AddHouse', { message: "This Email Has Already put request" });
            }
            else {
                const addToList = new homeModule({
                    userEmailId: req.body.email,
                    houseAddress: req.body.address,
                    houseType: req.body.type,
                    houseRent: req.body.rent,
                    houseRequiredRoomate: req.body.roommateCount,
                    gender: req.body.gender,
                    houseImage1: img1,
                    houseImage2: img2,
                    houseImage3: img3,
                    houseDescription: req.body.houseDescription
                })
                const added = addToList.save();
                res.status(201).render("index");
                console.log("Data Send");
                str = "";
            }
        })
    }
    catch (error) {
        res.status(400).send(error);
        res.send("Something went wrong");
    }
});

router.get("/Addlisting", auth.isLogin, indexRouter.addListingPage);

router.get("/NeedHouse",auth.isLogin,indexRouter.NeedHousePage);

router.post("/NeedHouse", indexRouter.NeedHousePost);

router.get("/RoomsPage", auth.isLogin, indexRouter.roomslistPage);

router.post("/", indexRouter.HomeContact);

router.get("/login", auth.isLogOut, indexRouter.loginPage);

router.post("/login", indexRouter.verifyLogin);

router.get("/forget", auth.isLogOut, indexRouter.forgetPassword);

router.post("/forget", indexRouter.forgetVerify);

router.get("/forget-password", auth.isLogOut, indexRouter.forgetPasswordLoad);

router.post("/forget-password", indexRouter.resetPassword);

router.get("/logout", auth.isLogin, indexRouter.logout);

router.get("/SearchRoomPage", auth.isLogin, indexRouter.roomNeedPage);

router.post("/SearchRoomPage",indexRouter.NeedHouseRequest);

router.get("/Profile", auth.isLogin, indexRouter.profilePage);

router.get("/Profile/:id",indexRouter.deleteProfile);

router.post("/Profile",upload.single('image'),indexRouter.profilePost);


module.exports = router;