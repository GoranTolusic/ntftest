import { Unauthorized } from "@tsed/exceptions"
import { Request } from "express"

//middleware for checking if user holds accesstoken or not in headers.
export const authenticateRequest = async (req: Request) => {
  let error = false

  if (
    !req.headers.clientkey ||
    req.headers.clientkey !== process.env.CLIENT_KEY
  )
    error = true

  if (error)
    throw new Unauthorized("You are not part of this universe. Get lost :)")
}
