const mongoose = require("mongoose");
//connect to db

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://tanglymeng2:QNZDubt0tgNKjrCA@mern-insightpost.cyyjtwp.mongodb.net/mern-insightPost?retryWrites=true&w=majority&appName=mern-insightPost");
    console.log("DB has been connected");
  } catch (error) {
    console.log("DB Connection failed", error.message);
  }
};

module.exports = connectDB;