/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

Factory.blueprint('App/Models/User', (faker, i, data = {}) => {
  return {
    name: faker.username(),
    email: faker.email(),
    password: faker.string(),
    ...data,
  };
});
Factory.blueprint('App/Models/Token', async (faker, i, data = {}) => {
  return {
    type: data.type || 'refreshtoken',
    token: await faker.string({ length: 20 }),
    ...data,
  };
});
Factory.blueprint('App/Models/Character', (faker, i, data = {}) => {
  return {
    name: faker.username(),
    race: faker.string(),
    characterClass: faker.string(),
    level: faker.integer({ min: 1, max: 20 }),
    ...data,
  };
});
