var tableHeader = '<tr><th>First Name</th><th>Last Name</th><th>Instrument</th><th>Email</th></tr>';
function magicSearch(processType) {
    var url = new URL('https://profilegen.sites.tjhsst.edu/profile_helper');
    var isEmpty = false;

    var params = {
        'magicSearchTerm': document.querySelector('input[name=magicSearchTerm]').value.toLowerCase(),
        'processType': processType
    }

    Object.keys(params).forEach(function (elem) {
        if (params[elem] === '') {
            isEmpty = true;
        }
        url.searchParams.append(elem, params[elem])
    })

    console.log(url);
    console.log(params);

    if (!isEmpty) {
        fetch(url)
            .then((response) => {
                console.log("profile_magic_search: received"); //appears in js console
                return response.json()
            })
            .then((data) => {
                console.log(data);
                if (data['rowCount'] === 0) { //No results found
                    clearAll();
                    document.getElementById('returnMessage').innerHTML = "No results found."
                } else {
                    document.getElementById('returnMessage').innerHTML = '';
                    processMagicSearch(data.rows);
                    console.log(data);
                }
            });
    } else {
        // return the error message
        clearAll();
        document.getElementById('returnMessage').innerHTML = "Please fill out a magic search input."
    }

}

function processMagicSearch(rows) {
    document.getElementById('fname').value = "";
    document.getElementById('lname').value = "";
    document.getElementById('instrument').value = "";
    document.getElementById('email').value = "";
    var results = [];
    rows.forEach(function (entry) {
        results.push(entry);
    });
    console.log(results)
    showMagicSearchResult(results)
}

function showMagicSearchResult(results) {
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