const issueTemplate = document.querySelector('#issue-template')

// If issueTemplate is not present on the page, just ignore and do not listen for issue messages.
if (issueTemplate) {
  await import('../socket.io/socket.io.js')
  // Create a socket connection using Socket.IO.
  const socket = window.io()

  // Listen for "issues" message from the server.
  socket.on('issues', (issue) => {
    insertIssueRow(issue)
    updateStatus(issue)
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
  console.log('the function from the client is working')

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

    issueList.appendChild(issueNode)
  }
}

/**
 * Updates the status of an issue.
 *
 * @param {object} issue - The issue to update.
 */
function updateStatus (issue) {
  const issueRow = document.querySelector(`[data-id="${issue.issue.id}"]`)
  console.log(issueRow)
  const doneCheck = issueRow.querySelector('input[type=checkbox]')
  const titleCell = issueRow.querySelector('td:nth-child(2)')

  if (issue.issue.action === 'close') {
    doneCheck.setAttribute('checked', '')
    titleCell.classList.add('text-muted')
  } else {
    doneCheck.removeAttribute('checked')
    titleCell.classList.remove('text-muted')
  }
}
