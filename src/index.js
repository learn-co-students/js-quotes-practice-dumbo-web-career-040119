// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
let quoteUlTag = document.querySelector('ul')
let mainDivTag = document.querySelector('.main-div')
let newQuoteForm = document.querySelector('#new-quote-form')

document.addEventListener('DOMContentLoaded', (event) => {
  firstFetch()
})

const makeQuoteCardHtml = (quote) => {
  return quoteUlTag.innerHTML += `<li class='quote-card' data-card-id="${quote.id}" data-likes="${quote.likes}">
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success' data-likes="${quote.likes}" data-id="${quote.id}">Likes:  <span>${quote.likes}</span></button>
      <button class='btn-danger' data-id="${quote.id}">Delete</button>
    </blockquote>
  </li>`
}


const firstFetch = () => {

  fetch('http://localhost:3000/quotes')
  .then(res => res.json())
  .then(arrayOfQuotes => {
    arrayOfQuotes.forEach(quote => {
      makeQuoteCardHtml(quote)
    })
  })
}

mainDivTag.addEventListener('click', (event) => {

})

newQuoteForm.addEventListener('submit', (event) => {
  event.preventDefault()
  let newQuote = document.querySelector('#new-quote').value
  let newAuthor = document.querySelector('#author').value
  fetch('http://localhost:3000/quotes', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      quote: newQuote,
      author: newAuthor,
      likes: 0
    })
  })
  .then(res => res.json())
  .then(quote => {
    quoteUlTag.innerHTML = makeQuoteCardHtml(quote)
  })
})


mainDivTag.addEventListener('click', (event) => {
  let quoteId = event.target.dataset.id
  if (event.target.className === 'btn-danger') {
    console.log('delete button')
    let deleteMe = document.querySelector(`[data-card-id="${quoteId}"]`);
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
      method: 'DELETE',
    })
    .then(res => res.json())
    .then(parsedRes => {
      deleteMe.remove()
    })
  }
  else if (event.target.className === 'btn-success') {
    let likesTag = parseInt(event.target.dataset.likes)
    likesTag++;
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        likes: likesTag
      })
    })
    .then(res => res.json())
    .then(parsedRes => {
      event.target.dataset.likes = likesTag;
      event.target.innerText = `Likes: ${likesTag}`
    })
  }
})
