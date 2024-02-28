import { Service } from "typedi"
import { NtfStatus } from "../../types/express"

@Service()
class CreateNotification {
  markAs: NtfStatus

  createdAt: number

  message: string

  userId: number

  createdBy: number
}

export default CreateNotification
