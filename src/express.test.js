import auth from './lib/auth'

const TEST_EMAIL = 'test@testing.com'
const TEST_PASS = 'testing'

it('auth generates token', () =>
  auth(TEST_EMAIL, TEST_PASS).then(result1 => {
    expect(typeof result1.token).toEqual('string')
  }))

it('auth generates new token every time', () =>
  auth(TEST_EMAIL, TEST_PASS).then(r1 => {
    return auth(TEST_EMAIL, TEST_PASS).then(r2 => {
      expect(typeof r2.token).toEqual('string')
      expect(r1.token).not.toEqual(r2.token)
    })
  }))
