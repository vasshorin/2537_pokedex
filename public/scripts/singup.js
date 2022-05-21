async function storeNewUser() {
    newFirstName = $('#newFirstName').val()
    newLastName = $('#newLastName').val()
    newUserEmail = $('#newUserEmail').val()
    newUsername = $('#newUsername').val()
    newPassword = $('#newPassword').val()
    currentTime = new Date()
    // console.log(newFirstName, newLastName, newAge, newUserEmail, newUsername, newPassword, newLocation, currentTime)
    await $.ajax({
        url: 'http://localhost:5003/signup/create',
        type: 'PUT',
        data: {
            firstname: newFirstName,
            lastname: newLastName,
            email: newUserEmail,
            username: newUsername,
            password: newPassword,
            time: currentTime
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
