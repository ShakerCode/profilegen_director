#!/usr/bin/nodejs

var express = require('express')
var app = express();
var hbs = require('hbs');
var path = require('path')
var favicon = require('serve-favicon');

app.set('port', process.env.PORT || 8080 );
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname,'static')));
app.use(favicon(path.join(__dirname, 'static', 'images', 'favicon.ico')));
var controllers = require('./controllers');

app.get('/', function(req, res){
    res.render('index');
});

controllers.do_setup(app);

var listener = app.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});