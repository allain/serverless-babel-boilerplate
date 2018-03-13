// @flow
import awsServerlessExpress from 'aws-serverless-express'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import jwt from 'express-jwt'
// import compression from 'compression'
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware'
import graphqlHTTP from 'express-graphql'
import schema from './graphql/schema'
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

const graphqlHandler = graphqlHTTP(
  async (request, response, graphQLParams) => ({
    schema,
    rootValue: {
      hello: 'Testing'
    },
    graphiql: true
  })
)

app.use('/graphql', jwt({ secret: JWT_SECRET }), graphqlHandler)
app.use('/graphqli', graphqlHandler)

const server = awsServerlessExpress.createServer(app)

exports.handler = (event, context) =>
  awsServerlessExpress.proxy(server, event, context)
