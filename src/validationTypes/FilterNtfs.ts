import { IsOptional, IsNumber, IsIn, IsArray } from "class-validator"
import { Service } from "typedi"
import { ValidationProps } from "../../types/ValidationProps"
import { NtfStatus } from "../../types/express"

@Service()
class FilterNtfs extends ValidationProps {
  @IsOptional()
  @IsNumber()
  limit: number

  @IsOptional()
  @IsNumber()
  page = 1

  @IsOptional()
  @IsIn(["ASC", "DESC"])
  order: "ASC" | "DESC"

  @IsOptional()
  @IsIn(["read", "unread"])
  markAs: NtfStatus

  @IsOptional()
  @IsArray()
  createdAt: number[]

  static pickedProps(): string[] {
    return ["limit", "page", "order", "markAs", "createdAt"]
  }
}

export default FilterNtfs
