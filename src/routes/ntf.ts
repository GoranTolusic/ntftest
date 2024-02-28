import { Request, Router } from "express"
import Container from "typedi"
import { routeHandler } from "../../start/routeHandler"
import NtfController from "../controllers/NtfController"

export const ntfRoutes = Router()
const ntfController = Container.get(NtfController)

//prefix = ntf/

ntfRoutes.patch(
  "/:id",
  routeHandler((req: Request) => ntfController.update(req))
)

ntfRoutes.post(
  "/filter",
  routeHandler((req: Request) => ntfController.filter(req))
)
