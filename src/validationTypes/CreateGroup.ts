import { IsString, IsNotEmpty } from "class-validator"
import { Service } from "typedi"
import { ValidationProps } from "../../types/ValidationProps"

@Service()
class CreateGroup extends ValidationProps {
  @IsNotEmpty()
  @IsString()
  label: string

  readonly createdAt: number = Date.now()

  readonly updatedAt: number = Date.now()

  code: string

  generateCodeProp() {
    this.code = this.label.toLowerCase()
  }

  static pickedProps(): string[] {
    return ["label"]
  }
}

export default CreateGroup
