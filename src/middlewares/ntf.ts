import { Router, Request } from "express"
import { middlewareHandler } from "../../start/middlewareHandler"
import { BadRequest } from "@tsed/exceptions"
import { authenticateUser } from "../helpers/authenticateUser"
import { validatorDto } from "../../start/validatorDto"
import UpdateNtf from "../validationTypes/UpdateNtf"
import FilterNtfs from "../validationTypes/FilterNtfs"

export const ntfMiddleware = Router()

//prefix = ntf/

//global middleware for all ntf/ middlewares
ntfMiddleware.use(middlewareHandler(authenticateUser))

//Specificic endpoints middlewares
ntfMiddleware.patch(
  "/:id",
  middlewareHandler(async (req: Request) => {
    if (isNaN(Number(req.params.id))) throw new BadRequest("Invalid URI id")
    await validatorDto(UpdateNtf, req.body, UpdateNtf.pickedProps())
  })
)

ntfMiddleware.post(
  "/filter",
  middlewareHandler(async (req: Request) => {
    await validatorDto(FilterNtfs, req.body, FilterNtfs.pickedProps())
  })
)
