const express = require('express')
const app = express()
app.set('view engine', 'ejs');
// use public forlder for css
app.use(express.static('public'));
const bodyparser = require("body-parser");


// app.listen(process.env.PORT || 5003, function (err) {
//     if (err)
//         console.log(err);
// })
app.listen(5003, function (err) {
    if (err)
        console.log(err);
})

const https = require('https');
const mongoose = require('mongoose');

app.use(bodyparser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/timelineDB",
    { useNewUrlParser: true, useUnifiedTopology: true });
const timelineSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    time: String
});
const timelineModel = mongoose.model("timelineevents", timelineSchema);


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
    // console.log(req.body)
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


app.use(express.static('./public'));

app.use(bodyparser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));


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




    // res.json({
    //     "k1": "v1",

    //     "k2": "v1",

    //     "k3": "v1"

    // })


// app.get('/', function(req, res) {
//     res.sendFile(__dirname + "/index.html");
//   })

app.use(express.static('./public'));