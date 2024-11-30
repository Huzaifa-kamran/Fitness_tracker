const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { connectionDB } = require("./Config/ConnectDB");

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true,
  })
);

// Socket.IO Setup
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Controllers and Routes
const { ImageLayer } = require("./Middlewares/ImageUpload");
const upload = ImageLayer();

// Authentication Controllers
const {
  UserRegister,
  UserLogin,
  UserGet,
  updateProfile,
} = require("./Controllers/Auth");

// Workout Controllers
const {
  addWorkout,
  getAllWorkouts,
  getUserWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} = require("./Controllers/WorkoutController");

// FoodItem Controllers
const { AddFood, UpdateFood, GetFood, DeleteFood } = require("./Controllers/FoodItems");

// Nutrition Tracking Controllers
const {
  AddNutritionTracking,
  UpdateNutritionTracking,
  DeleteNutritionTracking,
  GetNutritionTrackingByUser,
} = require("./Controllers/NutritionTracker");

const { setReminder, getReminders } = require("./Controllers/Reminder");

// Authentication Routes
app.route("/register").post(upload.single("userImage"), UserRegister);
app.route("/login").post(UserLogin);
app.route("/user/:id").get(UserGet).put(updateProfile);

// Workout Routes
app.route("/workout").post(addWorkout).get(getAllWorkouts);
app.route("/workout/:id").get(getWorkoutById).put(updateWorkout).delete(deleteWorkout);
app.route("/userWorkout/:userId").get(getUserWorkouts);

// Food Item Routes
app.route("/fooditem").post(AddFood).get(GetFood);
app.route("/fooditem/:id").put(UpdateFood).delete(DeleteFood);

// Nutrition Tracking Routes
app.route("/nutritionTracking").post(AddNutritionTracking);
app.route("/nutritionTracking/:id").put(UpdateNutritionTracking).delete(DeleteNutritionTracking);
app.route("/nutritionTracking/:userId").get(GetNutritionTrackingByUser);

// Reminder Routes
app.route("/setReminder").post(setReminder);
app.route("/getReminders/:userId").get(getReminders);

// Start Server
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectionDB();
});
