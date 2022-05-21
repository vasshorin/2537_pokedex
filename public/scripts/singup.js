async function storeNewUser() {
    newFirstName = $('#newFirstName').val()
    newLastName = $('#newLastName').val()
    newUserEmail = $('#newUserEmail').val()
    newUsername = $('#newUsername').val()
    newPassword = $('#newPassword').val()
    currentTime = new Date()
    console.log(newFirstName, newLastName, newUserEmail, newUsername, newPassword, currentTime)
    await $.ajax({
        url: 'http://localhost:5003/signup/create',
        type: 'PUT',
        data: {
            firstName: newFirstName,
            lastName: newLastName,
            email: newUserEmail,
            username: newUsername,
            password: newPassword,
            time: currentTime,
            shoppingCart: [
                {
                    pokemonID: "",
                    quantity: 0,
                    price: 0
                }
            ]
        },
        success: (x) => {
            console.log(x)
        }
    })
}

function setup() {
    $("#messageToDisplay").hide();
    $('body').on('click', '#submit', storeNewUser);
}

$(document).ready(setup)
