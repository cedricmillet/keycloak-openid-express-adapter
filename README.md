# OpenId Express Adapter


## Run quick start

Before you have to start keycloak server instance 
`docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:18.0.0 start-dev`

## Access Type = PUBLIC
 * Run keycloak, go to admin console
 * Create new realm `keycloak-express`
 * Create a new client `keycloak-express` (rootUrl=`http://localhost:3000`, Access Type=`public`)
 * Run demo app with `node quickstarts/public.js` then open `http://localhost/login`

## Access Type = BEARER ONLY