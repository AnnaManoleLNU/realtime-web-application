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

  /**
   * View an issue in full page format.
   *
   * @param {*} req - The request object.
   * @param {*} res - The response object.
   * @param {*} next - Express next middleware function.
   */
  async viewIssue (req, res, next) {
    try {
      const id = req.params.id
      const issue = await Issue.findOne({ _id: id })
      console.log(issue)
      if (!issue) {
        return res.status(404).send('Issue not found')
      }
      res.render('issues/theissue', { viewData: issue })
    } catch (error) {
      console.error(error)
    }
  }
}
