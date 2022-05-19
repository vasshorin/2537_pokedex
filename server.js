const express = require('express')
const app = express()
app.set('view engine', 'ejs');
// use public forlder for css
const bodyparser = require("body-parser");
var session = require('express-session');
const https = require('https');
const mongoose = require('mongoose');
const { allowedNodeEnvironmentFlags, nextTick } = require('process');
const req = require('express/lib/request');
const res = require('express/lib/response');
const { escapeRegExpChars } = require('ejs/lib/utils');

// Use the session middleware
app.use(session({secret: "ssshhhhh", saveUninitialized: true, resave: true}));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

// app.listen(5003, function (err) {
//     if (err)
//         console.log(err);
// })


// _________________________________DATA BASE_________________________________________
app.use(bodyparser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb+srv://testUser:testUser@cluster0.etygx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true });

// const timelineSchema = new mongoose.Schema({
//     text: String,
//     hits: Number,
//     time: String
// });
// const timelineModel = mongoose.model("timelineevents", timelineSchema);
// const users = new mongoose.Schema({
//     username: String,
//     password: String,
//     shoppingCart: [
//         {
//             pokeCardID: String,
//             quantity: Number,
//             price: Number
//         }
//     ]
// });
// const userModel = mongoose.model("users", users);



// Signup
app.get("/signup", function (req, res) {
    //Create sign up form here and send it to mongoDB
    res.render("signup");

});
// ______________________________________LOGIN __________________________________________________________
users = [
    {
        "username": "user1",
        "password": "password1",
        "shoppingCart": [
            {
                pokeCardID: 25,
                quantity: 2,
                price: 24.2
            },{
                
                pokeCardID: 30,
                quantity: 1,
                price: 12
            }
            ]
    }, {
        "username": "user2",
        "password": "password2",
    }
]

function logger1(x,y, next) {
    console.log("logger1 called");
    next()
}

function auth(req , res, next) {
    if (req.session.authenticated) {
        console.log("authenticated");
        next()
    } else {
        res.redirect("/login")
    }
}
// app.use(auth)

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





// ______________________________________TIMELINE__________________________________________________________

app.get('/timeline/getAllEvents', function (req, res) {
    timelineModel.find({}, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
            console.log("Time" + Date.now());
        }
        res.send(data);
    });
})


// put request to add new event
app.put('/timeline/insert', function (req, res) {
    console.log(req.body)
    timelineModel.create({
        'text': req.body.text,
        'time': req.body.time,
        'hits': req.body.hits
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Insertion is successful!");
    });
})

app.get('/timeline/delete/:id', function (req, res) {
    // console.log(req.body)
    timelineModel.remove({
        '_id': req.params.id
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Delete request is successful!");
    });
})


app.get('/timeline/inscreaseHits/:id', function (req, res) {
    timelineModel.updateOne({
        '_id': req.params.id
    },{
        $inc: {'hits': 1}
    } ,function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Update request is successful!");
    });
})


app.get('/timeline', function (req, res) {
    timelineModel.find({}, function (err, timelineLogs) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + JSON.stringify(timelineLogs));
        }
        res.send(JSON.stringify(timelineLogs));
    });
})


app.put('/timeline/delete/:id', function (req, res) {
    timelineModel.deleteOne({
        id: req.params.id
    }, function (err, data) {
        if (err) console.log(err);
        else
            console.log(data);
        res.send("All good! Deleted.")
    });
})



app.get('/timeline/update/:id', function (req, res) {
    timelineModel.updateOne({
        id: req.params.id
    }, {
        $inc: { hits: 1 }
    }, function (err, data) {
        if (err) console.log(err);
        else
            console.log(data);
        res.send("All good! Updated.")
    });
    
})

app.use(bodyparser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));


// ______________________________________PROFILE__________________________________________________________
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
