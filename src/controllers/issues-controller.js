/**
 * Module for the IssuesController.
 *
 * @author Mats Loock
 * @version 2.0.0
 */

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
    // get from gitlab not from a database. Make request to api.
    try {
      const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues?per_page=50`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + process.env.ACCESS_TOKEN
        }
      })
      const json = await response.json()
      console.log(json)
      // Loop through json and take only the attributes we need: title, description, image. Store this is a new array.
      const issues = []
      for (const issue of json) {
        issues.push({
          title: issue.title,
          description: issue.description,
          image: issue.author.avatar_url
        })
      }
      console.log(issues)
      const viewData = {
        // json
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
      const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues/${id}`, {
        headers: {
          Authorization: 'Bearer ' + process.env.ACCESS_TOKEN,
          'Content-Type': 'application/json'
        }
      })
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }
}
