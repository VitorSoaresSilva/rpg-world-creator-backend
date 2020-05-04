const { test, trait } = use('Test/Suite')('Character Test');

trait('Auth/Client');
const Factory = use('Factory');
const Character = use('App/Models/Character');
trait('Test/ApiClient');
trait('DatabaseTransactions');

test('It Should be able to create an Character', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const data = {
    name: 'Name',
    characterClass: 'Bard',
    race: 'Human',
    level: 1,
  };
  const response = await client
    .post('/characters')
    .loginVia(user, 'jwt')
    .send(data)
    .end();
  response.assertStatus(200);
  assert.equal(response.body.name, data.name);
});

test('It Should be able to delete an Character', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const character = await Factory.model('App/Models/Character').create({
    user_id: user.id,
  });

  const response = await client
    .delete(`/characters/${character.id}`)
    .loginVia(user, 'jwt')
    .send()
    .end();
  response.assertStatus(204);

  const checkCharacter = await Character.findBy('id', character.id);
  assert.isNull(checkCharacter);
});
test('It Should be able to update an Character', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const character = await Factory.model('App/Models/Character').create({
    user_id: user.id,
  });
  const data = {
    name: 'Name',
    characterClass: 'Bard',
    race: 'Human',
    level: 1,
  };

  const response = await client
    .put(`/characters/${character.id}`)
    .loginVia(user, 'jwt')
    .send(data)
    .end();
  response.assertStatus(204);

  const checkCharacter = await Character.findBy('id', character.id);
  assert.equal(checkCharacter.name, data.name);
});
test('It Should be able to get an Character', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const character = await Factory.model('App/Models/Character').create({
    user_id: user.id,
  });
  const response = await client
    .get(`/characters/${character.id}`)
    .loginVia(user, 'jwt')
    .end();
  response.assertStatus(200);
  assert.equal(response.body.name, character.name);
});

test('It Should be able to get all Characters', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const character = await Factory.model('App/Models/Character').createMany(2, {
    user_id: user.id,
  });
  const response = await client.get(`/characters`).loginVia(user, 'jwt').end();
  response.assertStatus(200);
  assert.equal(response.body[0].name, character[0].name);
  assert.equal(response.body[1].name, character[1].name);
});
