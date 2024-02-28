import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { UserGroups } from "./UserGroups"

@Entity("groups")
export class Group {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  label: string

  @Column({ unique: true })
  code: string

  @Column()
  createdAt: number

  @Column()
  updatedAt: number

  @OneToMany(() => UserGroups, (userGroup) => userGroup.group)
  users: UserGroups[] | number[]
}
