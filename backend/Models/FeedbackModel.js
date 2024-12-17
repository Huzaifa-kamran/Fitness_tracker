const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required: true,
    }
});

const Feedbacks = mongoose.model("Feedbacks",FeedbackSchema);

module.exports = Feedbacks;