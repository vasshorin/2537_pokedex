// ---------------
// --- ROUTES  ---
// ---------------

const express = require('express')
const app = express()
const bodyparser = require("body-parser");
const https = require('https');
const mongoose = require('mongoose');
app.set('view engine', 'ejs');
app.use(express.static('./public'));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

app.use(bodyparser.urlencoded({
    extended: true
}));

// ---------------------------
// --- MONGOOSE CONNECTION ---
// ---------------------------

mongoose.connect("mongodb+srv://testUser:testUser@cluster0.etygx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true });

// Timeline schema
const timelineSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    time: String
});
const timelineModel = mongoose.model("timelineevents", timelineSchema);

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});
const userModel = mongoose.model("users", userSchema);


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

    // var pokemon = res.sendFile(__dirname + '/public/' + req.params.id + '.json');
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
