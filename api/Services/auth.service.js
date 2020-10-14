const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

global.fetch = require('node-fetch');
global.navigator = () => null;
require('dotenv').config();

const poolData = {
  UserPoolId: process.env.COGNITO_USER_POOL_ID,
  ClientId: process.env.COGNITO_CLIENT_APP_ID
};

const pool_region = process.env.COGNITO_POOL_REGION;
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
exports.signUp = function (body, callback) {
  const name = body.name;
  const email = body.email;
  const password = body.password;
  const attributeList = [];
  
  attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email }));
  userPool.signUp(name, password, attributeList, null, function (err, result) {
    if (err)
      callback(err);
    const cognitoUser = result.user;
    callback(null, cognitoUser);
  })
};


exports.logIn = function (body, callback) {
  const userName = body.name;
  const password = body.password;
  
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: userName,
    Password: password
  });
  const userData = {
      Username: userName,
      Pool: userPool
  }

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      const accesstoken = result.getAccessToken().getJwtToken();
      callback(null, accesstoken);
    },
    onFailure: (function (err) {
      callback(err);
    })
  })
};

exports.Validate = function(token, callback) {
  request({ url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
    json: true }, 
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        pems = {};
        const keys = body['keys'];
        for(let i = 0; i < keys.length; i++) {
          const key_id = keys[i].kid;
          const modulus = keys[i].n;
          const exponent = keys[i].e;
          const key_type = keys[i].kty;
          const jwk = { kty: key_type, n: modulus, e: exponent};
          const pem = jwkToPem(jwk);
          pems[key_id] = pem;
        }
    
        const decodedJwt = jwt.decode(token, {complete: true});
        if (!decodedJwt) {
          console.log("Not a valid JWT token");
          callback(new Error('Not a valid JWT token'));
        }
    
        const kid = decodedJwt.header.kid;
        const pem = pems[kid];
        if (!pem) {
          console.log('Invalid token');
          callback(new Error('Invalid token'));
        }
    
        jwt.verify(token, pem, function(err, payload) {
          if(err) {
            console.log("Invalid Token.");
            callback(new Error('Invalid token'));
          } else {
            console.log("Valid Token.");
            callback(null, "Valid token");
          }
        });
      } else {
        console.log("Error! Unable to download JWKs");
        callback(error);
      }
  });
}