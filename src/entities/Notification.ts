import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  OneToOne,
} from "typeorm"
import { NtfStatus } from "../../types/express"
import { User } from "./User"

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @Column()
  message: string

  @Column()
  createdBy: number

  @Column({ default: "unread" })
  markAs: NtfStatus

  @Column()
  createdAt: number

  @ManyToOne(() => User, (item) => item.notifications, { eager: false })
  user: User
}
