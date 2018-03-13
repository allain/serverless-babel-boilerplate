// @flow
// import awsServerlessExpress from 'aws-serverless-express'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import jwt from 'express-jwt'
// import compression from 'compression'
import awsServerlessExpress from 'aws-serverless-express'
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'

import schema from './graphql'
import auth from './lib/auth'
import { JWT_SECRET } from './config'

const app = express()

app.set('view engine', 'pug')
// app.use(compression())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(awsServerlessExpressMiddleware.eventContext())

app.post('/auth', (req, res) =>
  auth(req.body).then(result => {
    if (result === null)
      return res.statusMessage(403).json({ error: '403 Forbidden' })

    res.status(200).json(result)
  })
)

app.use(
  '/graphql',
  bodyParser.json(),
  jwt({
    secret: JWT_SECRET,
    credentialsRequired: false,
    getToken: function fromHeaderOrQuerystring(req) {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
      ) {
        return req.headers.authorization.split(' ')[1]
      } else if (req.query && req.query.token) {
        return req.query.token
      }
      return null
    }
  }),
  graphqlExpress((req, res) => ({ schema, context: { user: req.user } }))
)

app.use(
  '/graphiql',
  bodyParser.json(),
  graphiqlExpress({ endpointURL: '/graphql' })
)

const server = awsServerlessExpress.createServer(app)

exports.handler = (event, context) =>
  awsServerlessExpress.proxy(server, event, context)
