/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/overdue', '#controllers/invoices_controller.overdueAll')
router.get('/invoices', '#controllers/invoices_controller.all')
router.get('/clients/:client_id/invoices/overdue', '#controllers/invoices_controller.overdue')
router.get('/dashboard', '#controllers/dashboard_controller.index')

router.resource('clients', '#controllers/clients_controller')
router.resource('clients.invoices', '#controllers/invoices_controller')
router.on('/').renderInertia('home')
