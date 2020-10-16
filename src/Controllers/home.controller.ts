import express, { Request, Response } from 'express'

class HomeController {
  public path = '/'
  public router = express.Router()

  constructor() {
    this.initRoutes()
  }

  private initRoutes() {
    this.router.get('/', this.home)
  }

  home(req: Request, res: Response) {
    //res.send(`Cognito Auth Server has started on port ${this.port}`);
    res.send('Cognito Auth Server has started successfuly.');
  }
}

export default HomeController
