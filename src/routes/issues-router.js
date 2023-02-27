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

//  View a single issue full page format.
router.get('/:id', (req, res, next) => controller.getViewPage(req, res, next))

// Get the update page.
router.get('/:id/update', (req, res, next) => controller.getUpdatePage(req, res, next))

// Close an issue.
router.post('/:id/update', (req, res, next) => controller.closeIssue(req, res, next))

// Reopen an issue.
router.post('/:id/update', (req, res, next) => controller.openIssue(req, res, next))
