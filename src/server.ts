import * as bodyParser from 'body-parser'
import App from './app'
import HomeController from "./Controllers/home.controller"

const app = new App({
  port: 3033,
  controllers: [
    new HomeController()
  ],
  middleWares: [
      bodyParser.json(),
      bodyParser.urlencoded({ extended: true }),
  ]
})

app.listen()
