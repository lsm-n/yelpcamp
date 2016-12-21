// required imports
var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware") // automatically requires index.js

// new comment
router.get("/new", middleware.isLoggedIn, function(req, res) {
   Campground.findById(req.params.id, function(err, campground){
       if (err) {
            req.flash("error", "Campground could not be found");
            res.redirect("/campgrounds");
           console.log(err);
       } else {
           res.render("comments/new", {campground: campground});
       }
   });
   
    
});

// create comment
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
       if (err) {
           console.log(err);
       } else { // add new comment to correct campground
           var newComment = req.body.comment;
           Comment.create(newComment, function(err, comment) {
               if (err) {
                   req.flash("error", "Review could not be created");
                   res.redirect("/campgrounds/" + req.params.id);
                   console.log(err);
               } else {
                   // add username and id to comment
                   // req.user has username and id (we know this because of the middleware!)
                   comment.author.username = req.user.username;
                   comment.author.id = req.user._id;
                   // save comment
                   comment.save();
                   
                   campground.comments.push(comment); //push created comment to found campground
                   campground.save(); //save campground
                   
                   req.flash("success", "Your review has been added");
                   res.redirect("/campgrounds/"+ req.params.id); //redirect to original campground
               }
           });
       }
    });
   
});

//edit
router.get("/:comment_id/edit", middleware.checkCommentAuth, function(req, res) {
    var camp_id = req.params.id;
    var comment_id = req.params.comment_id;
    Comment.findById(comment_id, function(err, comment) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/edit", {camp_id: camp_id, comment: comment});
        }
        
    });
});

//update
router.put("/:comment_id", middleware.checkCommentAuth, function(req, res) {
    var comment_id = req.params.comment_id;
    var camp_id = req.params.id;
    Comment.findByIdAndUpdate(comment_id, req.body.comment, function (err, comment) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Your review has been updated");
            res.redirect("/campgrounds/" + camp_id);
        }
    });
});

//destroy

router.delete("/:comment_id", middleware.checkCommentAuth, function(req, res) {
    var comment_id = req.params.comment_id;
    var camp_id = req.params.id;
    
    Comment.findByIdAndRemove(comment_id, function (err) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Your review has been deleted");
            res.redirect("/campgrounds/" + camp_id);
        }
    });
});


// to export routes
module.exports = router;