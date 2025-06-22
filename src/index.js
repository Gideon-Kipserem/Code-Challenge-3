const BASE_URL = "http://localhost:3000/posts";

const postList = document.getElementById("post-list");
const postDetail = document.getElementById("post-detail");
const newPostForm = document.getElementById("new-post-form");
const editForm = document.getElementById("edit-post-form");
const editTitle = document.getElementById("edit-title");
const editContent = document.getElementById("edit-content");
const cancelEdit = document.getElementById("cancel-edit");

let currentEditingPostId = null;

// Fetch and display all posts
function displayPosts() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(posts => {
      postList.innerHTML = "";
      posts.forEach(post => {
        const div = document.createElement("div");
        div.textContent = post.title;
        div.style.cursor = "pointer";
        div.addEventListener("click", () => handlePostClick(post.id));
        postList.appendChild(div);
      });

      if (posts.length > 0) {
        handlePostClick(posts[0].id);
      }
    });
}

// Display post details
function handlePostClick(id) {
  fetch(`${BASE_URL}/${id}`)
    .then(res => res.json())
    .then(post => {
      postDetail.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <small><i>By ${post.author}</i></small><br/><br/>
        <button id="edit-btn">Edit</button>
        <button id="delete-btn">Delete</button>
      `;

      document.getElementById("edit-btn").addEventListener("click", () => showEditForm(post));
      document.getElementById("delete-btn").addEventListener("click", () => deletePost(post.id));
    });
}

// Add new post
function addNewPostListener() {
  newPostForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("new-title").value;
    const content = document.getElementById("new-content").value;
    const author = document.getElementById("new-author").value;

    const newPost = { title, content, author };

    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(() => {
        displayPosts();
        newPostForm.reset();
      });
  });
}

// Show edit form
function showEditForm(post) {
  editTitle.value = post.title;
  editContent.value = post.content;
  currentEditingPostId = post.id;
  editForm.classList.remove("hidden");
}

// Submit edit
editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const updatedPost = {
    title: editTitle.value,
    content: editContent.value
  };

  fetch(`${BASE_URL}/${currentEditingPostId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedPost)
  })
    .then(() => {
      editForm.classList.add("hidden");
      displayPosts();
    });
});

// Cancel edit
cancelEdit.addEventListener("click", () => {
  editForm.classList.add("hidden");
});

// Delete post
function deletePost(id) {
  fetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  }).then(() => {
    displayPosts();
    postDetail.innerHTML = "<p>Select a post to see details.</p>";
  });
}

// Initialize
function main() {
  displayPosts();
  addNewPostListener();
}
main();
