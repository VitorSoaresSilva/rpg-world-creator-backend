/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CharacterSchema extends Schema {
  up() {
    this.create('characters', (table) => {
      table.increments();
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.string('name', 80).notNullable();
      table.integer('level', 80).notNullable();
      table.string('characterClass', 80).notNullable();
      table.string('race', 80).notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop('characters');
  }
}

module.exports = CharacterSchema;
