const express = require('express')
const app = express()
app.set('view engine', 'ejs');
// use public forlder for css
app.use(express.static('public'));


app.listen(process.env.PORT || 5000, function (err) {
    if (err)
        console.log(err);
})

const https = require('https');



app.get('/profile/:id', function (req, res) {
    // console.log(req); 

    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`
    data = ""
    https.get(url, function (https_res) {
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
                // "summary": data.species.flavor_text_entries[0].flavor_text
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