import React, { useState } from "react";
import "./FeedbackForm.css"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    rating: "5",
  });

  const handleToast = (message, toastType) => {
      toastType === "danger" ? toast.error(message) : toast.success(message);
    };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Feedback Submitted:", formData);
     const response = await fetch('http://localhost:5000/feedback',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
     });
     const data = await response.json();
     console.log(data);

     if(data.message){
      handleToast(data.message,"success");
     }else{
      handleToast(data.error,"danger");
     }
  };

  return (
    <div className="feedback-form-container">
      <h2 className="form-heading">Your Feedback Matters!</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="feedback">Feedback</label>
          <textarea
            id="message"
            name="message"
            placeholder="Write your feedback"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <select id="rating" name="rating" value={formData.rating} onChange={handleChange}>
            <option value="5">Excellent</option>
            <option value="4">Good</option>
            <option value="3">Average</option>
            <option value="2">Below Average</option>
            <option value="1">Poor</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
