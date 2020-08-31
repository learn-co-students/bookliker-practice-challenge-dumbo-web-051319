// document.addEventListener("DOMContentLoaded", function() {});

// Using Event Delegation!

//---------------- Constants Requests ----------------
// `http://localhost:3000/books`
// `http://localhost:3000/users`

const self = {id: 1,"username": "pouros"}

let booksURL = 'http://localhost:3000/books'
// const listPanel = document.querySelector('#list-panel')
// you need to target the ul, not the list panel because all the information will go under the list panel and not ul inside the div box
const listPanelUl = document.querySelector('ul')
const showPanel = document.querySelector('#show-panel')
const createPanel = document.querySelector('#create-form')

//---------------- Fetch Requests ----------------
// Fetching all of the books request
fetch(booksURL)
.then(res => res.json())
.then(slapBooks)


//---------------- Slap To DOM Requests ----------------
// Slapping book titles onto the DOM
function slapBooks(books){
  books.forEach(book =>{
    listPanelUl.innerHTML += `
      <li data-id =${book.id}  > ${book.title} </li>
    `
  })
}

function fetchIndivBook(event){
  console.log('event',typeof event)
  let selectedBook
  if (typeof event === 'string') selectedBook=event
  else  selectedBook = parseInt(event.target.dataset.id)

  fetch(`${booksURL}/${selectedBook}`)
  .then(resp => resp.json())
  .then(slapIndivBook)
}

function slapIndivBook(book){
  // debugger
  // let numLikes = book.user.length
  showPanel.innerHTML=`
    <h3>${book.title}</h3>
    <img src='${book.img_url}'>
    <p>${book.description}</p>
    <button data-id = '${book.id}'  data-likes ='${JSON.stringify(book.users)}'>${book.users.length} Likes</button>
    <button data-id = '${book.id}' id= 'deletebtn'  >Delete this book!</button>
  `
  // you need to access the button when created
  let liList = document.querySelector('button')
  liList.addEventListener('click', updatelikes)
  let delbtn = document.querySelector('#deletebtn')
  delbtn.addEventListener('click', deleteBook)
  // debugger    

}

function deleteBook (event){
  currentBookid = parseInt(event.target.dataset.id)
  // debugger
  fetch(`http://localhost:3000/books/${currentBookid}`,{
    method: 'DELETE'
  }).then(res => res.json())
  .then(console.log)
}



function createBook(event){
  event.preventDefault()
  console.log(event)

}


function updatelikes(event){
  let currentLikes = JSON.parse(event.target.dataset.likes)
  let currentBookid = parseInt(event.target.dataset.id)
  // let currentBookid = (event.target.dataset.id)
  // debugger
  // let newLikeArr = currentLikes.push(self)
  let newLikeArr = [...currentLikes, self]
  // using spread opperator concatinates the value of the person your trying to feed into the array of things. if you want to try this out try making a var example = ["hello",3, "World"] in the console and then console.log(...example). You will see that it breaks everything in the array down into individual elements, then recreating that array. TRY IT =]



  // debugger
  // debugger
    let newLikeCount = newLikeArr
    fetch(`http://localhost:3000/books/${currentBookid}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        users: newLikeArr
      })


    })
    .then(resp => resp.json())
    .then(slapIndivBook)
  }





//---------------- addEventListenerRequests ----------------
listPanelUl.addEventListener('click', fetchIndivBook)
createPanel.addEventListener('submit', createBook)
