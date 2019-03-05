// Database model

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create model Schema
const blogSchema = new Schema({
  title: String,
  image: {type: String, default:"https://i.ibb.co/2jcHBnR/hair-person-table-1930009.jpg"},
  body: String,
  created: {type: Date, default:Date.now}
});

mongoose.model("Blog", blogSchema);