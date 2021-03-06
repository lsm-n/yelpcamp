var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

// homepage redirect 
router.get("/", function(req, res) {
    //res.redirect("/campgrounds");
    res.render("home");
});

// register
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username}); // create new user w username
    var password = req.body.password; // password is separate argument, it gets hashed
    User.register(newUser, password, function(err, user){
        if (err) {
          req.flash("error", err.message);
          res.redirect("/register");
            console.log(err);
        } else {
            // logs user in, runs serialize user
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome to YelpCamp, " + req.body.username + "!");
                res.redirect("/campgrounds");
            });
        }
    });
});

//login
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/loginFailure"
    }),function(req, res){
});

router.get("/loginFailure", function(req, res) {
    req.flash("error", "Incorrect username or password");
    res.redirect("/login");
})

// logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You are now logged out");
    res.redirect("/campgrounds");
});

// to export routes
module.exports = router;