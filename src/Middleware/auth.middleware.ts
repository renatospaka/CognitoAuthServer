import { Request, Response } from 'express'
import jwkToPem from 'jwk-to-pem'
import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'

let pems: { [key: string]: any } = {}

require('dotenv').config()
class AuthMiddleware {
  private poolRegion: string = process.env.COGNITO_POOL_REGION
  private userPoolId: string = process.env.COGNITO_USER_POOL_ID
  // private secretHash: string =  process.env.COGNITO_APP_CLIENT_SECRET_HASH
  // private clientId: string =  process.env.COGNITO_APP_CLIENT_ID

  constructor() {
    this.setUp()
  }

  private verifyToken(req: Request, res: Response, next): void {
    const token = req.header('Auth');
    console.log('token', token)
    if (!token) return res.status(401).end()

    let decodedJwt: any = jwt.decode(token, { complete: true })
    if (decodedJwt === null) {
      return res.status(401).end()
    }
    console.log('decodedJwt', decodedJwt)

    let kid = decodedJwt.header.kid
    let pem = pems[kid]
    console.log('pem', pem)
    if (!pem) {
      return res.status(401).end()
    }
    
    jwt.verify(token, pem, function (err: any, payload: any) {
      if (err) {
        return res.status(401).end()        
      } else {
        next()
      }
    })
  }

  private async setUp() {
    const URL = `https://cognito-idp.${this.poolRegion}.amazonaws.com/${this.userPoolId}/.well-known/jwks.json`

    try {
      const response = await fetch(URL)
      if (response.status !== 200) {
        throw 'request not successful'
      }
      
      const data = await response.json()
      const { keys } = data
      for (let i = 0; i < keys.length; i++) {
        const key_id = keys[i].kid
        const modulus = keys[i].n
        const exponent = keys[i].e
        const key_type = keys[i].kty
        const jwk = { kty: key_type, n: modulus, e: exponent }
        const pem = jwkToPem(jwk)
        pems[key_id] = pem
      }
      console.log("got PEMS")
    } catch (error) {
      console.log(error)
      console.log('Error! Unable to download JWKs')
    }
  }
}

export default AuthMiddleware
