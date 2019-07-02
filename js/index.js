
const ul = document.querySelector('#list')
const showPanel = document.querySelector('#show-panel')
const currentUser = {
  "id":1,
  "username":"pouros"
}

//-------------------- events -------------------------

document.addEventListener("DOMContentLoaded", fetchIndex)
ul.addEventListener('click', e => fetchOneBook(e.target.id))
// showPanel.addEventListener('click', handleClick)
//
// function handleClick(e) {
//   if(e.target.id === 'like-btn') {
//     console.log(e)
//   }
// }

//----------------- fetch functions ----------------

function fetchIndex() {
  fetch(`http://localhost:3000/books`)
  .then(res => res.json())
  .then(listBooks)
}

function fetchOneBook(id) {
  fetch(`http://localhost:3000/books/${id}`)
  .then(res => res.json())
  .then(showBook)
}

function fetchLikePatch(e, book) {
  // debugger
  if (e.target.className === "-1") {
    book.users.push(currentUser)
  } else {
    book.users.splice(e.target.className, 1)
    // e.target.className = -1
  }

  fetch(`http://localhost:3000/books/${book.id}`, {
    method: 'PATCH',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({users: book.users})
  })
  .then(res => res.json())
  .then(showBook)
}

//----------------- dom slaps ----------------------

function listBooks(books) {
  for (const book of books) {
    ul.innerHTML += `
      <li class='book-item-${book.id}' id='${book.id}'> ${book.title} </li>
    `
  }
}

function showBook(book) {

  let isLiked = book.users.findIndex(u => u.id === currentUser.id)
  // -1 if not found, else index in book.users

  let userList = '<ul>'
  for (const user of book.users) {
    userList += '<li>' + user.username + '</li>'
  }
  userList += '<ul>'

  showPanel.innerHTML = `
    <h3>${book.title}</h3>
    <img src=${book.img_url} />
    <h4>Description:</h4>
    <p>${book.description}</p>
    <h4> Users who Liked this Book: </h4>
    ${userList}
    <br>
    <button id='like-btn' class=${isLiked}>${isLiked === -1 ? 'Like' : 'Unlike'}</button>
  `
  const likeBtn = document.querySelector('#like-btn')
  likeBtn.addEventListener('click', (e) => fetchLikePatch(e,book))
}
