/**
 * Module for the IssuesController.
 *
 * @author Anna Manole
 * @version 1.0.0
 */

/**
 * Encapsulates a controller.
 */
export class IssuesController {
  /**
   * Fetches data from gitlab api.
   *
   * @param {*} url - The url to fetch data from.
   * @returns {object} - The data from the url.
   */
  async fetchData (url) {
    url = `https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues?per_page=50`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.ACCESS_TOKEN
      }
    })
    const json = await response.json()
    return json
  }

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
      const json = await this.fetchData()
      // console.log(json)
      // Loop through json and take only the attributes we need: title, description, image. Store this is a new array.
      const issues = []
      for (const issue of json) {
        issues.push({
          title: issue.title,
          description: issue.description,
          image: issue.author.avatar_url,
          id: issue.id,
          iid: issue.iid
        })
      }
      // console.log(issues)
      const viewData = {
        // populate viewData with issues array.
        issues
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
      const json = await this.fetchData()
      console.log(json)
      // for the issue i want to see get the iid.
      const id = req.params.id
      console.log(id)

      // look at the json array and find the issue that corresponds to the id.
      const issue = json.find(issue => issue.id)
      console.log('the issue', issue)

      // create a viewData object from issue that only contains the attributes we need: title, description, image.
      const viewData = {
        title: issue.title,
        description: issue.description,
        image: issue.author.avatar_url
      }
      console.log(viewData)
      res.render('issues/theissue', { viewData })
    } catch (error) {
      console.error(error)
    }
  }
}
