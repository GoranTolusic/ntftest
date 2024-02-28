import { Express } from "express"
import { authMiddleware } from "./auth"
import { testMiddleware } from "./test"
import { userMiddleware } from "./user"
import { groupMiddleware } from "./group"
import { ntfMiddleware } from "./ntf"

export const middlewareRegistry = (app: Express) => {
  app.use("/auth", authMiddleware)
  app.use("/test", testMiddleware)
  app.use("/user", userMiddleware)
  app.use("/group", groupMiddleware)
  app.use("/ntf", ntfMiddleware)
}
