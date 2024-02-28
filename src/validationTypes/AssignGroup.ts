import { IsNotEmpty, IsNumber } from "class-validator"
import { Service } from "typedi"
import { ValidationProps } from "../../types/ValidationProps"

@Service()
class AssignGroup extends ValidationProps {
  @IsNotEmpty()
  @IsNumber()
  userId: number

  @IsNotEmpty()
  @IsNumber()
  groupId: number

  readonly createdAt: number = Date.now()

  readonly updatedAt: number = Date.now()

  static pickedProps(): string[] {
    return ["userId", "groupId"]
  }
}

export default AssignGroup
