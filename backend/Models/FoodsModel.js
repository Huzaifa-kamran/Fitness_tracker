const mongoose = require("mongoose");

const FoodsModel = mongoose.Schema({
   foodName:{
    type: String,
    required: [true, "Food Name must be filled"]
   },
   calories:{
    type: Number,
    required: [true, "Calories must be filled"]
   },
   macros:{
    type: Number,
    required: [true, "Macros must be filled"]
   },

});

const Foods = mongoose.model("Foods", FoodsModel);

module.exports = FoodsModel;