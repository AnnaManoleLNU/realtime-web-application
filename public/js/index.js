const issueTemplate = document.querySelector('#issue-template')
const myButton = document.querySelector('#my-button')

// If issueTemplate is not present on the page, just ignore and do not listen for issue messages.
if (issueTemplate) {
  await import('../socket.io/socket.io.js')
  // Create a socket connection using Socket.IO.
  const socket = window.io()

  // Listen for "issues" message from the server.
  socket.on('issues', (issue) => {
    insertIssueRow(issue)
    updateIssue(issue)
    updateIssueButton(issue)
  })

  socket.on('update', (issue) => {
    updateIssueButton(issue)
  })
}

if (myButton) {
  await import('../socket.io/socket.io.js')
  // Create a socket connection using Socket.IO.
  const socket = window.io()
  console.log('we have a button')

  socket.on('update', (issue) => {
    updateIssueButton(issue)
  })
}

/**
 * Inserts an issue row at the end of the issues table.
 *
 * @param {object} issue - The issue to add.
 */
function insertIssueRow (issue) {
  const issueList = document.querySelector('#issue-list')
  console.log('issue from GitLab', issue)

  // Only add a issue if it's not already in the list.
  if (!issueList.querySelector(`[data-id="${issue.issue.id}"]`)) {
    const issueNode = issueTemplate.content.cloneNode(true)

    const issueRow = issueNode.querySelector('tr')
    const titleCell = issueNode.querySelector('td:nth-child(2)')
    const [updateLink, viewLink] = issueNode.querySelectorAll('a')

    issueRow.setAttribute('data-id', issue.issue.id)

    titleCell.textContent = issue.issue.title

    updateLink.href = `./issues/${issue.issue.id}/update`
    viewLink.href = `./issues/${issue.issue.id}`

    // the child should be first.
    issueList.prepend(issueNode)
  }
}

/**
 * Updates the status and title of an issue.
 *
 * @param {object} issue - The issue to update.
 */
function updateIssue (issue) {
  const issueRow = document.querySelector(`[data-id="${issue.issue.id}"]`)
  const doneCheck = issueRow.querySelector('input[type=checkbox]')
  const titleCell = issueRow.querySelector('td:nth-child(2)')

  if (issue.issue.action === 'close') {
    doneCheck.setAttribute('checked', '')
    titleCell.classList.add('text-muted')
  }
  if (issue.issue.action === 'reopen') {
    doneCheck.removeAttribute('checked')
    titleCell.classList.remove('text-muted')
  }
  if (issue.issue.action === 'update') {
    titleCell.textContent = issue.issue.title
  }
}

/**
 * A function that updates the issue button.
 *
 * @param {object} issue - The issue to update.
 */
function updateIssueButton (issue) {
  console.log(issue)
  const issueButton = document.querySelector('#my-button')
  console.log(issueButton)

  if (issue.issue.state === 'closed') {
    issueButton.textContent = 'Reopen'
  } else {
    issueButton.textContent = 'Close'
  }
}
