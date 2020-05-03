class Forgot {
  get rules() {
    return {
      email: 'email|required',
      name: 'string|required',
      password: 'string|min:6',
    };
  }
}

module.exports = Forgot;
