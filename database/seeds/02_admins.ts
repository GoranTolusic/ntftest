import { Knex } from "knex";
import * as bcrypt from 'bcrypt';
import { uid } from 'uid';
require('dotenv').config();

export async function seed(knex: Knex): Promise<void> {
    await knex("users").del();
    await knex("user_groups").del();

    const adminGroup = await knex("groups").where({code: 'admin'}).first()

    const salt = await bcrypt.genSalt();
    let testUsers: any = [
        {
            name: "Marko",
            surname: "Marković",
            username: "SuperMarko",
            email: "marko@mail.com",
            password: await bcrypt.hash('marko1234', salt),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            active: true,
            verified: true,
            verifyToken: uid(32),
            uid: uid(32)
        },
        {
            name: "Pero",
            surname: "Perić",
            username: "SuperPero",
            email: "pero@mail.com",
            password: await bcrypt.hash('pero1234', salt),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            active: true,
            verified: true,
            verifyToken: uid(32),
            uid: uid(32)
        }  
    ]

    const userGroups = (await knex("users").insert(testUsers).returning("id")).map(function (item) {
        return {
            userId: item.id,
            groupId: adminGroup.id,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    })

    //insert ids in pivot table
    await knex("user_groups").insert(userGroups)
};
