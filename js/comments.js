const COMMENTS_API_URL = "https://fa-resumechallenge.azurewebsites.net/api/getcomments";
const POST_COMMENT_URL = "https://fa-resumechallenge.azurewebsites.net/api/postcomment";

function renderComments(comments) {
  const listEl = document.getElementById("comment-list");
  listEl.innerHTML = "";

  if (comments.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "No comments yet — be the first!";
    listEl.appendChild(emptyMsg);
    return;
  }

  comments.forEach(comment => {
    const item = document.createElement("div");
    item.className = "comment-item";

    const nameSpan = document.createElement("span");
    nameSpan.className = "comment-name";
    nameSpan.textContent = comment.name; // textContent, never innerHTML — safe by construction

    const dateSpan = document.createElement("span");
    dateSpan.className = "comment-date";
    const displayDate = new Date(comment.timestamp);
    dateSpan.textContent = isNaN(displayDate) ? "" : displayDate.toLocaleDateString();

    const messageDiv = document.createElement("div");
    messageDiv.className = "comment-message";
    messageDiv.textContent = comment.message; // same here

    item.appendChild(nameSpan);
    item.appendChild(dateSpan);
    item.appendChild(messageDiv);
    listEl.appendChild(item);
  });
}

function loadComments() {
  fetch(COMMENTS_API_URL)
    .then(response => response.json())
    .then(data => renderComments(data))
    .catch(error => {
      console.error("Error loading comments:", error);
      document.getElementById("comment-status").textContent = "Couldn't load comments right now.";
    });
}

document.getElementById("comment-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const statusEl = document.getElementById("comment-status");
  const nameInput = document.getElementById("comment-name");
  const messageInput = document.getElementById("comment-message");
  const honeypotInput = document.getElementById("comment-website");

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !message) {
    statusEl.textContent = "Please fill in both fields.";
    return;
  }

  statusEl.textContent = "Posting...";

  fetch(POST_COMMENT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name,
      message: message,
      website: honeypotInput.value // bots tend to fill this; humans never see it
    })
  })
    .then(response => {
      if (!response.ok) throw new Error("Failed to post comment");
      return response.json();
    })
    .then(() => {
      statusEl.textContent = "Comment posted!";
      nameInput.value = "";
      messageInput.value = "";
      loadComments();
    })
    .catch(error => {
      console.error("Error posting comment:", error);
      statusEl.textContent = "Something went wrong. Please try again.";
    });
});

loadComments();