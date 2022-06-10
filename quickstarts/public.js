'use strict';

const express = require('express');


(async () => {
    
    const app = express();
    
    //===============================================
    //  IMPORT LIB CUSTOM & APPLICATION MIDDLEWARE
    //===============================================
    const adapter = require('../OpenIdExpressAdapter');
    const openIdAdapter = new adapter({
        realm: 'keycloak-express',
        client_id: 'keycloak-express',
        client_secret: 'long_secret-here--????',
        redirect_uris: ['http://localhost:3000/auth/callback'],
        post_logout_redirect_uris: ['http://localhost:3000/logout/callback'],
        response_types: ['code'],
    });
    await openIdAdapter.init();

    app.use(openIdAdapter.middleware());

    //===============================================
    //  SECURISATION DES ROUTES
    //===============================================
    app.get('/login', openIdAdapter.login());
    app.get('/auth/callback', openIdAdapter.loginCallback());

    app.get('/welcome', openIdAdapter.checkAuthenticated(), (req, res) => {
        res.json({message: "ACCES AUTORISE A LA ROUTE PROTEGEE"});
    });

    //unprotected route
    app.get('/',function(req,res){
        res.json({message: "public route"});
    });

    // start logout request
    app.get('/logout', openIdAdapter.logout());
    // logout callback
    app.get('/logout/callback', openIdAdapter.logoutCallback());


    app.listen(3000, function () {
        console.log('Listening at http://localhost:3000');
    });

})();