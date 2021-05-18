
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/public'));
// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
    //console.log("Got a GET request for the homepage");
    //res.send('Hello GET');
    res.sendFile(path.join(__dirname, '/index.html'));
    //res.writeHead(200, { 'content-type': 'text/html' })
   // fs.createReadStream('./index.html').pipe(res)
})

// This responds a POST request for the homepage
app.post('/', function (req, res) {
    console.log("Got a POST request for the homepage");
    res.send('Hello POST');
})

// This responds a DELETE request for the /del_user page.
app.delete('/del_user', function (req, res) {
    console.log("Got a DELETE request for /del_user");
    res.send('Hello DELETE');
})

// This responds a GET request for the /list_user page.
app.get('/list_user', function (req, res) {
    console.log("Got a GET request for /list_user");
    res.send('Page Listing');
})

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get('/ab*cd', function(req, res) {
    console.log("Got a GET request for /ab*cd");
    res.send('Page Pattern Match');
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})