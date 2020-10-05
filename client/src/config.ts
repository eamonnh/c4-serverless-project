// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '...'
export const apiEndpoint = `https://3tgxxsgyfg.execute-api.eu-west-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-ywg5i4do.eu.auth0.com',            // Auth0 domain
  clientId: '2QCIezKYg4owDEsCIHOlTYlWVrAylv2L',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
