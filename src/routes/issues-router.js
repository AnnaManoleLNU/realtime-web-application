/**
 * Issues routes.
 *
 * @author Mats Loock
 * @version 2.0.0
 */

import express from 'express'
import { IssuesController } from '../controllers/issues-controller.js'

export const router = express.Router()

const controller = new IssuesController()

// Map HTTP verbs and route paths to controller action methods.

router.get('/', (req, res, next) => controller.index(req, res, next))
router.get('/', (req, res) => controller.emit(req, res))
