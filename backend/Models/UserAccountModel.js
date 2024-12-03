const mongoose = require("mongoose");

const UserAccountModel = mongoose.Schema({
    userName: {
        type: String,
        required: [true, "User Name must be filled"],
    },
    userEmail: {
        type: String,
        required: [true, "User Email must be filled and valid email"],
    },
    userImage: {
        type: String,
        required: [true, "User Image must be selected"],
    },
    userPassword: {
        type: String,
        required: [true, "User Password must be there and contains at least 8 characters"],
    },
    userAge: {
        type: Number,
        required: [true, "User Age must be provided"],
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: [true, "Gender must be specified"],
    },
    height: {
        type: Number, // Consider using centimeters or inches
        required: [true, "Height must be provided"],
    },
    weight: {
        type: Number, // Consider using kilograms or pounds
        required: [true, "Weight must be provided"],
    },
    targetWeight: {
        type: Number, // Consider using kilograms or pounds
        required: [true, "Target Weight must be provided"],
    },
    activityLevel: {
        type: String,
        enum: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Super Active"],
        required: [true, "Activity Level must be specified"],
    },
    weeklyGoal: {
        type: String,
        required: [true, "Weekly Goal must be specified"],
    },
});

const UserAccount = mongoose.model("UserAccount", UserAccountModel);

module.exports = UserAccount;
