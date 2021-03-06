var mongoose = require("mongoose");
//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
   name: String,
   price: String,
   location: String,
   lat: Number,
   lng: Number,
   image: String,
   description: String,
   author: {
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
               {
               type:mongoose.Schema.Types.ObjectId,
               ref:"Comment"
               }
            ]
});


//model create
module.exports = mongoose.model("Campground", campgroundSchema);
 