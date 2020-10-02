import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { Jwks, Key } from '../../auth/Jwks'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-ywg5i4do.eu.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  
  

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/

  
    //Follow 6 steps from https://auth0.com/blog/navigating-rs256-and-jwks/

    //1. Retrieve the JWKS and filter for potential signature verification keys
    const jwks = await Axios.get(jwksUrl);
    logger.info(jwks)

    var jwksKeys: Jwks = jwks.data.keys;
    logger.info(jwksKeys)

    //2. Extract the JWT from the request's authorization header. [Note this code was provided in starter template]
    const token = getToken(authHeader)
    logger.info(token)

    const jwt: Jwt = decode(token, { complete: true }) as Jwt
    logger.info(jwt)
    
    //3. Decode the JWT and grab the kid property from the header.
    const jwtKid = jwt.header.kid
    logger.info(jwtKid)

    //4. Find the signature verification key in the filtered JWKS with a matching kid property. 
    const signatureVerificationKey: Key = Object.values(jwksKeys).filter(key => key.kid == jwtKid)[0]
    //const signatureVerificationKey: Key = jwksKeys.keys.find(key => key.kid === jwtKid)[0];
    logger.info(signatureVerificationKey)

    //5. Using the x5c property build a certificate which will be used to verify the JWT signature.
    let x5cCertificate = `-----BEGIN CERTIFICATE-----\n${signatureVerificationKey.x5c[0]}\n-----END CERTIFICATE-----`;
    logger.info('X5C Certificate is ', x5cCertificate)

    //6. Ensure the JWT contains the expected audience, issuer, expiration, etc.
    verify(token,x5cCertificate)
    
    return Promise.resolve(jwt.payload);
  
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authorization header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authorization header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
