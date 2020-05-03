const Mail = use('Mail');
const Env = use('Env');
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');
class UserController {
  async store({ request }) {
    const data = request.all(['name', 'email', 'password']);

    const user = await User.create(data);

    await Mail.send('emails.newuser', { name: user.name }, (message) => {
      message
        .to(`<${Env.get('ADMIN_EMAIL')}>`)
        .from(`<${Env.get('ADMIN_EMAIL')}>`)
        .subject('RPG - Usuario cadastrado');
    });

    return user;
  }

  async destroy({ auth }) {
    const { id, name } = auth.user;

    await Mail.send('emails.deletedUser', { name }, (message) => {
      message
        .to(`<${Env.get('ADMIN_EMAIL')}>`)
        .from(`<${Env.get('ADMIN_EMAIL')}>`)
        .subject('RPG - Usuario deletado');
    });
    const user = await User.find(id);
    await user.delete();
  }
}

module.exports = UserController;
