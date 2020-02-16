//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
const app = express();
mongoose.connect('mongodb://localhost:27017/secretDB', {useNewUrlParser: true, useUnifiedTopology: true});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

/*********************Schema And Model Section*************/
const userSchema = new mongoose.Schema({                //loginSchema
    email : String,
    password : String
});
const secret = process.env.SECRET;
userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});

const User = mongoose.model("User",userSchema);


/******************************route*****************/
app.route("/")
    .get(function (req,res) {
        res.render("home");
    });
/****************END OF ROUTE "/"*************/
/************************Login route***********/
app.route("/login")
    .get(function (req,res) {
        res.render("login");
    });
/************************Register Route*************/
app.route("/register")
    .get(function (req,res) {
        res.render("register");
    })
    .post(function (req, res) {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });
        console.log(newUser.email);
        newUser.save(function (err) {
            if(err){
                res.render(err);
            }else{
                res.render("secrets");
            }
        });

    });

/******************************Login Route*************************************/
app.post("/login", function (req, res) {


     const  email= req.body.username;
     const  password= req.body.password;

     User.findOne({email:email},function (err, found) {
      if(err){
          console.log(err);
      }else if(found.password===password){
          res.render("secrets");
      }else
          console.log("Invalid");

     });


});




/******************************/


app.listen(process.env.PORT||3000, function (){
    console.log(3000);

});
