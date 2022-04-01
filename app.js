const express =  require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const passport = require("passport")

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))
app.set("view engine", "ejs")

app.route("/login")
    .get(function(req, res) {
        res.render("login")
    })


app.route("/")
    .get(function(req, res) {
        res.redirect("/login")
    })

app.route("/chatBot")
    .get(function(req, res) {
        res.render("chatbot")
    })

app.listen(process.env.PORT || 3000, function() {
    console.log("Server's running on port 3000")
})