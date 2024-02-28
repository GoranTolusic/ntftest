import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("notifications", function (table) {
    table.bigIncrements("id")
    table.string('message', 255)
    table.bigInteger('createdBy').unsigned().references('id').inTable('users').onDelete('SET NULL')
    table.enum("markAs", ['read', 'unread']).defaultTo('unread').index()
    table.bigInteger('userId').unsigned().references('id').inTable('users').onDelete('CASCADE')
    table.bigInteger("createdAt")
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("notifications")
}
