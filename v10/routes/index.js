var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");
    
//Root Route   
router.get("/", function(req, res){
    res.render("landing"); 
});
//SHOW REGISTER FORM
router.get("/register", function(req, res) {
   res.render("register"); 
});
// HANDLE SIGN UP LOGIC
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username}); 
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           return res.redirect("/register");
       }
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Yelp Camp " + user.username);
           res.redirect("/campgrounds");
        });
   });
});

//==================================================================================
//                                LOGIN ROUTES
//==================================================================================

//SHOW LOGIN FORM
router.get("/login", function(req, res) {
    res.render("login");
});
//LOGIN LOGIC
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
        
    }), function(req, res, err){
        
});
    
//LOG OUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged You Out!")
    res.redirect("/campgrounds");
});


module.exports = router;