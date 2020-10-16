import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

import Cognito from '../Services/cognito.service'

class AuthController {
  public path = '/auth'
  public router = express.Router()

  constructor() {
    this.initRoutes()
  }

  private initRoutes() {
    this.router.post('/signup', this.validateBody('signUp'), this.signUp)
    this.router.post('/signin', this.validateBody('signIn'), this.signIn)
    this.router.post('/verify', this.validateBody('verify'), this.verify)
    this.router.post('/forgot-password', this.validateBody('forgotPassword'), this.forgotPassword)
    this.router.post('/confirm-password', this.validateBody('confirmPassword'), this.confirmPassword)
  }

  signUp(req: Request, res: Response) {
    const result = validationResult(req)
    //console.log(req.body)
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() })
    }

    const { username, password, email, name, family_name, birthdate } = req.body
    let userAttr = []
    userAttr.push({ Name: 'email', Value: email })
    userAttr.push({ Name: 'name', Value: name })
    userAttr.push({ Name: 'family_name', Value: family_name })
    userAttr.push({ Name: 'birthdate', Value: birthdate })

    const cognito = new Cognito()
    cognito.signUpUser(username, password, userAttr)
      .then(success => {
        if (success) {
          res.status(200).end()
        } else {
          res.status(500).end()
        }
      })
      .catch(err => console.log(err))
  }

  signIn(req: Request, res: Response) {
    const result = validationResult(req)
    //console.log('signIn', req.body)
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() })
    }

    const { username, password } = req.body
    const cognito = new Cognito()
    cognito.signInUser(username, password)
      .then(success => {
        if (success) {
          res.status(200).end()
        } else {
          res.status(500).end()
        }
      })
      .catch(err => console.log(err))
  }

  verify(req: Request, res: Response) {
    const result = validationResult(req)
    //console.log('verify', req.body)
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() })
    }

    const { username, code } = req.body
    const cognito = new Cognito()
    cognito.verifyAccount(username, code)
      .then(success => {
        if (success) {
          res.status(200).end()
        } else {
          res.status(500).end()
        }
      })
      .catch(err => console.log(err))
  }

  forgotPassword = (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() });
    }
    
    const { username } = req.body;
    let cognitoService = new Cognito();
    cognitoService.forgotPassword(username)
      .then(success => {
        if (success) {
          res.status(200).end()
        } else {
          res.status(500).end()
        }
      })
      .catch(err => console.log(err))
  }

    confirmPassword = (req: Request, res: Response) => {  
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(422).json({ errors: result.array() });
      }
      
      const { username, password, code } = req.body;
      let cognitoService = new Cognito();
      cognitoService.confirmNewPassword(username, password, code)
        .then(success => {
          if (success) {
            res.status(200).end()
          } else {
            res.status(500).end()
          }
        })
        .catch(err => console.log(err))
    }

  private validateBody(type: String) {
    switch (type) {
      case 'signUp':
        return [
          body('username').notEmpty().isLength({min: 5}),
          body('email').notEmpty().normalizeEmail().isEmail(),
          body('password').isString().isLength({ min: 8}),
          body('birthdate').exists().isISO8601(),
          //body('gender').notEmpty().isString(),
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

      case 'forgotPassword':
        return [
          body('username').notEmpty().isLength({ min: 5 }),
        ]

      case 'confirmPassword':
        return [
          body('password').exists().isLength({ min: 8 }),
          body('username').notEmpty().isLength({ min: 5 }),
          body('code').notEmpty().isString().isLength({min: 6, max: 6 })
        ]
    }
  }
}

export default AuthController
