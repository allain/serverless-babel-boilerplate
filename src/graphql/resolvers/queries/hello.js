export default (_1, _2, { user }) => {
  if (!user) return Promise.reject(new Error('forbidden'))

  return `Hello ${user.email}`
}
