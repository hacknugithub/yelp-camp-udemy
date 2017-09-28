var Campground = require("../models/campground"),
    Comment = require("../models/comment");
//All the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    //is user logged in?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                console.log(err);
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                //does user own campground?
                //using built in comparing method from mongoose equals()
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    //is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found.");
                console.log(err);
                req.flash("error", "Something went wrong.");
                res.redirect("back");
            } else {
                //does user own comment?
                //using built in comparing method from mongoose equals()
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //the flash make it with a key value error to the next redirect
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}

module.exports = middlewareObj;