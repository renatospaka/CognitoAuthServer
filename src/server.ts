import * as bodyParser from 'body-parser'
import App from './app'
import HomeController from './Controllers/home.controller'
import AuthController from './Controllers/auth.controller'
import ProtectedController from './Controllers/protected.controller'

const app = new App({
  port: 3033,
  controllers: [
    new HomeController(),
    new AuthController(),
    new ProtectedController()
  ],
  middlewares: [
      bodyParser.json(),
      bodyParser.urlencoded({ extended: true }),
  ]
})

app.listen()
