/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' };
});

Route.post('/sessions', 'SessionController.store');
Route.post('/forgot', 'ForgotPasswordController.store').validator('Forgot');
Route.post('/reset', 'ResetPasswordController.store').validator('Reset');
Route.post('/user', 'UserController.store').validator('User');
Route.group(() => {
  Route.delete('/user', 'UserController.destroy');
  Route.put('/user', 'UserController.update');
  Route.resource('characters', 'CharacterController').apiOnly();
}).middleware('auth');
