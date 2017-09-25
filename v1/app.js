var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");


    var campgrounds = [
        {name: "Salmon Creek", image:"https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
        {name: "Rocky Hill", image:"https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg"},
        {name: "Granite Mount", image:"https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg"},
        {name: "Mountain Goat's Lair", image:"https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg"},
        {name: "Salmon Creek", image:"https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
        {name: "Rocky Hill", image:"https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg"},
        {name: "Granite Mount", image:"https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg"}
        ];

app.get("/", function(req, res){
    res.render("landing"); 
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.get("/campgrounds/new", function(req, res) {
   res.render("new.ejs"); 
});

app.post("/campgrouds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name:name, image:image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp Camp Server Started");
});