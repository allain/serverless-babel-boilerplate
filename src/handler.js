// @flow

export function hello(event: {}, context: {}, callback) {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Testing!'
    })
  }

  callback(null, response)
}
