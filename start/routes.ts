/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import ClientsController from '#controllers/ClientsController'
import router from '@adonisjs/core/services/router'
//import { only } from 'node:test'

router.on('/').render('pages/home')

// router.get('/clients', '#controllers/clients_controller.index')
// router.post('/clients', '#controllers/clients_controller.store')
// router.get('/clients/:id/invoices', '#controllers/clients_controller.invoices')
// router.post('/clients/:id/invoices', '#controllers/invoices_controller.store')
// router.get('/clients/:id', '#controllers/clients_controller.show')
// router.get('/clients/:id/edit', '#controllers/clients_controller.edit')
// router.post('/clients/:id', '#controllers/clients_controller.update')
// router.delete('/clients/:id', '#controllers/clients_controller.destroy')
// keep compatibility route for forms/posts that target /clients/:id/delete
//router.post('/clients/:id/delete', '#controllers/clients_controller.destroy')
router.resource('clients', ClientsController)
