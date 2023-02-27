const issueTemplate = document.querySelector('#issue-template')

// If issueTemplate is not present on the page, just ignore and do not listen for issue messages.
if (issueTemplate) {
  await import('../socket.io/socket.io.js')
  // Create a socket connection using Socket.IO.
  const socket = window.io()

  // Listen for "issues/create" message from the server.
  socket.on('issues', (issue) => insertIssueRow(issue))
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
  if (!issueList.querySelector(`[data-id="${issue.id}"]`)) {
    const issueNode = issueTemplate.content.cloneNode(true)

    const issueRow = issueNode.querySelector('tr')
    const doneCheck = issueNode.querySelector('input[type=checkbox]')
    const titleCell = issueNode.querySelector('td:nth-child(2)')
    const [updateLink, viewLink] = issueNode.querySelectorAll('a')

    issueRow.setAttribute('data-id', issue.issue.id)

    if (issue.done) {
      doneCheck.setAttribute('checked', '')
      titleCell.classList.add('text-muted')
    } else {
      doneCheck.removeAttribute('checked')
      titleCell.classList.remove('text-muted')
    }

    titleCell.textContent = issue.issue.title

    console.log(issue.issue.title)
    console.log(issue.issue.id)

    updateLink.href = `./issues/${issue.issue.id}/update`
    viewLink.href = `./issues/${issue.issue.id}`

    console.log(updateLink)
    console.log(viewLink)

    issueList.appendChild(issueNode)
  }
}
