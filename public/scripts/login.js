async function authenticateUser() {
    email = $('#email').val()
    password = $('#password').val()
    console.log(email, password)
    await $.ajax({
        url: 'http://localhost:5003/login/authentication',
        type: 'POST',
        data: {
            email: email,
            password: password
        },
        success: (x) => {
            console.log("extra" + x)
        }
    })
}

function setup() {
    console.log("setup")
    $('body').on('click', '#login', authenticateUser)
}

$(document).ready(setup)