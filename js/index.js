

document.addEventListener("DOMContentLoaded", function() {
  const bookList = document.getElementById("list")
  const showPanel = document.getElementById("show-panel")

  function fetchBooks(){
  fetch("http://localhost:3000/books")
    .then(res => res.json())
    .then(addLiToTheList)
}

// LISTENIN
bookList.addEventListener("click", clickHandler)




// FETCHIN
function fetchBookShow(bookId){
  fetch(`http://localhost:3000/books/${bookId}`)
  .then(res => res.json())
  .then(slapBookOnDOM)
}


function addLiToTheList(books){
  books.forEach(book => {
    bookList.innerHTML += `
      <li data-book-id="${book.id}">${book.title}</li>
    `
  })
}

// DOM SLAPPIN

function clickHandler(event){
  if(event.target.nodeName === "LI"){
    const bookShowId = event.target.dataset.bookId
    console.log("THIS IS AN LI!")

    fetchBookShow(bookShowId)
  }
}

function slapBookOnDOM(book){
  showPanel.innerHTML = `
  <h1>${book.title}</h1>
  <p><img src="${book.img_url}"></p>
  <p>${book.description}</p>
  <p>Users That Like This Book:</p>
  `
  bookUsers = book.users.forEach(user => {
    showPanel.innerHTML += `${user.username}<br>`
  })
  // debugger
  showPanel.innerHTML += `<p><button class="like-books" id="${book.id}">"Like This Book"</button></p>`

  const myUser = {
    'id':1,
    'username':'pouros'
  }

  let newUserArray = [...book.users, myUser]
  console.log(newUserArray)
  const likeButton = document.querySelector(".like-books")
  likeButton.addEventListener("click", () => addLiker(event, newUserArray))

}
  function addLiker(event, newUserArray){
    console.log(event.target.id)
    bookId = event.target.id
    fetch(`http://localhost:3000/books/${bookId}`, {
      method: "PATCH",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        users: newUserArray
      })
    })
  }
  fetchBooks()
})
