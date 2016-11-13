var express = require("express");
var path = require("path");

/*
Good thing we're a single page app, so we only have 1 route. haha
hahhahahahahahhahahahhahaha
*/

exports.createRoutes = function(app){
    app.use(express.static(path.resolve(__dirname, 'client')));
    
    //app.get("/", )
}