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
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function(){
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
    }), function(req, res){
});
    
//LOG OUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;