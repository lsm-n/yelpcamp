var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var flash = require("connect-flash");

// required for auths
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

// import routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/index");

// import schemas
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");

// imports and fills in seed data
//var seedDB = require("./seeds");
//seedDB(); // calling seedDB function

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";

mongoose.connect(url);

mongoose.Promise = global.Promise;

app.use(flash());
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public")); // for our custom css file

// everything below required for auth
app.use(require("express-session")({
    secret: "huntusindhu",
    resave: false,
    saveUnitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

//built in methods for serialization!
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passes in data on every route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// use routes
app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT,process.env.IP, function() {
    console.log("The YelpCamp server has started running.");
});