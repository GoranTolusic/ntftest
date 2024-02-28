import { Service } from "typedi"
import { AppDataSource } from "../../start/data-source"
import { User } from "../entities/User"
import CreateUser from "../validationTypes/CreateUser"
import { Forbidden, MethodNotAllowed, NotFound } from "@tsed/exceptions"
import HashService from "./HashService"
import AuthService from "./AuthService"
import UpdateUser from "../validationTypes/UpdateUser"
import { transporter } from "../helpers/transporter"
import { Logger } from "../helpers/logger"
import ResetPassword from "../validationTypes/ResetPassword"
import BanUser from "../validationTypes/BanUser"
import { omit } from "lodash"

@Service()
class UserService {
  public userRepository
  constructor(
    private hashService: HashService,
    private authService: AuthService
  ) {
    this.userRepository = AppDataSource.getRepository(User)
  }

  async create(inputs: CreateUser) {
    const response = {
      message: "Verification email was sent",
    }
    //check if user with same email exists
    const findIfEmailExists = await this.userRepository.findOneBy({
      email: inputs.email,
    })
    if (findIfEmailExists) {
      if (!findIfEmailExists.verified) {
        await this.authService.resendVerifyToken({
          email: findIfEmailExists.email,
          verifyToken: inputs.verifyToken,
          updatedAt: Date.now(),
          verifyExpiresAt: inputs.verifyExpiresAt,
        })
      }
      return response
    }

    //check if user with same username exists
    const findIfUsernameExists = await this.userRepository.findOneBy({
      username: inputs.username,
    })
    if (findIfUsernameExists) throw new Forbidden("Username already exists")

    //hash password
    inputs.password = await this.hashService.hash(inputs.password)

    //insert user
    const created = await this.userRepository.save(inputs)

    //send email for verifying (check the console for generated link to verify account :P)
    this.authService.verifyMailEmail(
      created,
      this.authService.getApplicationName("Person")
    )

    return response
  }

  async get(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        groups: true,
      },
    })
    if (!user) {
      Logger.error("User with id " + id + " not found")
      throw new NotFound("User Not Found")
    }
    //Auto loading relation without pagination is actually very bad practice in real world scenario,
    //but here it is just for puropse of demonstration and quick access to neccessary id's
    user.groups = user.groups.map(function (item: any) {
      return item.groupId
    })
    return user
  }

  async delete(id: number): Promise<{ message: string }> {
    //Delete it from database
    await this.userRepository.delete(id)
    Logger.info("User with id " + id + " successfuly deleted")
    return { message: "successfuly deleted" }
  }

  async update(id: number, body: UpdateUser): Promise<User> {
    const user = await this.get(id)
    Object.assign(user, body)
    return await this.userRepository.save(user)
  }

  async banUser(id: number, body: BanUser): Promise<User> {
    const user = await this.get(id)
    Object.assign(user, body)
    return await this.userRepository.save(user)
  }

  async resetPassword(
    id: number,
    body: ResetPassword
  ): Promise<{ message: string }> {
    try {
      const user = await this.authService.getUserWithSensitiveData(
        { id: id },
        "id",
        id
      )

      //check if password matches with hashed one
      const matches = await this.hashService.comparePasswords(
        body.currentPassword,
        user?.password || ""
      )

      if (!matches) {
        Logger.error("Unable to reset password for user with id: " + id)
        throw new MethodNotAllowed("Unable to reset password!")
      }

      //hash new password
      const newPassword = await this.hashService.hash(body.newPassword)

      Object.assign(user, { password: newPassword, updatedAt: body.updatedAt })
      await this.userRepository.save(user)
      Logger.info("Password successfuly changed")
      return { message: "Password successfuly changed" }
    } catch (e: any) {
      throw new MethodNotAllowed("Unable to reset password!")
    }
  }
}

export default UserService
