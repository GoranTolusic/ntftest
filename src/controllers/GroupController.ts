import { Request } from "express"
import { Service } from "typedi"
import GroupService from "../services/GroupService"

@Service()
class GroupController {
  constructor(private readonly groupService: GroupService) {}

  public async get(req: Request) {
    return await this.groupService.get(Number(req.params.id))
  }

  public async update(req: Request) {
    return await this.groupService.update(
      Number(req.params.id),
      req.body._validated
    )
  }

  public async delete(req: Request) {
    return await this.groupService.delete(
      Number(req.params.id),
      req.loggedUser.id
    )
  }

  public async create(req: Request) {
    return await this.groupService.create(req.body._validated)
  }

  public async assignGroup(req: Request) {
    return await this.groupService.assignGroup(
      req.body._validated,
      req.loggedUser.id
    )
  }
}

export default GroupController
