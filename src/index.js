const quote_list_ul = document.querySelector('#quote-list')
const new_quote_form = document.querySelector('#new-quote-form')

// Gets quotes from local server
function loadQuotes() {
  fetch('http://localhost:3000/quotes')
  .then(res => res.json())
  .then(quotes => quotes.forEach(addQuoteToDom))
}

//populates DOM with Quotes from server
loadQuotes()

// Edits Quote on the server and the DOM, deletes Edit Form after submittal
function editQuote(event) {
  event.preventDefault();


  const blockquote = event.target.parentElement;
  const oldQuote = blockquote.querySelector('p');
  const newQuote = event.target.querySelector('.form-control').value;

  fetch(`http://localhost:3000/quotes/${blockquote.children[3].dataset.quoteId}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ quote: newQuote })
  }).then(res => res.json())
    .then(doc => oldQuote.innerText = newQuote)
    .then(doc => event.target.remove())
};

// builds Edit Form and sends back to addForm, adds Event Listener to form
function createForm(editForm) {
  editForm.id = 'edit-quote-form';
  editForm.innerHTML = `
    <br>
    <label for="edit-quote">Edited Quote</label>
    <input type="text" class="form-control" id="edit-quote">
    <br>
    <button type="submit" class="btn btn-primary">Submit</button>`;

  // Default to original quote
  p = event.target.parentElement.querySelector('p').innerText;
  editForm.querySelector('.form-control').value = p;

  editForm.addEventListener('submit', editQuote);
}

// creates Edit Form, sends to CreateForm(), appends to Quote
function addForm(){

  const blockquote = event.target.parentElement;
  const editForm = document.createElement('form');
  createForm(editForm);
  blockquote.appendChild(editForm);

}

// deletes Quote from server and DOM
function deleteQuote(event){
  let card = event.target.parentElement;
  fetch(`http://localhost:3000/quotes/${event.target.dataset.quoteId}`, {
    method: "DELETE"
  }).then(res => res.json())
    .then(doc => card.parentElement.remove())
}

//adds Likes to server and Like button
function addLike(event, likeInput){
  let id = event.target.dataset.quoteId;
  let span = event.target.querySelector('span');
  let likes = likeInput;

  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      likes: likes
    })
  }).then(res => res.json())
    .then(doc => span.innerText = likes)
}

//adds Quotes to DOM
function addQuoteToDom(quote){
  const li = document.createElement('li')
  li.className = 'quote-card'

  const blockquote = document.createElement('blockquote')
  blockquote.className = 'blockquote'
  li.appendChild(blockquote)

  blockquote.innerHTML = `
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>`

  // add Like button with Event Listener
  const like_btn = document.createElement('button')
  like_btn.dataset.quoteId = quote.id
  like_btn.className = 'btn-success'
  like_btn.innerHTML = `Likes: <span>${quote.likes}</span>`
  like_btn.addEventListener('click', function(event) {
    quote.likes = parseInt(quote.likes) + 1;
    addLike(event, quote.likes);
  });
  blockquote.appendChild(like_btn)

  // add Delete button with Event Listener
  const danger_btn = document.createElement('button')
  danger_btn.dataset.quoteId = quote.id
  danger_btn.className = 'btn-danger'
  danger_btn.innerHTML = 'Delete'
  danger_btn.addEventListener('click', deleteQuote);
  blockquote.appendChild(danger_btn)

  // add Edit button with Event Listener
  const edit_btn = document.createElement('button');
  edit_btn.className = 'edit_btn';
  edit_btn.addEventListener('click', addForm);
  edit_btn.innerText =
    'Edit Quote';
  blockquote.appendChild(edit_btn);

  quote_list_ul.appendChild(li)
}
//adds new Quote to server and DOM
function addQuote(event){
  event.preventDefault()
  const new_quote = document.querySelector('#new-quote')
  const new_author = document.querySelector('#author')
  fetch('http://localhost:3000/quotes', {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      "Accept":"application/json"
    },
    body: JSON.stringify({
      quote: new_quote.value,
      likes: 1,
      author: new_author.value
    })
  }).then(response => response.json())
    .then(data => addQuoteToDom(data))
}

new_quote_form.addEventListener("submit", addQuote)
