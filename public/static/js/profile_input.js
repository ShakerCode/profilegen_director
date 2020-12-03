function sendProfile(processType) {
    var url = new URL('https://profilegen.sites.tjhsst.edu/profile_helper');
    var isValid = true;
    var params = {
        'firstname': document.querySelector('input[name=fname]').value.trim().toLowerCase(),
        'lastname': document.querySelector('input[name=lname]').value.trim().toLowerCase(),
        'instrument': document.querySelector('input[name=instrument]').value.trim().toLowerCase(),
        'email': document.querySelector('input[name=email]').value.trim().toLowerCase(),
        'processType': processType
    }

    Object.keys(params).forEach(function (elem) {
        if (params[elem] === ''  || (elem !== 'email' && !/^[a-zA-Z ]+$/.test(params[elem]))
            || params[elem].trim().length === 0) {
             //if input is blank or contains non-alphabetical characters (not including email)
             //or is made entirely of spaces
            isValid = false;
        } else {
            url.searchParams.append(elem, params[elem]);
        }
    })

    console.log(url);
    console.log(params);

    if (isValid) {
        fetch(url)
            .then((response) => {
                if (response.status === 500) { //set as email duplicate error in profiles.js
                    throw new Error("email error");
                }
                console.log("profile_input: received"); //appears in js console
                return response.json();
            })
            .then((data) => {
                updateMessage(params); //same as what the response is - data is useless here
            }).catch((error) => {
                if (error.message === "email error") {
                    document.getElementById('returnMessage').innerHTML = "email is already in use!";
                }
                console.error("ERROR: ", error);

            });
    } else {
        // return the error message
        document.getElementById('returnMessage').innerHTML = "Please fill out all of the inputs correctly."
    }

}
function updateMessage(data) {
    firstname = data['firstname'].charAt(0).toUpperCase() + data['firstname'].slice(1).toLowerCase();
    lastname = data['lastname'].charAt(0).toUpperCase() + data['lastname'].slice(1).toLowerCase();
    document.getElementById('returnMessage').innerHTML = "Thanks for entering, " +
        firstname + " " + lastname + "! Your " + data['instrument'] + " skills are top-notch. " + data['email'] + " is a pretty cool email."
}

function inputclearAll() {
    document.getElementById('fname').value = "";
    document.getElementById('lname').value = "";
    document.getElementById('instrument').value = "";
    document.getElementById('email').value = "";
    document.getElementById('returnMessage').innerHTML = "";
}