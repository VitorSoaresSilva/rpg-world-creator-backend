const Mail = use('Mail');
const Env = use('Env');
const Hash = use('Hash');
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

  async update({ request, response, auth }) {
    const {
      name,
      email,
      oldPassword,
      newPassword,
      confirmPassword,
    } = request.all();
    if (email && email !== auth.user.email) {
      const userExists = await User.findBy('email', email);
      if (userExists) {
        return response.status(400).json({ message: 'Email Already exists' });
      }
    }
    const wantToChangePassword = newPassword || oldPassword || confirmPassword;
    const canChangePassword =
      newPassword !== oldPassword &&
      newPassword === confirmPassword &&
      (await Hash.verify(oldPassword, auth.user.password));
    if (wantToChangePassword && !canChangePassword) {
      return response.status(400).json({ message: 'Password incorrect' });
    }
    const user = await User.findBy('id', auth.user.id);
    user.name = name || auth.user.name;
    user.email = email || auth.user.email;
    if (wantToChangePassword) {
      user.password = newPassword;
    }
    await user.save();
    return user;
  }
}

module.exports = UserController;
