
// ---------------- DOM LOGIC -----------------
function renderBooks(books) {
  books.forEach(displaySingleBook)
}

function displaySingleBook(book) {
  const list = document.querySelector('#list')
  list.innerHTML += `
  <li data-id=${book.id} class="js-li">${book.title}</li>
  `
  list.addEventListener("click", handleClick)
}

function handleClick(event) {
  const selectedBook = event.target
  if (selectedBook.className === "js-li") {
    const bookId = parseInt(selectedBook.dataset.id)
    fetchSingleBook(bookId).then(moreBookInfo)
  }
}

function moreBookInfo(book) {
  const panel = document.querySelector('#show-panel')
  panel.innerHTML =  `
    <h1>${book.title}</h1>
    <img src=${book.img_url}>
    <p>${book.description}</p>
    <br>
    <h3>Readers:</h3>
    <div class="js-list"></div>
    <button class="js-button" data-id=${book.id} >Read Book</button>
  `
  panel.querySelector(".js-list").appendChild(displayUsers(book))
  panel.querySelector(".js-button").addEventListener("click", readBook)
}

function displayUsers(book) {
  const users = book.users.map( user => user.username)
  const ul = document.createElement('ul')
  users.forEach(user => {
    ul.innerHTML += `<li> ${user} </li>`
  })
  return ul
}

function readBook(event) {
  const bookId = parseInt(event.target.dataset.id)
  fetchSingleBook(bookId).then(book => {
    if (book.users.some(user => user.id === 1) === false) {
    book.users.push({id: 1, username: "pouros"})
    patchBook(book)
  } else {
    // debugger
    // alert("you already liked this book")
    book.users.pop()
    patchBook(book)
  }
  })
}

// ------------ EVENT LISTNERS ------------
document.addEventListener("DOMContentLoaded", function() {
  fetchBooks().then(renderBooks)
});

// ------------ FETCH REQUESTS ------------
function fetchBooks () {
  return fetch("http://localhost:3000/books")
  .then(resp => resp.json())
}

function fetchSingleBook(bookId) {
  return fetch(`http://localhost:3000/books/${bookId}`)
  .then(resp => resp.json())
}

function patchBook(book) {
  const bookId = book.id
  fetch(`http://localhost:3000/books/${bookId}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({
        "users": book.users
    })
  }).then(resp => resp.json())
  .then(moreBookInfo)
}
