const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");
const PORT = process.env.PORT || 5000;
app = express();

//Connect to MongoDB
mongoose.connect("mongodb://localhost/restful_blog", {
  useNewUrlParser:true
})
.then(()=> console.log("MongoDB Connected..."))
.catch(err => console.log(err));

// APP CONFIG
//Body perser for getting data from HTML input fields and sanitizer for text field
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
// View engine set to .ejs and use of public folder
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
// For PUT and DELETE methods in HTML
app.use(methodOverride("_method"));

// DeprecationWarning Solution
mongoose.set('useFindAndModify', false);

// Load Blog Model
require("./models/Blog");
const Blog = mongoose.model("Blog");

// RESTFUL ROUTES
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

// INDEX
app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if(err){
      console.log(err);
    } else  {
      res.render("index", {blogs:blogs});
    }
  })
});

// NEW ROUTE
app.get("/blogs/new", (req, res) => {
  res.render("new");
});

// CREATE ROUTE
app.post("/blogs", (req, res) => {
  // Crate blog
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, (err, newBlog) => {
    if(err){
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  })
});

// SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("show", {blog: foundBlog});
    }
  });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
});

// UPDATE ROUTE
app.put("/blogs/:id", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if(err) {
      res.redirect("/blogs");
    } else {
      res.redirect(`/blogs/${req.params.id}`);
    }
  });
});

// DELETE ROUTE
app.delete("/blogs/:id", (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if(err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

// API
// Get all blogs
app.get("/api/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if(err){
      console.log(err);
    } else  {
      res.json(blogs);
    }
  })
});

// Get blog by ID
app.get("/api/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if(err) {
      console.log(err);
    } else if(blog) {
      res.json(blog);
    } else {
      res.status(400).json({msg:`No blog with ID of ${req.params.id}`});
    }
  });
});

// Start server port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});