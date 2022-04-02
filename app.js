require("dotenv").config()

const express =  require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")
const passport_local_mongoose = require("passport-local-mongoose")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const findOrCreate = require("mongoose-findorcreate")

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))
app.set("view engine", "ejs")

app.use(session({
    secret: "DocBot",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// Base de datos en ATLAS. Not working by now
// const database = "mongodb+srv://worldfish:Test123@cluster0.rd9lk.mongodb.net/docbotDB"
const database = "mongodb://localhost:27017/docbotDB"
const options = {useNewUrlParser: true}
mongoose.connect(database, options)

const userSchema = new mongoose.Schema ({
    email: String,
    password: String,
    googleId: String
})

userSchema.plugin(passport_local_mongoose)
userSchema.plugin(findOrCreate)

const User = new mongoose.model("user", userSchema)

passport.use(User.createStrategy())
passport.serializeUser(function(user, done) {
    done(null, user.id)
})
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user)
    })
})

passport.use(new GoogleStrategy ({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/docbot",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken, refreshToken, profile, cb) {

        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user)
        })
    }
))

app.route("/auth/google")
    .get(passport.authenticate("google", { scope: ["profile"] }))

app.route("/auth/google/docbot")
    .get(passport.authenticate("google", { failureRedirect: "/login" }),
    function(req, res) {
        res.redirect('/chatbot');
    });

app.route("/login")
    .get(function(req, res) {
        if (req.isAuthenticated()) res.redirect("/chatbot")
        else res.render("login")
    })
    .post(function(req, res) {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        })

        req.login(user, function(err) {
            if (!err) passport.authenticate("local")(req, res, function() {
                res.redirect("/chatbot")
            })
            else console.log(err)
        })
    })


app.route("/")
    .get(function(req, res) {
        res.redirect("/login")
    })

let isGuest = false
app.route("/chatbot")
    .get(function(req, res) {
        if (req.isAuthenticated() || isGuest) res.render("chatbot")
        else res.redirect("/login")
    })

app.route("/invitado")
    .get(function(req, res) {
        isGuest = true
        res.redirect("/chatbot")
    })

/* POSTMAN */
/* POSTMAN */
/* POSTMAN */

app.route("/register")
    .post(function(req, res) {
        User.register({username: req.body.username}, req.body.password, function(err, user) {
            if (!err) {
                passport.authenticate("local")(req, res, function() {
                    res.send("Funcionó :D")
                    //res.redirect("/secrets")
                })
            }
            else {
                console.log(err)
                res.redirect("/register")
            }
        })
    })

/* POSTMAN */
/* POSTMAN */
/* POSTMAN */

app.listen(process.env.PORT || 3000, function() {
    console.log("Server's running on port 3000")
})