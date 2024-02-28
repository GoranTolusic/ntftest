import { IsIn, IsNotEmpty } from "class-validator"
import { Service } from "typedi"
import { ValidationProps } from "../../types/ValidationProps"
import { NtfStatus } from "../../types/express"

@Service()
class UpdateNtf extends ValidationProps {
  @IsNotEmpty()
  @IsIn(["read", "unread"])
  markAs: NtfStatus

  static pickedProps(): string[] {
    return ["markAs"]
  }
}

export default UpdateNtf
