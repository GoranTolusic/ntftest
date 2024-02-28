import { Service } from "typedi"
import { AppDataSource } from "../../start/data-source"
import { Forbidden, NotFound } from "@tsed/exceptions"
import { Logger } from "../helpers/logger"
import CreateNotification from "../validationTypes/CreateNotification"
import { Notification } from "../entities/Notification"
import UpdateNtf from "../validationTypes/UpdateNtf"
import { mqttClient } from "../../start/mqttConnection"
import { Between, ObjectLiteral } from "typeorm"

@Service()
class NotificationService {
  public ntfRepository
  constructor() {
    this.ntfRepository = AppDataSource.getRepository(Notification)
  }

  generateNtfs(
    message: string,
    createdBy: number,
    receivers: Array<number>
  ): CreateNotification[] | Notification[] {
    return receivers.map((item) => {
      return {
        markAs: "unread",
        message: message,
        createdAt: Date.now(),
        userId: item,
        createdBy: createdBy,
      }
    })
  }

  async createAndSendNotifications(
    ntfs: CreateNotification[] | Notification[]
  ) {
    const typed = ntfs as Notification[]
    await this.ntfRepository.save(typed)
    //Send notifications to mqtt broker to notify users on client side. This is very simplified, but just for demonstrational purpose
    //Nice approach is to encrypt message strings for additional security (See HashService and encrypt/decrypt aesKey methods)
    for (const oneNtf of ntfs) {
      mqttClient.publish(
        String(oneNtf.userId),
        String(oneNtf.message),
        { qos: 2 },
        (err?: Error) => {
          if (err) {
            Logger.error("Failed to publish")
          } else {
            Logger.info("Message published")
          }
        }
      )
    }
  }

  async get(id: number): Promise<Notification> {
    const ntf = await this.ntfRepository.findOne({
      where: {
        id: id,
      },
    })
    if (!ntf) {
      Logger.error("Ntf with id " + id + " not found")
      throw new NotFound("Ntf Not Found")
    }

    return ntf
  }

  async update(id: number, body: UpdateNtf, loggedUserId: number) {
    const ntf = await this.get(id)
    if (ntf.userId !== loggedUserId)
      throw new Forbidden("You can mark only your notifications")
    Object.assign(ntf, body)
    await this.ntfRepository.save(ntf)
    return { message: "sucess" }
  }

  async filter(params: any, loggedUserId: number): Promise<Notification[]> {
    const { page, order, createdAt, markAs } = params
    const limit = params.limit || 10

    //Formating where clause with filter options
    const whereClause: ObjectLiteral = {
      userId: loggedUserId,
    }
    if (createdAt && createdAt.length)
      whereClause.createdAt = Between(createdAt[0], createdAt[1] || Date.now())
    if (markAs) whereClause.markAs = markAs

    return await this.ntfRepository.find({
      order: { createdAt: order },
      take: limit,
      skip: page ? (page - 1) * limit : 0,
      where: whereClause,
    })
  }
}

export default NotificationService
