const { test, trait } = use('Test/Suite')('Forgot Password');

const Factory = use('Factory');
const Mail = use('Mail');
const Hash = use('Hash');
const Database = use('Database');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('It should send an email with reset password instructions', async ({
  assert,
  client,
}) => {
  Mail.fake();

  const email = 'vitrola.vitor@gmail.com';

  const user = await Factory.model('App/Models/User').create({ email });

  await client.post('/forgot').send({ email }).end();

  const token = await user.tokens().first();

  const recentEmail = Mail.pullRecent();
  assert.equal(recentEmail.message.to[0].address, email);

  assert.include(token.toJSON(), {
    type: 'forgotpassword',
  });
  Mail.restore();
});
test('It should be able to reset password', async ({ assert, client }) => {
  const email = 'vitrola.vitor@gmail.com';

  const user = await Factory.model('App/Models/User').create({ email });
  const userToken = await Factory.model('App/Models/Token').make();
  // console.log(userToken);

  await user.tokens().save(userToken);

  const response = await client
    .post('/reset')
    .send({
      token: userToken.token,
      password: '123456',
      password_confirmation: '123456',
    })
    .end();

  response.assertStatus(204);

  await user.reload();

  const checkPassword = await Hash.verify('123456', user.password);

  assert.isTrue(checkPassword);
}).timeout(10000);
test('It cannot reset password after 2h of forgot password request', async ({
  client,
}) => {
  const email = 'vitrola.vitor@gmail.com';

  const user = await Factory.model('App/Models/User').create({ email });
  const userToken = await Factory.model('App/Models/Token').make();

  await user.tokens().save(userToken);
  const hour = new Date();
  hour.setHours(hour.getHours() - 5);
  await Database.table('tokens')
    .where('token', userToken.token)
    .update('created_at', hour);

  await userToken.reload();

  const response = await client
    .post('/reset')
    .send({
      token: userToken.token,
      password: '123456',
      password_confirmation: '123456',
    })
    .end();

  response.assertStatus(400);
});
