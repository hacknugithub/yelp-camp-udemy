var express = require("express"),
    router = express.Router({mergeParams: true}), //merge params make id available between routes
    Campground = require("../models/campground"),
    Comment =require("../models/comment");

//Comments new
router.get("/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {campground:campground});
        }
    });
});

//Comments create
router.post("/", isLoggedIn, function(req, res){
    
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                } else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});
// EDIT ROUTE
router.get("/:comment_id/edit", function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
       if(err){
           res.rendirect("back");
       } else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
       }
    });
});
//COMMENT UPDATE
router.put("/:comment_id",function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/" + req.params.id );
        }
    });
});
//DELETE ROUTE
router.delete("/:comment_id", function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id,function(err, deletedComment){
      if(err){
         res.redirect("back");
      } else{
         res.redirect("/campgrounds/"+req.params.id);
      }
   }); 
});
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;