/**
 * Issues routes.
 *
 * @author Anna Manole
 * @version 1.0.0
 */

import express from 'express'
import { IssuesController } from '../controllers/issues-controller.js'

export const router = express.Router()

const controller = new IssuesController()

// Map HTTP verbs and route paths to controller action methods.

router.get('/', (req, res, next) => controller.index(req, res, next))
router.get('/', (req, res) => controller.emit(req, res))

// view a single issue full page format
router.get('/:id', (req, res, next) => controller.viewIssue(req, res, next))

// close an issue.
router.post('/:id/close', (req, res, next) => controller.closeIssue(req, res, next))
