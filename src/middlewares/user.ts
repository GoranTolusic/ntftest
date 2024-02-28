import { Router, Request } from "express"
import { middlewareHandler } from "../../start/middlewareHandler"
import { BadRequest, Forbidden } from "@tsed/exceptions"
import { authenticateUser } from "../helpers/authenticateUser"
import { validatorDto } from "../../start/validatorDto"
import UpdateUser from "../validationTypes/UpdateUser"
import ResetPassword from "../validationTypes/ResetPassword"
import BanUser from "../validationTypes/BanUser"

export const userMiddleware = Router()

//prefix = user/

//global middleware for all user/ middlewares
userMiddleware.use(middlewareHandler(authenticateUser))

//Specificic endpoints middlewares
userMiddleware.get(
  "/:id",
  middlewareHandler(async (req: Request) => {
    if (isNaN(Number(req.params.id))) throw new BadRequest("Invalid URI id")
  })
)

userMiddleware.patch(
  "/:id/banUser",
  middlewareHandler(async (req: Request) => {
    if (!req.loggedUser.isAdmin || req.loggedUser.id == Number(req.params.id))
      throw new Forbidden("Not Allowed")
    await validatorDto(BanUser, req.body, BanUser.pickedProps())
  })
)

userMiddleware.patch(
  "/:id/resetPassword",
  middlewareHandler(async (req: Request) => {
    if (isNaN(Number(req.params.id))) throw new BadRequest("Invalid URI id")
    if (req.loggedUser.id !== Number(req.params.id))
      throw new Forbidden(
        "You are not authorized to change password of other users"
      )
    await validatorDto(ResetPassword, req.body, ResetPassword.pickedProps())
  })
)

userMiddleware.patch(
  "/:id",
  middlewareHandler(async (req: Request) => {
    if (isNaN(Number(req.params.id))) throw new BadRequest("Invalid URI id")
    if (!req.loggedUser.isAdmin) throw new Forbidden("Not Allowed")
    await validatorDto(UpdateUser, req.body, UpdateUser.pickedProps())
  })
)

userMiddleware.delete(
  "/:id",
  middlewareHandler(async (req: Request) => {
    if (isNaN(Number(req.params.id))) throw new BadRequest("Invalid URI id")
    if (!req.loggedUser.isAdmin || req.loggedUser.id == Number(req.params.id))
      throw new Forbidden("Not Allowed")
  })
)
