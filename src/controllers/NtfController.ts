import { Request } from "express"
import { Service } from "typedi"
import UserService from "../services/UserService"
import NotificationService from "../services/NotificationService"

@Service()
class NtfController {
  constructor(private readonly ntfService: NotificationService) {}

  public async update(req: Request) {
    return await this.ntfService.update(
      Number(req.params.id),
      req.body._validated,
      req.loggedUser.id
    )
  }

  public async filter(req: Request) {
    return await this.ntfService.filter(req.body._validated, req.loggedUser.id)
  }
}

export default NtfController
