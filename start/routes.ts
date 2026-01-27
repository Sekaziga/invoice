/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home')

router.get('/clients', '#controllers/clients_controller.index')
router.post('/clients', '#controllers/clients_controller.store')
router.get('/clients/:id/invoices', '#controllers/clients_controller.invoices')
router.post('/clients/:id/invoices', '#controllers/invoices_controller.store')
router.get('/clients/:id', '#controllers/clients_controller.show')
router.get('/clients/:id/edit', '#controllers/clients_controller.edit')
router.post('/clients/:id', '#controllers/clients_controller.update')
router.post('/clients/:id/delete', '#controllers/clients_controller.destroy')
