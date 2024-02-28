import { Knex } from "knex";
import * as bcrypt from 'bcrypt';
require('dotenv').config();

export async function seed(knex: Knex): Promise<void> {
    await knex("groups").del();

    const salt = await bcrypt.genSalt();
    let groups: any = [
        {
            label: "ADMIN",
            code: "admin",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
        {
            label: "EDITOR",
            code: "editor",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
        {
            label: "EMPLOYEE",
            code: "employee",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
    ]

    await knex("groups").insert(groups);
};
