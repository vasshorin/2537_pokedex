
to_add = ''

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

function processPokeResp(data){
    // console.log(data)
     // 3- process the reponse and extract the img
     to_add += `
      <div class="image_container">
      <a href="/profile/${data.id}">  
      <p class="type">${data.name}</p>
      <img src="${data.sprites.other["official-artwork"].front_default}">
        <p class="type">${data.types[0].type.name}</p>
      </a>
      </div>`
}

async function loadNineImages() {
    for (i = 1; i <= 9; i++) { // Nine times
        if (i % 3 == 1) { // only when i= 1, 4, 7
            to_add += `<div class="images_group">`
        }
        
        // 1- generate randome numebers 
        x =  Math.floor(Math.random() * 777) + 1

        // 2- init a AJAX request to pokeapi.co
        await $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon/${x}/`,
            success: processPokeResp
        })

       

        if (i % 3 == 0) { // only when i= 3, 6, 9
            to_add += `</div>`
        }
    }
    jQuery("main").html(to_add)
}

function setup() {
    loadNineImages();
    // events handlers
}

jQuery(document).ready(setup)