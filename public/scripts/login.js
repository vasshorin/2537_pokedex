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
            console.log(x)
            console.log(Object.values(x))
            console.log("_------------------")
            console.log(Object.keys(x))
        }
    })
}

function setup() {
    console.log("setup12321")
    $('body').on('click', '#login', authenticateUser)
}

$(document).ready(setup)