// ========================================================
//  IMPORTS
// ========================================================
const expressSession = require('express-session');
const passport = require('passport');
const { Issuer, Strategy } = require('openid-client');


// ========================================================
//  NEW ADAPTER
// ========================================================
function OpenIdExpressAdapter(config = {realm: 'keycloak-express'}) {
    this.config = config;
}

// ========================================================
//  INIT ADAPTER
// ========================================================
OpenIdExpressAdapter.prototype.init = async function() {
    // use the issuer url here
    const keycloakIssuer = await Issuer.discover(`http://localhost:8080/realms/${this.config.realm}`)
    // don't think I should be console.logging this but its only a demo app
    // nothing bad ever happens from following the docs :)
    console.log('Discovered issuer %s %O', keycloakIssuer.issuer, keycloakIssuer.metadata);


    const client = new keycloakIssuer.Client({
        client_id: this.config.client_id,
        client_secret: this.config.client_secret,
        redirect_uris: [...this.config.redirect_uris],
        post_logout_redirect_uris: [...this.config.post_logout_redirect_uris],
        response_types: [...this.config.response_types],
    });
    this.client = client;
    

    // this creates the strategy
    passport.use('oidc', new Strategy({client}, (tokenSet, userinfo, done)=>{
        return done(null, tokenSet.claims());
    })
    )

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

}

// ========================================================
//  EXPRESS MIDDLEWARE
// ========================================================
OpenIdExpressAdapter.prototype.middleware = () => {
    let memoryStore = new expressSession.MemoryStore();
    
    return [
        expressSession({
            secret: 'another_long_secret',
            resave: false,
            saveUninitialized: true,
            store: memoryStore
        }),
        passport.initialize(),
        passport.authenticate('session'),
    ];
}

OpenIdExpressAdapter.prototype.login = function () {
    return (req, res, next) => {
        passport.authenticate('oidc')(req, res, next);
    };
}

OpenIdExpressAdapter.prototype.loginCallback = function () {
    return (req, res, next) => {
        passport.authenticate('oidc', {
          successRedirect: '/welcome',
          failureRedirect: '/'
        })(req, res, next);
    };
}

OpenIdExpressAdapter.prototype.logout = function () {
    return (req, res, next) => {
        res.redirect(this.client.endSessionUrl(/* add {id_token_hint:'...'} parameter*/ ));
        if(next) {
            next();
        }
    };
}

OpenIdExpressAdapter.prototype.logoutCallback = function () {
    return (req, res, next) => {
        // clears the persisted user from the local storage
        req.logout();
        // redirects the user to a public route
        res.redirect('/');
    };
}

// use this function to protect all routes
OpenIdExpressAdapter.prototype.checkAuthenticated = () => {
    return (req, res, next) => {
        console.log(`Check...`)
        if (req.isAuthenticated()) {  // req.isAuthenticated is populated by password.js
            console.log(`Access autorisé.`)
            return next();
        }
        return res.status(403).json({message: "Vous devez vous identifier. Utilisez la route /login"})
        // Sinon redirection directe ? res.redirect("/login")
    };
}



module.exports = OpenIdExpressAdapter;