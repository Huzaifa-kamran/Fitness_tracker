const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");


// Middlewares 
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors({
   origin: 'http://localhost:3000', 
   credentials: true                
}));


// connection with mongo db atlass
// const {connectionDB} = require("./Config/ConnectDB");

// Controllers 
const {UserRegister,UserLogin,UserGet} = require("./Controllers/Auth")

// Routes
app.route("/register").post(UserRegister);
app.route("/login").post(UserLogin);
app.route("/user/:id").get(UserGet);


// Start server
app.listen(process.env.PORT,function(){
   console.log(`Server is running on ${process.env.PORT}`);
//    connectionDB();
});