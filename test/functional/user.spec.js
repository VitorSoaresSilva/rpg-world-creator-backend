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
      name: 'user.name',
      email: 'user.email',
      password: 'user.password',
    })
    .end();
  response.assertStatus(200);

  assert.equal(response.body.name, 'user.name');
});

test('It should be able to delete an user', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  // const user2 = await Factory.model('App/Models/User').create();

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
