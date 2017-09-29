var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware"),
    geocoder = require("geocoder");

//INDEX ROUTE
router.get("/", function(req, res){
    console.log(req.user);
    //GET ALL CAMPGROUNDS FROM DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            //console.log(campgrounds);
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page:"campgrounds"});
        }
    });
});

//NEW ROUTE
router.get("/new",middleware.isLoggedIn,  function(req, res) {
   res.render("campgrounds/new"); 
});
//CREATE ROUTE
router.post("/",middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data){
        if(err){
            req.flash("error", "Something went wrong" + err.message);
            res.redirect("back");
        }
       var lat = data.results[0].geometry.location.lat;
       var lng = data.results[0].geometry.location.lng;
       var campLocation = data.results[0].formatted_address;
       
    var newCampground = {name:name, image:image, description: desc, author:author, price: price, location: campLocation, lat: lat, lng: lng};
   //Create a new campground and save to DB
   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else{
           res.redirect("/campgrounds");
       }
    });
   });
});
//SHOW ROUTE
router.get("/:id", function(req, res) {
    
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found.");
            res.redirect("back");
            console.log(err);
        } else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req, res) {
     Campground.findById(req.params.id, function(err, foundCampground){
        //error is being handled in the middleware
        
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership,function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.campground.name, image: req.body.campground.image, description: req.body.campground.description, price: req.body.campground.price, location: location, lat: lat, lng: lng};
    //find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, {$set: newData} ,function(err, updatedCampground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success", "Successfully Updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
        });
    });
});

//DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, deletedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;