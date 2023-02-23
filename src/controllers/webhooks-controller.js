/**
 * Module for the WebhooksController.
 *
 * @author Mats Loock
 * @version 2.0.0
 */

import { Issue } from '../models/issue.js'

/**
 * Encapsulates a controller.
 */
export class WebhooksController {
  /**
   * Authenticates the webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authenticate (req, res, next) {
    // Use the GitLab secret token to validate the received payload.
    if (req.headers['x-gitlab-token'] !== process.env.WEBHOOK_SECRET) {
      const error = new Error('Invalid token')
      error.status = 401
      next(error)
      return
    }

    next()
  }

  /**
   * Receives a webhook, and creates a new issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async indexPost (req, res, next) {
    try {
      // Only interested in issues events. (But still, respond with a 200
      // for events not supported.)
      let issue = null
      if (req.body.event_type === 'issue') {
        issue = new Issue({
          // The attributes that are sent from GitLab are documented here:
          // Not used yet.
          title: req.body.object_attributes.title,
          description: req.body.object_attributes.description
          // image: req.body.user.image
        })
        console.log('the image', issue.image)
        // log the request object when an issue is recieved from gitlab.
        console.log(req.body)

        await issue.save()
      }

      // It is important to respond quickly!
      res.status(200).end()

      // Put this last because socket communication can take long time.
      if (issue) {
        res.io.emit('issues', issue.toObject())
      }
    } catch (error) {
      const err = new Error('Internal Server Error')
      err.status = 500
      next(err)
    }
  }
}
