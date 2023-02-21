import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issue-template')

// If issueTemplate is not present on the page, just ignore and do not listen for issue messages.
if (issueTemplate) {
  // Create a socket connection using Socket.IO.
  const socket = window.io()

  // Listen for "issues/create" message from the server.
  socket.on('issues/create', (issue) => insertIssueRow(issue))
}

/**
 * Inserts an issue row at the end of the issues table.
 *
 * @param {object} issue - The issue to add.
 */
function insertIssueRow (issue) {
  const issueList = document.querySelector('#issue-list')
  console.log(issue)

  // Only add a issue if it's not already in the list.
  if (!issueList.querySelector(`[data-id="${issue.id}"]`)) {
    const issueNode = issueTemplate.content.cloneNode(true)

    const issueRow = issueNode.querySelector('tr')
    const doneCheck = issueNode.querySelector('input[type=checkbox]')
    const descriptionCell = issueNode.querySelector('td:nth-child(2)')
    const [updateLink, deleteLink] = issueNode.querySelectorAll('a')

    issueRow.setAttribute('data-id', issue.id)

    if (issue.done) {
      doneCheck.setAttribute('checked', '')
      descriptionCell.classList.add('text-muted')
    } else {
      doneCheck.removeAttribute('checked')
      descriptionCell.classList.remove('text-muted')
    }

    descriptionCell.textContent = issue.description

    updateLink.href = `./issues/${issue.id}/update`
    deleteLink.href = `./issues/${issue.id}/delete`

    issueList.appendChild(issueNode)
  }
}
