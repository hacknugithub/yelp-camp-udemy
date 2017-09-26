
var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    User       = require("./models/user"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    seedDB     = require("./seeds");


mongoose.connect("mongodb://localhost/yelp_camp_v6");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//Passport config
app.use(require("express-session")({
    secret: "la pancha esta muy gorda",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});
 
app.get("/", function(req, res){
    res.render("landing"); 
});

//INDEX ROUTE
app.get("/campgrounds", function(req, res){
    console.log(req.user);
    //GET ALL CAMPGROUNDS FROM DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            //console.log(campgrounds);
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

//NEW ROUTE
app.get("/campgrounds/new", function(req, res) {
   res.render("campgrounds/new"); 
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
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//=====================================================================
//            COMENTS ROUTES (Nested routes)
//=====================================================================

//NEW FOR COMMENTS
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {campground:campground});
        }
    });
});

//CREATE FOR COMMENTS
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                } else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//===============================================================================
//                          Authentication Routes
//===============================================================================
//SHOW REGISTER FORM
app.get("/register", function(req, res) {
   res.render("register"); 
});
// HANDLE SIGN UP LOGIC
app.post("/register", function(req, res) {
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
app.get("/login", function(req, res) {
    res.render("login");
});
//LOGIN LOGIC
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});
    
//LOG OUT ROUTE
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp Camp Server Started");
});