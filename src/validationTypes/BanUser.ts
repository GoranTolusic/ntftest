import { Service } from "typedi"
import { ValidationProps } from "../../types/ValidationProps"

@Service()
class BanUser extends ValidationProps {
  readonly updatedAt: number = Date.now()

  readonly active: boolean = false
}

export default BanUser
