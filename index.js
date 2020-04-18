const express = require("express"),
      app     = express(),
      session = require("express-session"),
      connectMongoDb = require("connect-mongodb-session")(session),
      passport = require("passport"),
      FacebookStrategy = require('passport-facebook').Strategy,
      mongoose = require("mongoose");

const User = require("./models/user");

// create session and cookie
const MONGO_URI = 'mongodb://localhost:27017/oauth';
const store = new connectMongoDb({
    uri : MONGO_URI,
    collection : "session"
})

app.use(session({
    secret : "Node.js OAuth",
    resave : false,
    saveUninitialized : false,
    store : store
}))

// passport-facebook config
passport.use(new FacebookStrategy({
    clientID: "704887760247999",
    clientSecret: "e656cfa3446e7357715d604b9a5efb59",
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields : ["id", "displayName", "email"]
    },
    function(accessToken, refreshToken, profile, done) {
        const result = profile._json;
        User.findOne({userId : result.id})
        .then(user => {
            if(!user){
                new User({
                    userId : result.id,
                    name : result.name,
                    email : result.email
                }).save()
                console.log("Create new user");
                done(null, profile);
            } else {
                console.log("User login successful");
                done(null, profile)
            }
        })
        .catch(err => {
            console.log(err);
            throw new Error("Error in lin 43");
        });
    }
));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
    cb(null, user);
})

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
})

// Set view engine
app.set("view engine", "ejs");

// To access the public folder
app.use(express.static("public"));

// Middleware
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
})

// Set routes
const routes = require("./routes/routes");
app.use(routes);

// connect to DB
const port = process.env.PORT || 3000;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => !result ? console.log("Error in DB connection") : app.listen(port, () => console.log("Server is running")))
.catch(err => {
    console.log(err);
    throw new Error("Error in line 82");
});