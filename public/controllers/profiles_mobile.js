module.exports.run_setup = function (app) {
    
    const fetch = require('node-fetch');
    
    app.post("/profile_mobile_post", function(req, res) {
        var url = new URL('https://profilegen.sites.tjhsst.edu/profile_helper');
        var isValid = true;
        var params = req.body;
        console.log(params);
        
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
        
        if (isValid) {
            fetch(url)
                .then((response) => {
                    if (response.status === 500) {
                        throw new Error("email error");
                    }
                    console.log("profile_mobile_input: received");
                    return response.json();
                }).then((data) => { //just stick with params - it's the same as data here
                    var firstname = params.firstname.charAt(0).toUpperCase() + params.firstname.slice(1).toLowerCase();
                    var lastname = params.lastname.charAt(0).toUpperCase() + params.lastname.slice(1).toLowerCase();            
                    res.status(200).json({message: "Thanks for entering, " + firstname + " " +
                        lastname + "! Your " + params.instrument + " skills are top-notch. " + 
                        params.email + " is a pretty cool email."});
                }).catch((error) => {
                    if(error.message === "email error") {
                        res.json({message: "email is already in use!"});
                    } else {
                        res.json({message: "something went wrong!"});
                    }
                });
        } else {
            res.json({message: "Please enter all inputs correctly"})
        }
    });
    
    app.get("/profile_mobile_get", function(req, res) { //GET request - already has the queried parameters
        var url = new URL('https://profilegen.sites.tjhsst.edu/profile_helper');
        var params = req.query;
        var emptyCount = 0;    
        Object.keys(params).forEach(function(elem) {
            if (params[elem] !== '') {
                url.searchParams.append(elem, params[elem]);
            } else {
                emptyCount++;
            }
        })
        console.log(url);
        // console.log(params);
        
        if (emptyCount !== 4) {
            fetch(url)
                .then((response) => {
                    console.log("profile_mobile_search: received");
                    return response.json();
                }).then((data) => {
                    if (data['rowCount'] === 0) { //No results found
                        res.json({message: "No results found."});
                    } else {
                        console.log(data.rows);
                        var results = processSearch(data.rows);
                        results["message"] = "success";
                        console.log(results);
                        res.json(results);
                    }
                });
        } else {
            res.json({message: "Please fill out at least one input"});
        }
        
    });
    
    function processSearch(rows) {
        var results = []
        rows.forEach(function (entry) {
            results.push(entry);
        });
        return formatResults(results);
    }
    
    function formatResults(results) {
        var formattedResults = {};
        var count = 0;
        results.forEach(function (entry) {
            var firstname = entry['firstname'].charAt(0).toUpperCase() + entry['firstname'].slice(1).toLowerCase();
            var lastname = entry['lastname'].charAt(0).toUpperCase() + entry['lastname'].slice(1).toLowerCase();
            formattedResults[count] = firstname + " " + lastname + " (" + entry['email'] + "): " + entry['instrument'];                
            count += 1;
        });
        return formattedResults;
    }
    
}