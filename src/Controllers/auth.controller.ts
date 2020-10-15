import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

import CognitoService from '../Services/cognito.service'

class AuthController {
  public path = '/'
  public router = express.Router()

  constructor() {
    this.initRoutes()
  }

  private initRoutes() {
    this.router.post('/signup', this.validateBody('signUp'), this.signUp)
    this.router.post('/signin', this.validateBody('signIn'), this.signIn)
    this.router.post('/verify', this.validateBody('verify'), this.verify)
  }

  signUp(req: Request, res: Response) {
    const result = validationResult(req)
    console.log(req.body)
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() })
    }
  }

  signIn(req: Request, res: Response) {
    const result = validationResult(req)
    console.log(req.body)
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() })
    }
  }

  verify(req: Request, res: Response) {
    const result = validationResult(req)
    console.log(req.body)
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() })
    }
  }

  private validateBody(type: String) {
    switch (type) {
      case 'signUp':
        return [
          body('username').notEmpty().isLength({ min: 6 }),
          body('email').notEmpty().normalizeEmail().isEmail(),
          body('password').notEmpty().isLength({ min: 8 }),
          body('birthdate').exists().isISO8601(),
          body('name').notEmpty().isString(),
          body('family_name').notEmpty().isString()
        ]
      
      case 'signIn':
        return [
          body('username').notEmpty().isLength({ min: 6 }),
          body('password').notEmpty().isLength({ min: 8 })
        ]
      
      case 'verify':
        return [
          body('username').notEmpty().isLength({ min: 6 }),
          body('code').notEmpty().isLength({ min: 6, max: 6 })
        ]
    }
  }
}

export default AuthController
