import { Express } from "express"
import { authRoutes } from "./auth"
import { testRoutes } from "./test"
import { userRoutes } from "./user"
import { groupRoutes } from "./group"
import { ntfRoutes } from "./ntf"

export const routeRegistry = (app: Express) => {
  app.use("/auth", authRoutes)
  app.use("/test", testRoutes)
  app.use("/user", userRoutes)
  app.use("/group", groupRoutes)
  app.use("/ntf", ntfRoutes)
}
