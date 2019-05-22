// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener("DOMContentLoaded", () =>{
  const quoteList = document.querySelector('#quote-list')
  const newForm = document.querySelector('#new-quote-form')
  newForm.addEventListener('submit', createNewQuote)
  const URL = 'http://localhost:3000/quotes'

  quoteList.addEventListener("click", function(event){
    if (event.target.className === 'btn-danger') {
      removeQuote(event.target.parentNode.parentNode)
    }
    else if (event.target.className === 'btn-success') {
      increaseLikes(event.target.children[0], event.target.parentNode.parentNode)
    }
  })

  fetch(URL, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  .then(response => response.json())
  .then(quotes => quotes.forEach(listOfQuotes))


  function listOfQuotes(quote){
    quoteList.innerHTML += `<li class='quote-card' data-id=${quote.id}>
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success' id='like-quote-${quote.id}'>Likes: <span>${quote.likes}</span></button>
        <button class='btn-danger' id='delete-quote-${quote.id}'>Delete</button>
      </blockquote>
    </li>`
  }

  function createNewQuote(event) {
    event.preventDefault()
    const quote = event.target.querySelector('#new-quote').value
    const author = event.target.querySelector('#author').value

    fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        quote,
        author,
        likes: 0
      })
    })
    .then(response => response.json())
    .then(quote => listOfQuotes(quote))
  }

  function removeQuote(li){
    fetch(URL + '/' + li.dataset.id, {
      method: 'DELETE'
    })
    li.remove()
  }

  function increaseLikes(span, li){
    const quoteId = li.dataset.id
    const newNum = parseInt(span.innerText) + 1

    fetch(URL + '/' + quoteId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        likes: newNum
      })
    })
    .then(response => response.json())
    .then(
      span.innerText = newNum
    )

  }
})
