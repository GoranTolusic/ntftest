import { IsNotEmpty, IsString } from "class-validator"
import { Service } from "typedi"
import { ValidationProps } from "../../types/ValidationProps"

@Service()
class UpdateGroup extends ValidationProps {
  @IsNotEmpty()
  @IsString()
  label: string

  readonly updatedAt: number = Date.now()

  code: string

  static pickedProps(): string[] {
    return ["label"]
  }
}

export default UpdateGroup
