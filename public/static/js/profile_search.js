var tableHeader = '<tr><th>First Name</th><th>Last Name</th><th>Instrument</th><th>Email</th></tr>';
function search(processType) {
    var url = new URL('https://profilegen.sites.tjhsst.edu/profile_helper');
    var params = {
        'firstname': document.querySelector('input[name=fname]').value.trim().toLowerCase(),
        'lastname': document.querySelector('input[name=lname]').value.trim().toLowerCase(),
        'instrument': document.querySelector('input[name=instrument]').value.trim().toLowerCase(),
        'email': document.querySelector('input[name=email]').value.trim().toLowerCase(),
        'processType': processType
    }

    var emptyCount = 0;
    Object.keys(params).forEach(function (elem) {
        if (params[elem] !== '') {
            url.searchParams.append(elem, params[elem]);
        } else {
            emptyCount++;
        }
    })

    console.log(url);
    console.log(params);

    if (emptyCount !== 4) { //none of the inputs have been filled out (only the processType is filled by default)
        fetch(url)
            .then((response) => {
                console.log("profile_search: received"); //appears in js console
                return response.json()
            })
            .then((data) => {
                console.log(data);
                if (data['rowCount'] === 0) { //No results found
                    clearAll();
                    document.getElementById('returnMessage').innerHTML = "No results found."
                } else {
                    document.getElementById('returnMessage').innerHTML = '';
                    processSearch(data.rows);
                    console.log(data);
                }
            });
    } else {
        clearAll();
        document.getElementById('returnMessage').innerHTML = "Please fill out at least one criteria search input."
    }


}

function processSearch(rows) {
    document.getElementById('magicSearchTerm').value = "";
    var results = [];
    rows.forEach(function (entry) {
        results.push(entry);
    });
    console.log(results)
    showSearchResult(results)
}

function showSearchResult(results) {
    var resultsTable = document.getElementById("resultsTable");
    resultsTable.innerHTML = tableHeader;
    console.log("MAKING TABLE");
    results.forEach(function (entry) {
        var newRow = resultsTable.insertRow(-1);
        newRow.insertCell(0).innerHTML = entry['firstname'].charAt(0).toUpperCase() + entry['firstname'].slice(1).toLowerCase();
        newRow.insertCell(1).innerHTML = entry['lastname'].charAt(0).toUpperCase() + entry['lastname'].slice(1).toLowerCase();
        newRow.insertCell(2).innerHTML = entry['instrument'];
        newRow.insertCell(3).innerHTML = entry['email'];
    })
}

function clearAll() {
    document.getElementById('fname').value = "";
    document.getElementById('lname').value = "";
    document.getElementById('instrument').value = "";
    document.getElementById('email').value = "";
    document.getElementById('magicSearchTerm').value = "";
    document.getElementById('returnMessage').innerHTML = "";
    document.getElementById('resultsList').innerHTML = "";
    document.getElementById('resultsTable').innerHTML = tableHeader;
}