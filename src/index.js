URL = 'http://localhost:3000/quotes'
const quoteList = document.querySelector('#quote-list');
const newQuote = document.querySelector('#new-quote-form')
let sortToggle = false


// Display quotes from the database
fetch(URL)
  .then(res => res.json())
  .then(data => data.forEach(addToTheDOM));


// Add each quote to the DOM
function addToTheDOM(quote) {
  let br = document.createElement('br');
  quoteList.appendChild(br);

  // create li with class name
  const li = document.createElement('li');
  li.className = 'quote-card';

  // create blockquote
  const blockquote = document.createElement('blockquote');

  // add contents to blockquote
  blockquote.className = 'blockquote';
  blockquote.dataset.quoteId = quote.id;
  blockquote.innerHTML = `
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    `;

  // append to li
  li.appendChild(blockquote);

  // create like button and add to blockquote
  const success = document.createElement('button');
  success.className = 'btn-success';
  success.innerHTML =
    `Likes: <span>${quote.likes}</span>`;
  success.addEventListener('click', addLike);
  blockquote.appendChild(success);

  // create delete button and add to blockquote
  const danger = document.createElement('button');
  danger.className = 'btn-danger';
  danger.innerText =
    'Delete';
  danger.addEventListener('click', deleteQuote);
  blockquote.appendChild(danger);

  //create edit button and add to blockquote
  const edit = document.createElement('button');
  edit.className = 'btn-edit';
  edit.addEventListener('click', addForm);
  edit.innerText =
    'Edit Quote';
  blockquote.appendChild(edit);

  quoteList.appendChild(li);
};


// Create a new quote
newQuote.addEventListener('submit', addQuote);

function addQuote(event) {
  event.preventDefault();

  const quote = document.querySelector('#new-quote').value;
  const author = document.querySelector('#author').value;
  const likes = 1;

  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ quote, author, likes })
  }).then(res => res.json())
    .then(data => { addToTheDOM(data) })
    .then(document.querySelector('#new-quote').value = '')
    .then(document.querySelector('#author').value = '')
};


// Delete a quote
function deleteQuote(event) {
  let blockquote = event.target.parentElement;
  let card = blockquote.parentElement;

  fetch(URL + `/${blockquote.dataset.quoteId}`, {
    method: "DELETE"
  }).then(res => res.json())
    .then(doc => card.remove())
};


// Add a like
function addLike(event) {
  let id = event.target.parentElement.dataset.quoteId;
  let span = event.target.querySelector('span');
  let likes = parseInt(span.innerText)+1;

  fetch(URL + `/${id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({likes})
  }).then(res => res.json())
    .then(doc => span.innerText = likes)
};


// Edit form
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
};


// Add edit form below the quote
function addForm(event) {
  const blockquote = event.target.parentElement;

  if (blockquote.children.length == 6) {
    const editForm = document.createElement('form');
    createForm(editForm);
    blockquote.appendChild(editForm);
  }
  else {
    blockquote.querySelector('#edit-quote-form').remove()
  };
};


// Make changes to the quote
function editQuote(event) {
  event.preventDefault();

  const blockquote = event.target.parentElement;
  const oldQuote = blockquote.querySelector('p');
  const newQuote = event.target.querySelector('.form-control').value;

  fetch(URL + `/${blockquote.dataset.quoteId}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ quote: newQuote })
  }).then(res => res.json())
    .then(doc => oldQuote.innerText = newQuote)
    .then(addForm(event))
};


// Add sort button
btnDiv = document.querySelector('#sort-button');
button = document.createElement('button');
button.innerText = 'Toggle Sort';
button.addEventListener('click', toggleSortByAuthorLastName);
btnDiv.appendChild(button);


// Sort by last name or return to original display
function toggleSortByAuthorLastName() {
  let listItems = document.getElementsByClassName('quote-card');

  // Sort by last name
  if (sortToggle == false) {
    let sorted = Array.from(listItems).sort((a, b) => {

      // Helper function for finding the last name
      function getLastName(node) {
        lastName = node.querySelector('.blockquote-footer').textContent.split(' ').slice(-1)[0].toUpperCase()
        return lastName
      }
      // Sort
      let one = getLastName(a)
      let two = getLastName(b)
      return one == two ? 0 : (one > two ? 1 : -1)
    });
    // Reset list and append
    quoteList.innerHTML = '';
    sorted.forEach((li) => quoteList.appendChild(li));
    // Change toggle
    sortToggle = true;

  } else {
  // Revert to sort by index
    let sorted = Array.from(listItems).sort((a, b) => {

      // Helper function to find dataset ID
      function index(node) {
        return parseInt(node.children[0].dataset.quoteId)
      }
      // Sort
      let one = index(a)
      let two = index(b)
      return one > two ? 1 : -1
    })
    // Reset list and append
    quoteList.innerHTML = '';
    sorted.forEach((li) => quoteList.appendChild(li));
    // Change toggle
    sortToggle = false;
  };
};
