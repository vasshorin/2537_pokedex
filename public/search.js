type_g = ''

// Colors for pokemon types
const colors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0', 
    electric: '#FCF7DE', 
    water: '#DEF3FD', 
    ground: '#f4e7da', 
    rock: '#d5d5d4', 
    fairy: '#fceaff', 
    poison: '#98d7a5', 
    bug: '#f8d5a3', 
    dragon: '#97b3e6', 
    psychic: '#eceda1', 
    flying: '#F5F5F5', 
    fighting: '#E6E0D4', 
    normal: '#F5F5F5',
    ice: "42ecf5"
}

// Gets pokemon from pokemon api and displays it in the pokemon div
function getPokemon(e){
    var entry = document.querySelector("#pokemonEntry").value;
    var searchType = $("#search_type").val();
    var number = parseInt(entry);
    // only run if input is a number and search type is id
    if (searchType == "id" && !isNaN(number)){
        document.querySelector(".pokemon").style.display = "block";
        $("main").empty()
        fetch(`https://pokeapi.co/api/v2/pokemon/${entry}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.querySelector(".pokemon").innerHTML = `
            <div class="pokemon-name">
                <h1>${data.name}</h1>
            </div>
            <div class="pokemon-image">
                <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}">
            </div>
            <div class="pokemon-info">
                <div class="pokemon-info-name">
                    <h2>${data.name}</h2>
                </div>
                <div class="pokemon-info-type">
                    <h3>Type:</h3>
                    <ul>
                        ${data.types.map(type => `<li>${type.type.name}</li>`).join('')}
                    </ul>
                </div>
                <div class="pokemon-info-stats">
                    <h3>Stats:</h3>
                    <ul>
                        ${data.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
                    </ul>
                </div>
                <div class="pokemon-info-abilities">
                    <h3>Abilities:</h3>
                    <ul>
                        ${data.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('')}
                    </ul>
                </div>
            </div>
            `;

            // change div background color based on type of pokemon
            var type = data.types[0].type.name;
            document.querySelector(".pokemon").style.backgroundColor = colors[type];
        }
        ).catch(error => console.log(error));
        // if search type is name and entry is a string and is not a number
    } else if (searchType == "name" && typeof entry == "string" && isNaN(entry)){
        console.log("Inside second if" + entry)
        document.querySelector(".pokemon").style.display = "block";
        $("main").empty()
        fetch(`https://pokeapi.co/api/v2/pokemon/${entry}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.querySelector(".pokemon").innerHTML = `
            <div class="pokemon-name">
                <h1>${data.name}</h1>
            </div>
            <div class="pokemon-image">
                <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}">
            </div>
            <div class="pokemon-info">
                <div class="pokemon-info-name">
                    <h2>${data.name}</h2>
                </div>
                <div class="pokemon-info-type">
                    <h3>Type:</h3>
                    <ul>
                        ${data.types.map(type => `<li>${type.type.name}</li>`).join('')}
                    </ul>
                </div>
                <div class="pokemon-info-stats">
                    <h3>Stats:</h3>
                    <ul>
                        ${data.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
                    </ul>
                </div>
                <div class="pokemon-info-abilities">
                    <h3>Abilities:</h3>
                    <ul>
                        ${data.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('')}
                    </ul>
                </div>
            </div>
            `;

            // change div background color based on type of pokemon
            var type = data.types[0].type.name;
            document.querySelector(".pokemon").style.backgroundColor = colors[type];
        }
        ).catch(error => console.log(error));
    } else {
        console.log("not a number")
    }
}



// processes the response from the pokemon api and displays it in the pokemon div
function processPokeResponse(data){
    if (data.types.length > 0 && data.types[0].type.name == type_g){
        $("main").append(`
        <div class="pokemon-card">
            <div class="pokemon-card-image">
                <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}">
            </div>
            <div class="pokemon-card-info">
                <div class="pokemon-card-info-name">
                    <h2>Name:${data.name} weight: ${data.weight} height: ${data.height}</h2>
                </div>
                <div class="pokemon-card-info-type">
                    <h3>Type:</h3>
                    <ul>
                        ${data.types.map(type => `<li>${type.type.name}</li>`).join('')}
                    </ul>
                </div>
                <div class="pokemon-card-info-stats">
                    <h3>Stats:</h3>
                    <ul>
                        ${data.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
        `);
        //add border around pokemon
        $(".pokemon-card").css("border", "1px solid black");
        
        //change div background color based on type of pokemon
            var type = data.types[0].type.name;
            document.querySelector("body").style.backgroundColor = colors[type];
    }
}


function display(type_){
    $("main").empty()
    type_g = type_
    for (i = 1; i < 777; i++){
        // for each pokemon
        $.ajax({
            type: "get",
            url: `https://pokeapi.co/api/v2/pokemon/${i}`,
            success: processPokeResponse
        })
    }
}


function setup(){

    display($("#poke_type option:selected").val());
    $("#poke_type").change(() => {
        poke_type = $("#poke_type option:selected").val();
        display(poke_type); 
      })

      $("#pokemonEntry").keyup(() => {
        getPokemon();
        //if input is empty, hide pokemon div
        if ($("#pokemonEntry").val() == ''){
            document.querySelector(".pokemon").style.display = "none";
            display($("#poke_type option:selected").val());
        } else {
            document.querySelector("body").style.backgroundColor = "white";
        }
        });
}


$(document).ready(setup)