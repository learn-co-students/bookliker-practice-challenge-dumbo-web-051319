// VARIABLES AND CONSTANTS

const listPanel = document.querySelector('#list-panel');
const list = document.querySelector('#list');
const showPanel = document.querySelector('#show-panel');

// EVENT LISTENERS

document.addEventListener("DOMContentLoaded", passBooksToDisplay);
listPanel.addEventListener("click", passOneBookToDisplay);

// FETCHES

function fetchAllBooks() {
  return fetch('http://localhost:3000/books')
    .then((response) => response.json());
}

function fetchOneBook(event) {
  const id = event.target.dataset.id;
  return fetch(`http://localhost:3000/books/${id}`)
    .then((respo) => respo.json());
  // debugger;
}

function fetchBookForPageUpdate(event) {
  // debugger;
  const id = event.target.id.slice(12);
  return fetch(`http://localhost:3000/books/${id}`)
    .then((respo) => respo.json());
}

function fetchBookForPageUpdateJSON(json) {
  // debugger;
  const id = json.id;
  return fetch(`http://localhost:3000/books/${id}`)
    .then((respo) => respo.json());
}


function likeBook(json) {
  const id = json.id
  const userList = document.querySelectorAll('#users li');
  let users = []
  userList.forEach((user) => {
    users.push({"id": user.dataset.id, "username": user.innerText});
  });
  let liked = checkLikeStatus(json);
  if(!liked) {
    users.push({"id": "1", "username": "pouros"});
  } else {
      users.forEach((user, i) => {
        if(user.username == "pouros") {
            delete users[i];
          }
        });
    }
  let config = {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({"users": users})
  }
  fetch(`http://localhost:3000/books/${id}`, config).then((respo) => respo.json()).then((json) => displayOneBook(json));
}

// DOM MANIPULATION

// function displayUpdate(updatedJSON) {
//   debugger;
// }

function displayBooks(json) {
  // debugger;
  json.forEach((book) => {
    li = document.createElement('li');
    li.innerText = `${book.title}`;
    li.dataset.id = `${book.id}`;
    list.append(li);
  });
}

function displayOneBook(json) {
  // debugger;
  showPanel.innerHTML = `
    <h3>${json.title}</h3>
    <img src=${json.img_url}/>
    <p>${json.description}</p>
    <button id='like-button-${json.id}'>Like Book</button>
    <h5>Liked by:</h5>
    <ul id='users'></ul>
  `;
  let likeButton = document.querySelector(`#like-button-${json.id}`)
  likeButton.addEventListener('click', updatePage)
  let userList = document.querySelector('#users');
  // userList.addEventListener('click', function(event));
  // debugger;
  json.users.forEach((user) => {
    let li = document.createElement('li');
    li.innerHTML = `${user.username}`;
    li.dataset.id = `${user.id}`;
    if(li.dataset.id == "1") {
      likeButton.innerText = "Unlike Book";
    }
    userList.append(li);
  });
}


// OTHER LOGIC ------------------------------------------------------

function passBooksToDisplay() {
  fetchAllBooks().then((json) => displayBooks(json));
}

function passOneBookToDisplay(event) {
  // debugger;
  // console.log(event);
  fetchOneBook(event).then((json) => displayOneBook(json))
}

function updatePage(event) {
  // debugger;
    fetchBookForPageUpdate(event).then((json) => likeBook(json))
}

function checkLikeStatus(json) {
  const likeButton = document.querySelector(`#like-button-${json.id}`);
  if(likeButton.innerText == "Like Book") {
    return false;
  } else {
    return true;
  }
}
