import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("user_groups", function (table) {
    table.bigIncrements("id")
    table.bigInteger('userId').unsigned().references('id').inTable('users').onDelete('CASCADE')
    table.bigInteger('groupId').unsigned().references('id').inTable('groups').onDelete('CASCADE')
    table.bigInteger("createdAt")
    table.bigInteger("updatedAt")
    table.unique(['userId', 'groupId']);
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("user_groups")
}
