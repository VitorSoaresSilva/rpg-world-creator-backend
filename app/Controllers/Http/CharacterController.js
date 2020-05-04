/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with characters
 */
const Character = use('App/Models/Character');
class CharacterController {
  /**
   * Create/save a new character.
   * POST characters
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, auth }) {
    const { name, characterClass, race, level } = request.all();
    const character = await Character.create({
      name,
      characterClass,
      level,
      race,
      user_id: auth.user.id,
    });

    return character;
  }

  /**
   * Show a list of all characters.
   * GET characters
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ auth }) {
    const user_id = auth.user.id;
    const characters = await Character.query().where({ user_id }).fetch();
    return characters;
  }

  /**
   * Display a single character.
   * GET characters/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, auth }) {
    const { id } = params;
    const character = await Character.query()
      .where({
        id,
        user_id: auth.user.id,
      })
      .first();
    return character;
  }

  /**
   * Update character details.
   * PUT or PATCH characters/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, auth, params }) {
    const { id } = params;
    const { name, race, characterClass, level } = request.all();
    const character = await Character.query()
      .where({
        id,
        user_id: auth.user.id,
      })
      .first();
    character.name = name;
    character.race = race;
    character.characterClass = characterClass;
    character.level = level;
    character.save();
  }

  /**
   * Delete a character with id.
   * DELETE characters/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ auth, params }) {
    const { id } = params;
    const character = await Character.query()
      .where({
        id,
        user_id: auth.user.id,
      })
      .first();
    await character.delete();
  }
}

module.exports = CharacterController;
