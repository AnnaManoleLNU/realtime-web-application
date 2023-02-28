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
    url = `https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues?order_by=created_at&sort=desc`
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
      // Loop through json and take only the attributes we need: title, description, image. Store this is a new array.
      const issues = []
      for (const issue of json) {
        issues.push({
          title: issue.title,
          id: issue.id,
          state: issue.state
        })
      }
      // console.log(json)
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
   * View an issue in full page format.
   *
   * @param {*} req - The request object.
   * @param {*} res - The response object.
   * @param {*} next - Express next middleware function.
   */
  async getViewPage (req, res, next) {
    try {
      const json = await this.fetchData()

      // look at the json array and find the issue that corresponds to the id.
      for (const issue of json) {
        // use parseInt because the id is a number and the req.params.id is a string.
        if (issue.id === parseInt(req.params.id)) {
          const viewData = {
            title: issue.title,
            description: issue.description,
            image: issue.author.avatar_url
          }
          res.render('issues/theissue', { viewData })
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * View an issue in full page format.
   *
   * @param {*} req - The request object.
   * @param {*} res - The response object.
   * @param {*} next - Express next middleware function.
   */
  async getUpdatePage (req, res, next) {
    try {
      const json = await this.fetchData()

      // look at the json array and find the issue that corresponds to the id.
      for (const issue of json) {
        // use parseInt because the id is a number and the req.params.id is a string.
        if (issue.id === parseInt(req.params.id)) {
          const viewData = {
            title: issue.title,
            description: issue.description,
            image: issue.author.avatar_url,
            id: issue.id,
            iid: issue.iid,
            state: issue.state
          }
          res.render('issues/update', { viewData })
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * A method that closes an issue.
   *
   * @param {*} req - The express request object.
   * @param {*} res - The express response object.
   * @param {*} next - Express next middleware function.
   * @param {string} status - The status of the issue.
   */
  async changeStatus (req, res, next, status) {
    try {
      console.log('close issue')
      const json = await this.fetchData()
      // find the issue that corresponds to the id you are trying to close from the json array.
      for (const issue of json) {
        // use parseInt because the id is a number and the req.params.id is a string.
        if (issue.id === parseInt(req.params.id)) {
          // send the data to gitlab api.
          const url = `https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues/${issue.iid}`
          await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + process.env.ACCESS_TOKEN,
              'X-Gitlab-Event': 'Issue Hook'
            },
            body: JSON.stringify({
              state_event: status
            })
          })
          // Socket.IO: Send the created issue to all subscribers.
          res.io.emit('issues/index', issue)
        }
      }

      // redirect to the issues page if the issue is closed, three steps back.
      res.redirect('..')
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * A method that opens an issue.
   *
   * @param {*} req - The express request object.
   * @param {*} res - The express response object.
   * @param {*} next - Express next middleware function.
   *
   */
  async openIssue (req, res, next) {
    await this.changeStatus(req, res, next, 'reopen')
  }

  /**
   * A method that closes an issue.
   *
   * @param {*} req - The express request object.
   * @param {*} res - The express response object.
   * @param {*} next - Express next middleware function.
   *
   */
  async closeIssue (req, res, next) {
    await this.changeStatus(req, res, next, 'close')
  }

  /**
   * A method that edits an issue.
   *
   * @param {*} req - The express request object.
   * @param {*} res - The express response object.
   * @param {*} next - Express next middleware function.
   */
  async updateIssue (req, res, next) {
    try {
      console.log('update issue')
      const json = await this.fetchData()
      for (const issue of json) {
        if (issue.id === parseInt(req.params.id)) {
          // send the data to gitlab api.
          const url = `https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues/${issue.iid}`
          await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + process.env.ACCESS_TOKEN,
              'X-Gitlab-Event': 'Issue Hook'
            },
            body: JSON.stringify({
              title: req.body.title,
              description: req.body.description
            })
          })
          // Socket.IO: Send the created issue to all subscribers.
          // Emit when you close an issue.
          res.io.emit('issues/index', issue)
        }
      }
      // redirect to the issues page when the issue is re-opened.
      // works for dev and prod.
      res.redirect('..')
    } catch (error) {
      console.error(error)
    }
  }
}
