curl -X POST \
  -d "client_id=keycloak-express" \
  -d "username=USERNAME" \
  -d "password=1234" \
  -d "grant_type=password" \
  "http://localhost:8080/realms/keycloak-express/protocol/openid-connect/token"