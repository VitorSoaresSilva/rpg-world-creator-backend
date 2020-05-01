const { test, trait } = use('Test/Suite')('User registeration');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient');

test('It should return JWT token when session created', async ({
  assert,
  client,
}) => {
  const sessionPayload = {
    email: 'vitor@gmail.com',
    password: '123123',
  };
  await Factory.model('App/Models/User').create(sessionPayload);
  const response = await client.post('/sessions').send(sessionPayload).end();

  response.assertStatus(200);
  assert.exists(response.body.token);
});
