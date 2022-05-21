// ---------------
// --- CONSTS  ---
// ---------------
const express = require('express')
const app = express()
app.set('view engine', 'ejs');
const bodyparser = require("body-parser");
var session = require('express-session');
const https = require('https');
const mongoose = require('mongoose');
const { allowedNodeEnvironmentFlags, nextTick } = require('process');
const req = require('express/lib/request');
const res = require('express/lib/response');
const { escapeRegExpChars } = require('ejs/lib/utils');

// ---------------
// --- APP USE---
// ---------------

app.use(express.static('./public'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: true,
    resave: true
}))

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});


// ---------------------------
// --- MONGOOSE CONNECTION ---
// ---------------------------

mongoose.connect("mongodb+srv://testUser:testUser@cluster0.etygx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true });

// Timeline Schema
const timelineSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    time: String
});
const timelineModel = mongoose.model("timelineevents", timelineSchema);

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    time: String
});
const userModel = mongoose.model("users", userSchema);


// Signup
app.get("/signup", function (req, res) {
    //Create sign up form here and send it to mongoDB
    res.render("signup");
});

function auth(req , res, next) {
    if (req.session.authenticated) {
        console.log("authenticated");
        next()
    } else {
        res.redirect("/login")
    }
}

app.get('/', auth, function (req, res) {
    tmp = ''
    tmp += `Hi ${req.session.username}! `
    tmp += "Welcome to the home page"
    res.send(tmp)
});

app.get('/login', function (req, res) {
    res.send('Hello, login page!');
});

app.get('/userProfile/:name', auth, function (req, res) {
    tmp = ''
    tmp += `Hi ${req.params.name} !`
    tmp += JSON.stringify(users.filter(user => user.username == req.params.name)[0].shoppingCart)
    res.send(tmp)
})


app.get('/login/:username/:password', function (req, res) {
    if (users.filter(user => user.username == req.params.username && user.password == req.params.password).length > 0) {
        req.session.authenticated = true;
        req.session.username = req.params.username;
        res.redirect('/userProfile/' + req.params.username)
    } else {
        req.session.authenticated = false;
        res.send("Wrong username or password")
}
});

// ----------------
// ----  LOGIN ----
// ----------------

app.post('/login/authentication', function (req, res, next) {
    userModel.find({}, function (err, users) {
        if (err) {
            console.log('Error' + err)
        } else {
            console.log('Data' + users)
        }

        user=users.filter((userobj)=>{
            return userobj.email == req.body.email
        })
        if (user[0].password==req.body.password){
            req.session.authenticated = true
            req.session.email = req.body.email
            req.session.userId = user[0]._id
            req.session.userobj = user[0]
            // LoggedInUserID = req.session.userId
            res.send("Successful Login!" + req.session.userobj + "user id: " + req.session.userId)
        }

    })
})


// ----------------
// ----  SIGNUP ----
// ----------------

app.put('/signup/create', function (req, res) {
    console.log(req.body)
    userModel.create({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        time: req.body.time
    }, function (err, data) {
        if (err) {
            console.log('Error' + err)
        } else {
            console.log('Data' + data)
        }
        res.send("New user created!")
    })
})


// ----------------
// --- TIMELINE ---
// ----------------

app.use(bodyparser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));



// ----------------
// --- Profile  ---
// ----------------
app.get('/profile/:id', function (req, res) {

    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`;
    data = ""
    https.get(pokemon, function (https_res) {
        https_res.on("data", function (chunk) {
           data += chunk
        })

        https_res.on("end", function () {
            data = JSON.parse(data)

            z  = data.stats.filter(function (obj){
                return obj.stat.name == "hp"
            }).map((obj2)=>{
                return obj2.base_stat
            })
            // console.log(t)
            res.render("profile.ejs", {
                "id": req.params.id,
                "name": data.name,
                "hp": z[0],// data.stats[0].stat.name
                "type": data.types[0].type.name,
                "attack": data.stats[4].base_stat,
                "defense": data.stats[3].base_stat,
                "speed": data.stats[0].base_stat,
                "specialAttack": data.stats[2].base_stat,
                "specialDefense": data.stats[1].base_stat,
                "maxhp": data.stats[5].base_stat,
                "ability": data.abilities[0].ability.name
            })
            });
            
        })
    });

app.use('./public', express.static('public'));