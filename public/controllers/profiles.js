module.exports.run_setup = function (app) {

    const pg = require('pg');
    const bodyParser = require('body-parser');

    app.use(bodyParser.json()); 
    app.use(bodyParser.urlencoded({ extended: true })); 

    // var client = new pg.Client(process.env.DIRECTOR_DATABASE_URL);
    // client.connect();
    
    const pool = new pg.Pool({
        user: process.env.DIRECTOR_DATABASE_USERNAME,
        host: process.env.DIRECTOR_DATABASE_HOST,
        database: process.env.DIRECTOR_DATABASE_NAME,
        password: process.env.DIRECTOR_DATABASE_PASSWORD,
        port: process.env.DIRECTOR_DATABASE_PORT
    });

    pool.connect(function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log('connected!');
        }
    })

    app.get("/profile_input", function (req, res) {
        res.render('profile_input');
    });


    app.get("/profile_search", function (req, res) {
        res.render('profile_search');
    });

    app.get("/profile_helper", function (req, res) {
        processType = req.query.processType;
        var values = {};
        var query = {};
        var queryText = '';
        console.log("processType: " + processType);

        switch (processType) { // handles input, magicSearch, and search cases
            default:
                console.log("switch case error in profiles.js!");
                break;
            case 'input': //INPUT
                values = {
                    'firstname': req.query.firstname,
                    'lastname': req.query.lastname,
                    'instrument': req.query.instrument,
                    'email': req.query.email
                }
                query = {
                    text: 'INSERT INTO profiles(firstname, lastname, instrument, email) VALUES ($1, $2, $3, $4)',
                    values: [values['firstname'], values['lastname'], values['instrument'], values['email']]
                }
                break;
            case 'search': //SEARCH (does not use values or query object)
                delete req.query.processType;
                for (const [key, value] of Object.entries(req.query)) {
                    queryText += `${key}` + " = " + "'" + `${value}` + "'" + " AND "
                }
                queryText = queryText.substring(0, queryText.length - 5); //remove the last "AND "
            case 'magicSearch': //MAGICSEARCH
                values = {
                    'magicSearchTerm': req.query.magicSearchTerm
                }
                query = {
                    // text: 'SELECT * FROM profiles WHERE $1 IN (firstname, lastname, instrument, email)',
                    text: "SELECT * FROM profiles WHERE firstname LIKE $1 OR lastname LIKE $1" + 
                    " OR instrument LIKE $1 OR email LIKE $1",
                    values: ['%' + values['magicSearchTerm'] + '%']
                }
                break;
        }
        console.log("profile_helper: received");

        if (processType === 'search') { //search requires text type query
            var finalQuery = 'SELECT * FROM profiles WHERE ' + queryText
        } else { //input and magicsearch require object type query
            var finalQuery = query;
        }

        pool.query(finalQuery, (err, response) => {
            if (err) {
                console.log(err.detail);
                if (processType === 'input') { //warn the user of error (usually just duplicate email)
                    console.log("INPUT");
                    res.status(500).json({error: err.detail});
                }
            } else {
                // console.log(response);
                res.json(response);
            }
        });

    });
    
}