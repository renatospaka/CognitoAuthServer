const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
require('dotenv').config();

global.fetch = require('node-fetch');
global.navigator = () => null;

const poolData = {
  UserPoolId: process.env.COGNITO_USER_POOL_ID,
  ClientId: process.env.COGNITO_CLIENT_APP_ID
};

const pool_region = process.env.COGNITO_POOL_REGION;
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
exports.Register = function (body, callback) {
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


exports.Login = function (body, callback) {
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