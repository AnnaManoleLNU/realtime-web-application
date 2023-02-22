/**
 * Module for the IssuesController.
 *
 * @author Mats Loock
 * @version 2.0.0
 */

import { Issue } from '../models/issue.js'

/**
 * Encapsulates a controller.
 */
export class IssuesController {
  /**
   * Displays a list of issues.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = {
        issues: (await Issue.find())
          .map(issue => issue.toObject())
      }

      res.render('issues/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Emits a new issue to all subscribers.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async emit (req, res) {
    // Socket.IO: Send the created issue to all subscribers.
    res.io.emit('issues', req.body)
  }
}
