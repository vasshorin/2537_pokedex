var now = new Date(Date.now());
var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

function loadEventsToMainDiv() {
    var post = 1;
    $.ajax({
        url: "https://desolate-refuge-07915.herokuapp.com/timelinetimeline/getAllEvents",
        type: "get",
        success: (r)=>{
            console.log(r)
            for( i = 0 ; i < r.length; i++  ){
                $("main").append(`
                <div id="posts">
        <div class="post">
            <div class="post-header">
                <h2>
                    Post ${post}
                </h2>
            </div>
            <div class="post-body">
                <p>
                    ${r[i].text}
                </p>
                <hr>
                <p> at time <span id="time">${r[i].time}</span> with <span id="likes">${r[i].hits}</span> likes</p>
                <button class="likeButtons" id="${r[i]["_id"]}"> Like! </button> 
                <button class="deleteButtons" id="${r[i]["_id"]}"> Delete! </button> 
            </div>
        </div>     
                    `)
                    post++;         
            }
           
        }
    })
}



function submitForm() {
    var text = $("#text").val();
    var time = formatted;
    var hits = 1;
    $.ajax({
        url: "https://desolate-refuge-07915.herokuapp.com/timeline/insert",
        type: "put",
        data: {
            text: text,
            time: time,
            hits: hits
        },
        success: (r)=>{
            console.log(r)
            $("main").empty()
            loadEventsToMainDiv()
        }
    })
}




function deleteEvent(){
    x = this.id
    $.ajax({
        url: `https://desolate-refuge-07915.herokuapp.com/timeline/delete/${x}`,
        type: "get",
        success: (r)=>{
            console.log(r)
            $("main").empty()
            loadEventsToMainDiv()
        }
    })
}


function increaseHits(){
    x = this.id
    $.ajax({
        url: `https://desolate-refuge-07915.herokuapp.com/timeline/inscreaseHits/${x}`,
        type: "get",
        success: function (x){
            console.log(x)
            $("main").empty()
            loadEventsToMainDiv()
        }
    })
}

function setup(){

    loadEventsToMainDiv()

    $("#submit").on("click", submitForm)
    $("body").on("click", ".likeButtons", increaseHits)
    $("body").on("click", ".deleteButtons", deleteEvent)
}



$(document).ready(setup)