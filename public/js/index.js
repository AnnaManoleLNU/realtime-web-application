import '../socket.io/socket.io.js'

console.log('hello from the client')
const issueTemplate = document.querySelector('#issue-template')

// If issueTemplate is not present on the page, just ignore and do not listen for issue messages.
if (issueTemplate) {
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
  console.log('from the client', issue)

  // Only add a issue if it's not already in the list.
  if (!issueList.querySelector(`[data-id="${issue.id}"]`)) {
    const issueNode = issueTemplate.content.cloneNode(true)

    const issueRow = issueNode.querySelector('tr')
    const doneCheck = issueNode.querySelector('input[type=checkbox]')
    const titleCell = issueNode.querySelector('td:nth-child(2)')
    const [closeLink, viewLink] = issueNode.querySelectorAll('a')

    issueRow.setAttribute('data-id', issue.id)

    if (issue.done) {
      doneCheck.setAttribute('checked', '')
      titleCell.classList.add('text-muted')
    } else {
      doneCheck.removeAttribute('checked')
      titleCell.classList.remove('text-muted')
    }

    titleCell.textContent = issue.title

    closeLink.href = `./issues/${issue.id}/close`
    viewLink.href = `./issues/${issue.id}/view`

    issueList.appendChild(issueNode)
  }
}
