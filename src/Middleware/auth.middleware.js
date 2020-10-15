// exports.Validate = function(req, res, next){
//   console.log(pool_region);
//   console.log(poolData.UserPoolId);
  
//   const token = req.headers['authorization'];
//   request({ url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
//     json: true }, 
//     function(error, response, body) {
//       if (!error && response.statusCode === 200) {
//         pems = {};
//         const keys = body['keys'];
//         for(let i = 0; i < keys.length; i++) {
//           const key_id = keys[i].kid;
//           const modulus = keys[i].n;
//           const exponent = keys[i].e;
//           const key_type = keys[i].kty;
//           const jwk = { kty: key_type, n: modulus, e: exponent};
//           const pem = jwkToPem(jwk);
//           pems[key_id] = pem;
//         }
        
//         const decodedJwt = jwt.decode(token, {complete: true});
//         if (!decodedJwt) {
//           console.log("Not a valid JWT token");
//           res.status(401);
//           return res.send("Invalid token");
//         };

//         const kid = decodedJwt.header.kid;
//         const pem = pems[kid];
//         if (!pem) {
//           console.log('Invalid token');
//           res.status(401);
//           return res.send("Invalid token");              
//         };
              
//         jwt.verify(token, pem, function(err, payload) {
//           if(err) {
//             console.log("Invalid Token.");
//             res.status(401);
//             return res.send("Invalid tokern");
//           } else {
//             console.log("Valid Token.");
//             return next();
//           }
//         });
//       } else {
//         console.log("Error! Unable to download JWKs");
//         res.status(500);
//         return res.send("Error! Unable to download JWKs");
//       }
//     });
//   }