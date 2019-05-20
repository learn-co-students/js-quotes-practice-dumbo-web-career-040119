const quoteUlTag = document.getElementById("quote-list")
const mainDivTag = document.querySelector('.main-div');
const newQuoteForm = document.querySelector('#new-quote-form');
const deleteButton = document.querySelector('.btn-danger');

document.addEventListener('DOMContentLoaded', event => {
  getQuotes()
});

function getQuotes() {
  fetch("http://localhost:3000/quotes")
  .then(response => response.json())
  .then(arrayOfQuotes => {
    arrayOfQuotes.forEach(quote => {
      makeQuoteCard(quote)
    })
  })
}

const makeQuoteCard = (quote) => {
  return quoteUlTag.innerHTML +=
  `<li class='quote-card' data-card-id="${quote.id}" data-likes="${quote.likes}">
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success' data-id="${quote.id}">Likes: <span>${quote.likes}</span></button>
      <button class='btn-danger' data-id="${quote.id}">Delete</button>
    </blockquote>
  </li>`
}

mainDivTag.addEventListener('click', event => {
  const quoteId = event.target.dataset.id

  if (event.target.className === "btn-danger") {
    const deleteMe = document.querySelector(`[data-card-id='${quoteId}']`);
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
      deleteMe.remove()
    })
  } else if (event.target.className === "btn-success") {
    const likeSpan = event.target.querySelector('span')
    const newLikes = parseInt(likeSpan.innerText) + 1
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
    .then(res => res.json())
    .then(data => {
      likeSpan.innerText = newLikes
    })
  }
});

newQuoteForm.addEventListener('submit', event => {
  event.preventDefault()
  const newQuote = document.querySelector('#new-quote').value;
  const newAuthor = document.querySelector('#author').value;
  fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      quote: newQuote,
      author: newAuthor,
      likes: 0
    })
  })
  .then(response => response.json())
  .then(quote => {
    makeQuoteCard(quote)
  })
});
