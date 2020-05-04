const { test, trait } = use('Test/Suite')('User');
trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');
const Factory = use('Factory');
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

test('It should be able to create a new user', async ({ assert, client }) => {
  const response = await client
    .post('/user')
    .send({
      name: 'user name',
      email: 'teste@gmail.com',
      password: '123123',
    })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.name, 'user name');
}).timeout(10000);

test('It should be able to delete an user', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .delete('/user')
    .loginVia(user, 'jwt')
    .send({
      id: user.id,
    })
    .end();
  response.assertStatus(204);

  const checkUser = await User.findBy('id', user.id);
  assert.isNull(checkUser);
});

test('It shuld be able to update user', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    email: 'oldEmail@gmail.com',
  });
  const response = await client
    .put('/user')
    .loginVia(user, 'jwt')
    .send({
      id: user.id,
      name: 'new Name',
      email: 'newEmail@gmail.com',
      oldPassword: user.password,
      newPassword: 'newPasword',
      confirmPassword: 'newPasword',
    })
    .end();
  response.assertStatus(200);
  const checkUser = await User.findBy('id', user.id);
  assert.equal(checkUser.name, 'new Name');
});
