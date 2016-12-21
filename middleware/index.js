var middlewareObj = {};

var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundAuth = function(req, res, next) {
    if (req.isAuthenticated()) { // check that user is logged in
        Campground.findById(req.params.id, function(err, campground) {
            if (err) {
                req.flash("error","Campground could not be found");
                res.redirect("/campgrounds");
            } else { // if campground is found
                if (campground.author.id.equals(req.user._id)) { // check ownership
                    next(); 
                } else { // if they don't have ownership
                    req.flash("error","Permission denied");
                    res.redirect("/campgrounds/"+req.params.id);
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that");
        res.redirect("/campgrounds/"+req.params.id);
    }
};

middlewareObj.checkCommentAuth = function(req, res, next) {
    if (req.isAuthenticated()) { // check that user is logged in
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) {
                req.flash("error","Review could not be found");
                res.redirect("/campgrounds/"+req.params.id);
            } else { // if campground is found
                if (comment.author.id.equals(req.user._id)) { // check ownership
                    next(); 
                } else { // if they don't have ownership
                    req.flash("error","Permission denied");
                    res.redirect("/campgrounds/"+req.params.id);
                }
                
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that");
        res.redirect("/campgrounds/"+req.params.id);
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;