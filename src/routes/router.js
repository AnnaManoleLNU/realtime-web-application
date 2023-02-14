/**
 * The routes.
 *
 * @author Mats Loock
 * @version 2.0.0
 */

import express from 'express'
import { router as homeRouter } from './home-router.js'
import { router as tasksRouter } from './tasks-router.js'
import { router as webhooksRouter } from './webhooks-router.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/tasks', tasksRouter)
// --------------------------------------------------------------------------
//
// Webhook: Config routes for webhooks.
//
router.use('/webhooks', webhooksRouter)
// --------------------------------------------------------------------------

router.use('*', (req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
