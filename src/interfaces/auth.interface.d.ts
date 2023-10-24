declare namespace IAuth {
  type int = number
  type text = string
  type bool = boolean

  interface register {
    username: text
    fullname: text
    description: text
    email: text
    password: text
  }

  interface login {
    email: text
    password: text
    robot: bool
  }

  interface payload {
    userId: int
    username: text
    fullname: text
    description: text
    verified: bool
    avatar: text
    splashImage: text
    createdAt: text
  }
}
export default IAuth
