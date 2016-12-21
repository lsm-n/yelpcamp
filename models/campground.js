var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        { // this is saying that comments property should be an array of comment IDs.
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment" // the type of object the ID refers to
        }
    ]
});

var Campground = mongoose.model("Campground", campgroundSchema);


module.exports = Campground;