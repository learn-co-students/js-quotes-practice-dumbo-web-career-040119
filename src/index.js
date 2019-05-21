document.addEventListener("DOMContentLoaded", () =>{
  const newQuoteForm = document.querySelector('#new-quote-form')
  const quoteList = document.querySelector('#quote-list')

  quoteList.addEventListener("click", (event) => {
    if (event.target.className === 'btn-danger') {
      deleteQuote(event.target.parentNode.parentNode)
    } else if (event.target.className === 'btn-success') {
      increaseLikes(event.target, event.target.parentNode.parentNode)
    }
  })

  fetchQuotes()

  newQuoteForm.addEventListener("submit", (event) => {
    event.preventDefault()
    createNewQuote(event)
  })


  function fetchQuotes(){
    fetch('http://localhost:3000/quotes')
    .then(response => response.json())
    .then(quotes => quotes.forEach(addToQuoteList))
  }

  function addToQuoteList(quote){
    const newQuoteLi = document.createElement('li')
    newQuoteLi.className = 'quote-card'
    newQuoteLi.dataset.quoteId = quote.id
    newQuoteLi.innerHTML = `<blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>`

    quoteList.append(newQuoteLi)
  }

  function createNewQuote(event){
    let quote = event.target[0].value
    let author = event.target[1].value

    fetch('http://localhost:3000/quotes', {
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
    .then(newQuote => addToQuoteList(newQuote))
  }

  function deleteQuote(quote){
    fetch(`http://localhost:3000/quotes/${quote.dataset.quoteId}`, {
      method: 'DELETE'
    })
    .then(quote.remove())
  }

  function increaseLikes(button, li){
    const id = button.parentElement.parentElement.dataset.quoteId
    const num = parseInt(button.children[0].innerText)
    const newNum = num + 1

    fetch(`http://localhost:3000/quotes/${id}`, {
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
    .then(button.children[0].innerText = newNum)
  }
})
