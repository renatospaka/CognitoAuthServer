import AWS from 'aws-sdk'
import { Bool } from 'aws-sdk/clients/clouddirectory'
import crypto from 'crypto'

require('dotenv').config()

class CognitoService {
  private config = {
    region: process.env.COGNITO_POOL_REGION
  }
  private secretHash: string =  process.env.COGNITO_CLIENT_APP_ID
  private clientId: string =  process.env.COGNITO_CLIENT_APP_ID

  private cognitoIdentity;
  constructor() {
    this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config)
  }

  public async signUpUser(username:string, password: string, userAttr: Array<any>): Promise<boolean> {
    const params = {
      ClientId: this.clientId,
      Password: password,
      Username: username,
      SecretHash: this.generateHash(this.secretHash),
      UserAttributes: username
    }

    try {
      const data = await this.cognitoIdentity.signUp(params).promise()
      return true
    } catch(error) {
      return false
    }
  }

  public async verifyAccount(username: string, code: string): Promise<boolean> {
    const params = {
      ClientId: this.clientId,
      confirmationPassword: code,
      Username: username,
      SecretHash: this.generateHash(this.secretHash)
    }

    try {
      const data = await this.cognitoIdentity.confirmSignUp(params).promise()
      return true
    } catch(error) {
      return false
    }
  }

  public async signInUser(username: string, password: string): Promise<boolean> {
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        'USER_NAME': username,
        'PASSWORD': password,
        'SECRET_HASH': this.generateHash(this.secretHash)
      }
    }

    try {
      let data = await this.cognitoIdentity.initiateAuth(params).promise()
      return true
    } catch(error) {
      return false
    }
  }

  private generateHash(key: string): string {
    return crypto.createHmac('SHA256', this.secretHash)
      .update(key + this.clientId)
      .digest('base64')
  }
}

export default CognitoService
