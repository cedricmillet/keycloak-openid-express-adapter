const express = require("express");
const Keycloak = require("keycloak-connect")


const keycloak = new Keycloak({});
const app = express();
app.use( keycloak.middleware());

app.get('/api', keycloak.protect(), function(req, res){
    res.send("This is API!");
 });
 
app.get('/', function(req, res){
    res.send("Server is up!");
 });
 
 app.listen(3050, () => {
    console.log(`Listening on 3050`)
 });