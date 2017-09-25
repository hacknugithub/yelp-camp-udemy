
var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB     = require("./seeds");


mongoose.connect("mongodb://localhost/yelp_camp_v4");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
seedDB();

app.get("/", function(req, res){
    res.render("landing"); 
});

//INDEX ROUTE
app.get("/campgrounds", function(req, res){
    //GET ALL CAMPGROUNDS FROM DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            //console.log(campgrounds);
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

//NEW ROUTE
app.get("/campgrounds/new", function(req, res) {
   res.render("new.ejs"); 
});
//CREATE ROUTE
app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name:name, image:image, description: desc};
   //Create a new campground and save to DB
   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else{
           res.redirect("/campgrounds");
       }
   });
});
//SHOW ROUTE
app.get("/campgrounds/:id", function(req, res) {
    
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            res.render("show", {campground: foundCampground});
        }
    });
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp Camp Server Started");
});