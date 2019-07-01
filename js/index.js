// VARIABLES AND CONSTANTS

const listPanel = document.querySelector('#list-panel');
const list = document.querySelector('#list');
const showPanel = document.querySelector('#show-panel');

// EVENT LISTENERS

document.addEventListener("DOMContentLoaded", getAllBooks);
listPanel.addEventListener("click", getOneBook);

// FETCHES

function getAllBooks() {
  const fetched = fetch('http://localhost:3000/books');
  const respo = fetched.then((response) => response.json());
  const json = respo.then((json) => displayBooks(json));
}

function getOneBook(event) {
  const id = event.target.dataset.id;
  fetch(`http://localhost:3000/books/${id}`)
    .then((respo) => respo.json()).then((json) => displayOneBook(json))
  // debugger;
}

// function fetchUsers(id) {
//   fetch(`http://localhost:3000/books/${id}`)
//     .then((respo) => respo.json()).then((json) => {
//       return json;
//     })
//     // debugger;
// }

function likeBook(event) {
  const id = event.target.id.slice(12)
  const likeStatus = checkLikeStatus(event);
  const userList = document.querySelectorAll('#users li');
  let users = []
  userList.forEach((user) => {
    if(user.dataset.id != "1") {
      users.push({"id": user.dataset.id, "username": user.innerText});
    }
  })
  if(likeStatus) {
    users.push({"id": "1", "username": "pouros"});
  }
  // debugger;
  // debugger;
  let config = {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({"users": users})
  }
  fetch(`http://localhost:3000/books/${id}`, config)
  changeLikeStatus(id);
  // getAllBooks();
}

// DOM MANIPULATION

function displayBooks(booklist) {
  booklist.forEach((book) => {
    li = document.createElement('li');
    li.innerText = `${book.title}`;
    li.dataset.id = `${book.id}`;
    list.append(li);
    // debugger;
  });
}

function displayOneBook(book) {
  // debugger;
  // set button to display according to user 1
  showPanel.innerHTML = `
    <h3>${book.title}</h3>
    <img src=${book.img_url}/>
    <p>${book.description}</p>
    <button id='like-button-${book.id}'>Like Book</button>
    <h5>Liked by:</h5>
    <ul id='users'></ul>
  `;

  let likeButton = document.querySelector(`#like-button-${book.id}`)
  likeButton.addEventListener('click', likeBook)
  let userList = document.querySelector('#users');
  // userList.addEventListener('click', function(event));
  book.users.forEach((user) => {
    let li = document.createElement('li');
    li.innerHTML = `${user.username}`;
    li.dataset.id = `${user.id}`;
    if(li.dataset.id == "1") {
      likeButton.innerText = "Unlike Book";
    }
    userList.append(li);
  });
}

function changeLikeStatus(id) {
  const likeButton = document.querySelector(`#like-button-${id}`)
  if(likeButton.innerText == "Like Book") {
    likeButton.innerText = "Unlike Book";
  } else {
    likeButton.innerText = "Like Book";
  }
  // debugger;
}

// OTHER LOGIC

function checkLikeStatus(event) {
  if(event.target.innerText == "Like Book"){
    var status = false
  } else {
    var status = true
  }
  return status;
}

// function userHash(json) {
//   return json.users;
//   debugger;
// }
