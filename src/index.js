// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener('DOMContentLoaded', () =>{

const quoteList = document.querySelector('#quote-list');
const URL = "http://localhost:3000/quotes";
const newQuoteForm = document.querySelector('#new-quote-form')
newQuoteForm.addEventListener('submit', createNewQuote)

fetch(URL, {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})
.then(response => response.json())
.then(quotes => quotes.forEach(listOfQuotes))

function listOfQuotes(quote) {
  quoteList.innerHTML += `<li class='quote-card' data-id=${quote.id}>
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success success-${quote.id}'>Likes: <span>${quote.likes}</span></button>
      <button class='btn-danger danger-${quote.id}'>Delete</button>
    </blockquote>
  </li>`
}

quoteList.addEventListener('click', function(event){
  if (event.target.classList.contains("btn-danger")) {
  removeQuote(event.target.parentNode.parentNode)
  }
  else if (event.target.classList.contains("btn-success")) {
  increaseLikes(event.target.children[0], event.target.parentNode.parentNode);
  console.log(event.target.children[0], event.target.parentNode.parentNode)
  }
})

function createNewQuote(event) {
  event.preventDefault();
  const quote = event.target.querySelector('#new-quote').value
  const author = event.target.querySelector('#author').value
  const likes = 1

  fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({quote, author, likes})
  })
  .then(response => response.json())
  .then(quote => listOfQuotes(quote))
  }

  function increaseLikes(span, card) {
    const qid = card.dataset.id
    const newLikes = parseInt(span.innerText) +1
    fetch(URL + `/${qid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({likes: newLikes})
    })
    .then(response => response.json())
    .then(span.innerText = newLikes)
      // card.querySelector(".btn-success").innerText = `Likes: ${newLikes}`)
    // .then(location.reload())
  }

  function removeQuote(li) {
    const qid = li.dataset.id

    fetch(URL + `/${qid}`, {
      method: 'DELETE'
    })
    li.remove()
  }

// * Clicking the like button will increase the number of likes for this particular comment in the database and on the page without having to refresh.


})
