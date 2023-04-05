const VerifyToken = (token: string) => {
  return token.length >= 20 ? true : false
}
export default VerifyToken
