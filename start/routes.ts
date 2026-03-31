/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router.get('/', async ({ auth, response }) => {
  if (await auth.check()) {
    return response.redirect('/dashboard')
  }

  return response.redirect('/login')
})

router
  .group(() => {
    router.get('/login', '#controllers/auth_controller.showLogin')
    router.post('/login', '#controllers/auth_controller.login')
    router.get('/register', '#controllers/auth_controller.showRegister')
    router.post('/register', '#controllers/auth_controller.register')
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('/logout', '#controllers/auth_controller.logout')

    router.get('/overdue', '#controllers/invoices_controller.overdueAll')
    router.get('/invoices', '#controllers/invoices_controller.all')
    router.get('/clients/:client_id/invoices/overdue', '#controllers/invoices_controller.overdue')
    router.get('/dashboard', '#controllers/dashboard_controller.index')

    router.resource('clients', '#controllers/clients_controller')
    router.resource('clients.invoices', '#controllers/invoices_controller')
    router
      .resource('clients.invoices.items', '#controllers/invoice_items_controller')
      .only(['store', 'update', 'destroy'])
  })
  .use(middleware.auth())
