declare namespace IAuth {
  type int = number
  type text = string
  type bool = boolean

  // userId: int
  //   username: text
  //   fullname: text
  //   description: text
  // verified: bool
  // avatar: text
  // splashImage: text
  // createdAt: text
  //   email: text
  // emailVerified: bool
  //   password: text

  interface register {
    username: text
    fullname: text
    description: text
    email: text
    password: text
  }

  interface login {
    username: text
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