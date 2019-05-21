// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener("DOMContentLoaded", function(){
const listUl = document.querySelector('#quote-list')
const newForm = document.querySelector('#new-quote-form')


function getAllQuotes(){
  fetch("http://localhost:3001/quotes")
  .then(res => res.json())
  .then(quotes => {quotes.forEach(slapItOnTheDom)})
}

// function eachQuote(quotes){
//   quotes.forEach(function(quote){
//
//   })
// }

function slapItOnTheDom(quote){
  // const li = document.createElement('li')
  // li.className = 'quote-card'
  // const blockquote = document.createElement('blockquote')
  // blockquote.className = 'blockquote'
  const makeQuoteLi = `<li class='quote-card'>
        <blockquote class="blockquote">
          <p class="mb-0">"${quote.quote}"</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button data-id="${quote.id}" class='btn-success likes-button'>Likes: <span>${quote.likes}</span></button>
          <button data-id="${quote.id}" class='btn-danger delete'>Delete</button>
          <button class='btn-info'>Edit</button>
        </blockquote>
      </li>`
      listUl.innerHTML += makeQuoteLi
}


newForm.addEventListener('submit', createQuote)

function createQuote(event) {
  event.preventDefault()
  const quote = document.getElementById('new-quote').value
  const author = document.getElementById('author').value

  fetch("http://localhost:3001/quotes", {
    method: "POST",
    headers: {"Content-Type": "application/json",
                "Accept": "application/json"},
    body: JSON.stringify(
      {quote: quote,
      author: author,
    likes: 0}
    )
  })
  .then(res => res.json())
  .then(data => slapItOnTheDom(data))
  // .then(function(data) { slapItOnTheDom(data)}) same as line 56
  // .then(slapItOnTheDom) same as line 56
}

// Shortcut way for body
//   {quote,
//   author,
// likes: 0}

listUl.addEventListener('click', handleClick)

function handleClick (event) {
  if (event.target.classList.contains('delete')) {
    // We only want this to run when a delete button is clicked
    console.log("clicked", event.target.className)
    // debugger
    const quoteId = event.target.dataset.id

    fetch(`http://localhost:3001/quotes/${quoteId}`,{
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(res => res.json())
    .then(data => {
      console.log("What does a delete fetch return?", data);
      // event.preventDefault()
      event.target.parentNode.parentNode.remove()
    })
  } else if (event.target.classList.contains('likes-button')) {
    const quoteId = event.target.dataset.id
    const likesSpan = event.target.querySelector('span')
    const newLike = parseInt(likesSpan.innerText)+1

    fetch(`http://localhost:3001/quotes/${quoteId}`, {
      method: "PATCH",
      headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
      body: JSON.stringify({
        likes: newLike
      })
    }).then(res => res.json())
    .then(data => {
      likesSpan.innerText = newLike
    })


  }
}

// function increaseLikes


getAllQuotes()
})
