// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
let quoteDivTag = document.querySelector("#quote-list")
let formQuote = document.querySelector("#new-quote-list")
let formQuoteButton = document.querySelector(".btn-primary ")

document.addEventListener("DOMContentLoaded", function(){
  getQuoteList()
  bindFormSubmit()
})

function quoteDeleteFunc(event){
  event.preventDefault();
  let selfId = parseInt(event.target.parentElement.dataset.quoteId)
  fetch(`http://localhost:3000/quotes/${ selfId }`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  })
  .then(() => {
    event.target.parentElement.remove()
  })
  // .then(event.target.parentElement.remove())
}

function quoteSuccessFunc(){
  event.preventDefault();
  let currlikes = parseInt(event.target.parentElement.dataset.quoteLikes)
  let selfId = parseInt(event.target.parentElement.dataset.quoteId)
  let newLikes = currlikes + 1
  let postUpdateText = event.target.parentElement.querySelector(".btn-success span")
  let postUpdateDataLikes = event.target.parentElement

  fetch(`http://localhost:3000/quotes/${ selfId }`, {
    method: "PATCH",
    headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
    },
    body: JSON.stringify({likes: newLikes})
  })
  .then(() => {
    postUpdateDataLikes.dataset.quoteLikes = newLikes
  })
  .then(() => {
    postUpdateText.innerText = newLikes
  })
}

quoteDivTag.addEventListener("click", function(){
  if (event.target.classList.contains("btn-danger")){
    quoteDeleteFunc(event)
  } else if (event.target.classList.contains("btn-success")){
    quoteSuccessFunc()
  }
  // if (event.target.classList.contains("btn-success") {
  //   quoteSuccessFunc()
  // }
})

function onSubmit(){
  event.preventDefault();
  let newQuote = document.querySelector("#new-quote").value
  let newAuthor = document.querySelector("#author").value
  fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({quote: newQuote, likes: 0, author: newAuthor})
  })
  .then(res => res.json())
  .then(data => slapQuoteOnTheDom(data))
}

function bindFormSubmit(){
  formQuoteButton.addEventListener("click", onSubmit)
}

function slapQuoteOnTheDom(quote){
  quoteContainer = document.querySelector("#quote-list")
  quoteBlock = document.createElement("blockquote")
  quoteP = document.createElement("p")
  quoteFooter = document.createElement("footer")
  quoteBR = document.createElement("br")
  quoteButtonSuccess = document.createElement("button")
  quoteButtonSuccessSpan = document.createElement("span")
  quoteButtonDelete = document.createElement("button")
  quoteBlock.className = "blackquote"
  quoteBlock.dataset.quoteId = quote.id
  quoteBlock.dataset.quoteLikes = quote.likes
  quoteP.className = "mb-0"
  quoteP.innerText = quote.quote
  quoteFooter.className = "blockquote-footer"
  quoteFooter.innerText = quote.author
  quoteButtonSuccess.className = "btn-success"
  quoteButtonSuccess.innerText = "Likes: "
  quoteButtonSuccessSpan.innerText = quote.likes
  quoteButtonSuccess.appendChild(quoteButtonSuccessSpan)
  quoteButtonDelete.className = "btn-danger"
  quoteButtonDelete.innerText = "Delete"

  quoteBlock.appendChild(quoteP)
  quoteBlock.appendChild(quoteFooter)
  quoteBlock.appendChild(quoteBR)
  quoteBlock.appendChild(quoteButtonSuccess)
  quoteBlock.appendChild(quoteButtonDelete)

  quoteContainer.appendChild(quoteBlock)
}

function getQuoteList(){
  fetch("http://localhost:3000/quotes")
    .then(res => res.json())
    .then(data => data.forEach(slapQuoteOnTheDom))
}
