const mongoose = require('mongoose');
const Feedbacks = require("../Models/FeedbackModel");


const addFeedback = async(req, res) => {
  const {name,email,message,rating} = req.body;

  if(!name){
    return res.status(400).send({"error": "Name is required."});
  }

  if(!email){
    return res.status(400).send({"error": "Email is required."});
  }

  if(!message){
    return res.status(400).json({"error": "Message is required."});
  }

  if(!rating){
    return res.status(400).send({"error": "Rating must be selected."});
  }

  const feedback = await Feedbacks.create({
    name,
    email,
    message,
    rating
  });

  if (feedback) {
      return res.status(201).send({"message": "Feedback submitted successfully"});
  } else {
    return res.status(400).send({"error": "Something went wrong"});
  }
}

const getFeedback = async(req, res) => {
    const feedbacks = await Feedbacks.find();
    return res.status(200).send(feedbacks);
}

module.exports = {
    addFeedback,
    getFeedback
}