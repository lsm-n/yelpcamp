// required imports
var express = require("express");
var router = express.Router(); // add routes onto router instead of app
var Campground = require("../models/campground");
var middleware = require("../middleware") // automatically requires index.js

// campground index
router.get("/", function(req, res) {
    Campground.find({}, function(err, campgrounds){
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/campgrounds", {campgrounds: campgrounds});
        }
    });
    
});

// new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// create campground
router.post("/", middleware.isLoggedIn, function(req, res) {
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;
   var author = {
                id: req.user.id,
                username: req.user.username
            };
   
   var newCampground = {name: name, image: image, description: description, author: author};
   
   Campground.create(newCampground, function(err, campground){
      if (err) {
          req.flash("error", "Campground could not be created")
          res.redirect("/campgrounds");
          console.log(err);
      } else {
          req.flash("success", campground.name + " has been added!");
          res.redirect("/campgrounds");
      }
   });
   
});

// show specific campground
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
        if (err) {
            req.flash("error", "Campground could not be found");
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show", {campground: campground});
        }
    });

});

// edit a campground
router.get("/:id/edit", middleware.checkCampgroundAuth, function (req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/edit", {campground: campground});
        }
    });
});

// update campground
router.put("/:id", middleware.checkCampgroundAuth, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Changes to " + updatedCampground.name + " have been saved");
            res.redirect("/campgrounds/" + req.params.id);
            
        }
    });
});

//delete a campground
router.delete("/:id", middleware.checkCampgroundAuth, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Your campground has been deleted")
            res.redirect("/campgrounds");
        }
        
    });
});

// to export routes
module.exports = router;