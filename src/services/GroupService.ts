import { Service } from "typedi"
import { AppDataSource } from "../../start/data-source"
import { Forbidden, MethodNotAllowed, NotFound } from "@tsed/exceptions"
import { Logger } from "../helpers/logger"
import CreateGroup from "../validationTypes/CreateGroup"
import { Group } from "../entities/Group"
import UpdateGroup from "../validationTypes/UpdateGroup"
import AssignGroup from "../validationTypes/AssignGroup"
import { UserGroups } from "../entities/UserGroups"
import NotificationService from "./NotificationService"

@Service()
class GroupService {
  public groupRepository
  public userGroupsRepository
  constructor(private ntfService: NotificationService) {
    this.groupRepository = AppDataSource.getRepository(Group)
    this.userGroupsRepository = AppDataSource.getRepository(UserGroups)
  }

  async create(inputs: CreateGroup) {
    const findIfCodeExists = await this.groupRepository.findOneBy({
      code: inputs.code,
    })
    if (findIfCodeExists) throw new MethodNotAllowed("Choose another label")
    return await this.groupRepository.save(inputs)
  }

  async assignGroup(inputs: AssignGroup, loggedUserId: number) {
    let checkAssignment
    const groupName = await this.groupRepository.findOneBy({
      id: inputs.groupId,
    })
    checkAssignment = await this.userGroupsRepository.findOne({
      where: {
        userId: inputs.userId,
        groupId: inputs.groupId,
      },
      relations: {
        group: true,
      },
    })

    if (!checkAssignment) {
      checkAssignment = await this.userGroupsRepository.save(inputs)
    }

    //Generate and send notifications
    const ntfMessage = `You have been assigned to ${groupName?.label} group`
    const ntfs = this.ntfService.generateNtfs(ntfMessage, loggedUserId, [
      inputs.userId,
    ])
    this.ntfService.createAndSendNotifications(ntfs)

    return { message: "success" }
  }

  async get(id: number): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        users: true,
      },
    })

    if (!group) {
      Logger.error("Group with id " + id + " not found")
      throw new NotFound("Group Not Found")
    }
    //Auto loading relation without pagination is actually very bad practice in real world scenario,
    //but here it is just for puropse of demonstration and quick access to neccessary id's.
    group.users = group.users.map(function (item: any) {
      return item.userId
    })
    return group
  }

  async delete(id: number, loggedUserId: number): Promise<{ message: string }> {
    const checkIfAdmin = await this.get(id)
    if (checkIfAdmin.code == "admin")
      throw new MethodNotAllowed("Admin group is not deletable")
    //Delete it from database
    await this.groupRepository.delete(id)
    Logger.info("Group with id " + id + " successfuly deleted")

    console.log(checkIfAdmin)

    //Generate and send notifications
    const ntfMessage = `Group ${checkIfAdmin?.label} has been deleted`
    const ntfs = this.ntfService.generateNtfs(
      ntfMessage,
      loggedUserId,
      checkIfAdmin.users as number[]
    )
    this.ntfService.createAndSendNotifications(ntfs)

    return { message: "successfuly deleted" }
  }

  async update(id: number, body: UpdateGroup): Promise<Group> {
    const group = await this.get(id)
    if (group.code == "admin")
      throw new MethodNotAllowed("Admin group is unchangeable")
    Object.assign(group, body)
    return await this.groupRepository.save(group)
  }
}

export default GroupService
