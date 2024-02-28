import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("groups", function (table) {
    table.bigIncrements("id")
    table.string("label", 255)
    table.string("code", 255).unique()
    table.bigInteger("createdAt")
    table.bigInteger("updatedAt")
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("groups")
}
