const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");

//   ------------------------- Middlewares ------------------------- // 
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors({
   origin: 'http://localhost:3000', 
   credentials: true                
}));
const {ImageLayer} = require("./Middlewares/ImageUpload");
const upload = ImageLayer();


//   ------------------------- Config ------------------------- // 
const {connectionDB} = require("./Config/ConnectDB");

//   ------------------------- Controllers ------------------------- // 
// Auth Controller 
const {UserRegister,UserLogin,UserGet,updateProfile} = require("./Controllers/Auth");

// Workout Controller 
const {
   addWorkout,
   getAllWorkouts,
   getUserWorkouts,
   getWorkoutById,
   updateWorkout,
   deleteWorkout,
 } = require("./Controllers/WorkoutController");

// FoodItem Controller 
const {AddFood, UpdateFood,GetFood,DeleteFood} = require("./Controllers/FoodItems");

// NutritionTracking Controller 
const {
   AddNutritionTracking,
   UpdateNutritionTracking,
   DeleteNutritionTracking,
   GetNutritionTrackingByUser,
 } = require("./Controllers/NutritionTracker");

//   ------------------------- Routes ------------------------- //

// Authentication Routes 
app.route("/register").post(upload.single("userImage"),UserRegister);
app.route("/login").post(UserLogin);
app.route("/user/:id").get(UserGet).put(updateProfile);

// Workout Routes 
app.route("/workout").post(addWorkout).get(getAllWorkouts);
app.route("/workout/:id").get(getWorkoutById).put(updateWorkout).delete(deleteWorkout);
app.route("/userWorkout/:userId").get(getUserWorkouts);

// Food item Routes 
app.route("/fooditem").post(AddFood).get(GetFood);
app.route("/fooditem/:id").put(UpdateFood).delete(DeleteFood);

// Nutrition Tracking Routes 
app.route("/nutritionTracking").post(AddNutritionTracking);
app.route("/nutritionTracking/:id").put(UpdateNutritionTracking).delete(DeleteNutritionTracking);
app.route("/nutritionTracking/:userId").get(GetNutritionTrackingByUser);
//   ------------------------- Start Server ------------------------- //
app.listen(process.env.PORT,function(){
   console.log(`Server is running on ${process.env.PORT}`);
   connectionDB();
});