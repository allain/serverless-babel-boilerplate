import { JWT_SECRET } from '../config'
import { sign } from 'jsonwebtoken'

export default function auth({ email, password }) {
  return Promise.resolve({
    token: sign({ email }, JWT_SECRET)
  })
}
