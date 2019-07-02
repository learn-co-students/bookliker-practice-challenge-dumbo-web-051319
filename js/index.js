document.addEventListener("DOMContentLoaded", function() {

    fetch('http://localhost:3000/books')
    .then(res => res.json())
    .then(displayBooks)

});

const displayBooks = (jsonBooks) => {
    let booksUl = document.querySelector("#list")
    jsonBooks.map(book => {
        let bookLi = document.createElement("li")
        bookLi.className = "book"
        bookLi.id = book.id
        bookLi.innerHTML = `
        <img src="${book.img_url}" class="img">
        <h1>${book.title}</h1>
        `
        bookLi.addEventListener("click", () => {
            singleBook(book, event)
        })
        booksUl.append(bookLi)
    })

}

const singleBook = (book, event) => {
    let showPanel = document.querySelector("#show-panel")
    let newUser = {"id":1, "username":"pouros"}
   
    showPanel.innerHTML = `
    <img src="${book.img_url}">
    <h1>${book.title}</h1>
    <h3>${book.description}</h3>
    <h4>Users who like this book: ${book.users.map(user => (" " + user.username)) }</h4>
    <button class="btn">${book.users.find(user => user.id === newUser.id) ? "Unlike" : "Like"} </button>
    `

    let button = document.querySelector(".btn")
    button.addEventListener("click", () => {
        likeButton(book, event)
    })
}
    
const likeButton = (book, event) => {
    let newUser = {"id":1, "username":"pouros"}
    let userList = book.users
    let btn = document.querySelector(".btn")
  
    if (userList.find(user => user.id === newUser.id)) {
        userList.pop(newUser);
    } else {
        userList.push(newUser);
    }
    fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "users": book.users
        })
    }).then(res => res.json())
    .then(book => {singleBook(book, event)})  
}
