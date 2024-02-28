import { Router, Request } from "express"
import { middlewareHandler } from "../../start/middlewareHandler"
import { BadRequest, Forbidden } from "@tsed/exceptions"
import { authenticateUser } from "../helpers/authenticateUser"
import { validatorDto } from "../../start/validatorDto"
import CreateGroup from "../validationTypes/CreateGroup"
import UpdateGroup from "../validationTypes/UpdateGroup"
import AssignGroup from "../validationTypes/AssignGroup"

export const groupMiddleware = Router()

//prefix = group/

//global middleware for all group/ routes
groupMiddleware.use(middlewareHandler(authenticateUser))

groupMiddleware.get(
  "/:id",
  middlewareHandler(async (req: Request) => {
    if (isNaN(Number(req.params.id))) throw new BadRequest("Invalid URI id")
  })
)

groupMiddleware.post(
  "/create",
  middlewareHandler(async (req: Request) => {
    if (!req.loggedUser.isAdmin) throw new Forbidden("Not Allowed")
    await validatorDto(CreateGroup, req.body, CreateGroup.pickedProps())
    req.body._validated.generateCodeProp()
  })
)

groupMiddleware.patch(
  "/:id",
  middlewareHandler(async (req: Request) => {
    if (isNaN(Number(req.params.id))) throw new BadRequest("Invalid URI id")
    if (!req.loggedUser.isAdmin) throw new Forbidden("Not Allowed")
    await validatorDto(UpdateGroup, req.body, UpdateGroup.pickedProps())
  })
)

groupMiddleware.delete(
  "/:id",
  middlewareHandler(async (req: Request) => {
    if (isNaN(Number(req.params.id))) throw new BadRequest("Invalid URI id")
    if (!req.loggedUser.isAdmin) throw new Forbidden("Not Allowed")
  })
)

groupMiddleware.post(
  "/assignGroup",
  middlewareHandler(async (req: Request) => {
    if (!req.loggedUser.isAdmin) throw new Forbidden("Not Allowed")
    await validatorDto(AssignGroup, req.body, AssignGroup.pickedProps())
  })
)
