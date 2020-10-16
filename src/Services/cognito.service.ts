import AWS from 'aws-sdk'
import crypto from 'crypto'

require('dotenv').config()

class CognitoService {
  private config = {
    region: process.env.COGNITO_POOL_REGION
  }
  private secretHash: string =  process.env.COGNITO_APP_CLIENT_SECRET_HASH
  private clientId: string =  process.env.COGNITO_APP_CLIENT_ID

  private cognitoIdentity;
  constructor() {
    this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config)
  }

  public async signUpUser(username:string, password: string, userAttr: Array<any>): Promise<boolean> {
    const params = {
      ClientId: this.clientId,
      Password: password,
      Username: username,
      SecretHash: this.generateHash(username),
      UserAttributes: userAttr
    }
    try {
      const data = await this.cognitoIdentity.signUp(params).promise()
      //console.log('Deu certo!', data)
      return true
    } catch(error) {
      //console.log('Deu bosta...', error)
      return false
    }
  }

  public async verifyAccount(username: string, code: string): Promise<boolean> {
    const params = {
      ClientId: this.clientId,
      ConfirmationCode: code,
      Username: username,
      SecretHash: this.generateHash(username)
    }
    try {
      const data = await this.cognitoIdentity.confirmSignUp(params).promise()
      //console.log('Deu certo!', data)
      return true
    } catch(error) {
      //console.log('Deu bosta...', error)
      return false
    }
  }

  public async signInUser(username: string, password: string): Promise<boolean> {
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        'USERNAME': username,
        'PASSWORD': password,
        'SECRET_HASH': this.generateHash(username)
      }
    }
    try {
      let data = await this.cognitoIdentity.initiateAuth(params).promise()
      console.log('Deu certo!', data)
      return true
    } catch(error) {
      console.log('Deu bosta...', error)
      return false
    }
  }

  public async forgotPassword(username: string): Promise<boolean> {
    const params = {
      ClientId: this.clientId,  /* required */
      Username: username,       /* required */
      SecretHash: this.generateHash(username),
    }
    try {
      const data = await this.cognitoIdentity.forgotPassword(params).promise();
      console.log('Deu certo!', data)
      return true
    } catch (error) {
      console.log('Deu bosta...', error)
      return false;
    }
  }

  public async confirmNewPassword(username: string, password: string, code: string): Promise<boolean> {
    var params = {
      ClientId: this.clientId,  /* required */
      ConfirmationCode: code,   /* required */
      Password: password,       /* required */
      Username: username,       /* required */
      SecretHash: this.generateHash(username),
    };
    try {
      const data = await this. cognitoIdentity.confirmForgotPassword(params).promise();
      console.log('Deu certo!', data)
      return true;
    } catch (error) {
      console.log('Deu bosta...', error)
      return false;
    }
  }

  private generateHash(username: string): string {
    return crypto.createHmac('SHA256', this.secretHash)
      .update(username + this.clientId)
      .digest('base64')
  }
}

export default CognitoService
