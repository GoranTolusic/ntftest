import { Request } from "express"
import { Service } from "typedi"
import UserService from "../services/UserService"

@Service()
class UserController {
  constructor(private readonly userService: UserService) {}

  public async get(req: Request) {
    return await this.userService.get(Number(req.params.id))
  }

  public async update(req: Request) {
    return await this.userService.update(
      Number(req.params.id),
      req.body._validated
    )
  }

  public async delete(req: Request) {
    return await this.userService.delete(Number(req.params.id))
  }

  public async resetPassword(req: Request) {
    return await this.userService.resetPassword(
      Number(req.params.id),
      req.body._validated
    )
  }

  public async banUser(req: Request) {
    return await this.userService.banUser(
      Number(req.params.id),
      req.body._validated
    )
  }
}

export default UserController
