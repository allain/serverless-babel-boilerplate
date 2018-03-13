const RootQuery = `
type RootQuery {
  hello: String
}
`
const Mutations = `
type Mutations {
    sayHello(name : String) : String
}`

const SchemaDefinition = `
schema {
  query: RootQuery
  mutation: Mutations
}
`

module.exports = [SchemaDefinition, RootQuery, Mutations]
