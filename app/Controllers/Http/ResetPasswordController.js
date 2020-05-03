const Token = use('App/Models/Token');

class ResetPasswordController {
  async store({ request, response }) {
    const { token, password } = request.only(['token', 'password']);
    const userToken = await Token.findByOrFail('token', token);
    const tokenDate = new Date(userToken.created_at);
    const hour = new Date();
    hour.setHours(hour.getHours() - 5);
    if (tokenDate.getTime() < hour.getTime()) {
      return response
        .status(400)
        .json({ error: 'Invalid date range, please try again' });
    }

    const user = await userToken.user().fetch();

    user.password = password;

    await user.save();
  }
}

module.exports = ResetPasswordController;
