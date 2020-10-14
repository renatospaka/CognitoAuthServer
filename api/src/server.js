const app = require('../src/app');


// const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
// require('dotenv').config();

// global.fetch = require('node-fetch');
// global.navigator = () => null;

// const poolData = {
//   UserPoolId: process.env.COGNITO_USER_POOL_ID,
//   ClientId: process.env.COGNITO_CLIENT_APP_ID
// };
// const pool_region = process.env.COGNITO_POOL_REGION;
// // console.log(poolData.ClientId);
// // console.log(poolData.UserPoolId);
// // console.log(pool_region);

// const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
// const thisUser = userPool.getCurrentUser()
// console.log(thisUser);

const server = app.listen(3033, () => { console.log('Server is running on port 3033') });
