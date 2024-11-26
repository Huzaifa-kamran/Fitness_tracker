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
const {ImageLayer} = require("./Middlewares/ImageUpload")
const upload = ImageLayer();
// connection with mongo db atlass
const {connectionDB} = require("./Config/ConnectDB");

// Controllers 
const {UserRegister,UserLogin,UserGet,updateProfile} = require("./Controllers/Auth");
const {
   addWorkout,
   getAllWorkouts,
   getUserWorkouts,
   getWorkoutById,
   updateWorkout,
   deleteWorkout,
 } = require("./Controllers/WorkoutController");

const {AddFood, UpdateFood} = require("./Controllers/FoodItems");

// Routes
app.route("/register").post(upload.single("userImage"),UserRegister);
app.route("/login").post(UserLogin);
app.route("/user/:id").get(UserGet).put(updateProfile);


app.route("/workout").post(addWorkout).get(getAllWorkouts);
app.route("/workout/:id").get(getWorkoutById).put(updateWorkout).delete(deleteWorkout);
app.route("/userWorkout/:userId").get(getUserWorkouts);

app.route("/fooditem").post(AddFood);
app.route("/fooditem/:id").put(UpdateFood);

// Start server
app.listen(process.env.PORT,function(){
   console.log(`Server is running on ${process.env.PORT}`);
   connectionDB();
});