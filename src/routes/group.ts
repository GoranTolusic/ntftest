import { Request, Router } from "express"
import Container from "typedi"
import { routeHandler } from "../../start/routeHandler"
import GroupController from "../controllers/GroupController"

export const groupRoutes = Router()
const groupController = Container.get(GroupController)

//prefix = group/

groupRoutes.get(
  "/:id",
  routeHandler((req: Request) => groupController.get(req))
)

groupRoutes.post(
  "/create",
  routeHandler((req: Request) => groupController.create(req))
)

groupRoutes.patch(
  "/:id",
  routeHandler((req: Request) => groupController.update(req))
)

groupRoutes.delete(
  "/:id",
  routeHandler((req: Request) => groupController.delete(req))
)

groupRoutes.post(
  "/assignGroup",
  routeHandler((req: Request) => groupController.assignGroup(req))
)
