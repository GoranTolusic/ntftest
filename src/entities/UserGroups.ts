import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm"
import { User } from "./User"
import { Group } from "./Group"

@Entity("user_groups")
export class UserGroups {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @Column()
  groupId: number

  @Column()
  createdAt: number

  @Column()
  updatedAt: number

  @ManyToOne(() => User, (item) => item.groups, { eager: false })
  user: User

  @ManyToOne(() => Group, (item) => item.users, { eager: false })
  group: Group
}
