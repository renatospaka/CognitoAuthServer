import express from 'express'
import { Application } from 'express'
import AWS from 'aws-sdk'

class App {
  public app: Application
  public port: number

  constructor(appInit: { port: number, controllers: any, middlewares: any }) {
    this.app = express()
    
    this.port = appInit.port
    this.middlewares(appInit.middlewares)
    this.routes(appInit.controllers)
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Cognito Auth Server has started on port ${this.port}`)
    })

    // require('dotenv').config()
    // const config = {
    //   region: process.env.COGNITO_POOL_REGION
    // }
    // const secretHash: string =  process.env.COGNITO_APP_CLIENT_ID
    // const clientId: string =  process.env.COGNITO_APP_CLIENT_ID
    // const cognitoIdentity = new AWS.CognitoIdentityServiceProvider(config)
    // //console.log(cognitoIdentity)

    // const params = { MaxResults: 5 }
    // cognitoIdentity.listUserPools(params, function(err, data) {
    //   if (err) {
    //     console.log('Deu merda', err, err.stack)
    //   } else {
    //     console.log("Esse é o user-pool", data)
    //   }
    // })
  }

  private middlewares(middlewares: any) {
    middlewares.forEach(middleware => {
      this.app.use(middleware)
    })
  }

  private routes(controllers: any) {
    controllers.forEach(controller => {
      this.app.use(controller.path, controller.router)
    })
  }
}

export default App
