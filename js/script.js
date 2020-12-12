// Elements
const wrapperDiv = document.querySelector(".wrapper-container");
const mainContainerDiv = document.querySelector(".main-container");
const newBookModalPopup = document.getElementById("new-book-modal");
const newBookButton = document.getElementById("add-book-button");
const editBookModalPopup = document.getElementById("edit-book-modal");
const registerModalPopup = document.getElementById("register-modal");
const registerText = document.getElementById("register-text");
const loginModalPopup = document.getElementById("login-modal");
const loginText = document.getElementById("login-text");
const accountModalPopup = document.getElementById("account-modal");
const accountText = document.getElementById("account-text");
const newBookSpan = document.getElementById("new-book-span");
const editBookSpan = document.getElementById("edit-book-span");
const registerSpan = document.getElementById("register-span");
const loginSpan = document.getElementById("login-span");
const accountSpan = document.getElementById("account-span");
const newBookTitleInput = document.getElementById('new-book-title');
const newBookAuthorInput = document.getElementById('new-book-author');
const newBookPagesInput = document.getElementById('new-book-pages');
const newBookSubmitButton = document.getElementById('new-book-submit');
const editBookTitleInput = document.getElementById('edit-book-title');
const editBookAuthorInput = document.getElementById('edit-book-author');
const editBookPagesInput = document.getElementById('edit-book-pages');
const editBookSubmitButton = document.getElementById('edit-book-submit');
const deleteBookSubmitButton = document.getElementById('edit-book-delete');


// Global Variables
let clickedEdit = '';
let myLibrary = [];


// Event Listeners
newBookSubmitButton.addEventListener('click', newBook);
editBookSubmitButton.addEventListener('click', editBook);
deleteBookSubmitButton.addEventListener('click', deleteBook);


// Check for localStorage when app is first loaded
if(localStorage.getItem('library')) {
  myLibrary = JSON.parse(localStorage.getItem("library"));
  informationUpdate();
}


// Read button toggle
mainContainerDiv.addEventListener('click', (event) => {
  const isReadButton = ((event.target.nodeName === 'BUTTON') && (event.target.className === 'book-card-read'));
  if (!isReadButton) {
    return;
  }      // Read button has been clicked
  const sound = document.getElementById("audio1");
  sound.play();     // Play read button sound
  const readButton = event.target;
  const bookCardDiv = event.target.parentNode.parentNode;
  const bookCardIndex = bookCardDiv.dataset.id;
  if(myLibrary[bookCardIndex].read == false) {
    myLibrary[bookCardIndex].read = true;
    readButton.textContent = 'Read';
    readButton.style.backgroundColor = '#40B782';
  }
  else {
    myLibrary[bookCardIndex].read = false;
    readButton.textContent = 'Not Read';
    readButton.style.backgroundColor = '#B74040';
  }
  informationUpdate();
  saveToLocalStorage();
})


// Open Edit Book Modal
mainContainerDiv.addEventListener('click', (event) => {
  event.preventDefault();
  const isEditButton = ((event.target.nodeName === 'BUTTON') && (event.target.className === 'book-card-edit'));
  if (!isEditButton) {
    return;
  }      // Edit button has been clicked

  // Play sound
  const sound = document.getElementById("audio2");
  sound.play();

  // Display the edit book modal
  editBookModalPopup.style.display = "block";

  // When the user clicks on edit book <span> (x), close all modals and remove styling
  editBookSpan.onclick = function() {
    editBookModalPopup.style.display = "none";
    editBookTitleInput.style.border = "none";
    editBookAuthorInput.style.border = "none";
    editBookPagesInput.style.border = "none";
  }

  // When the user clicks anywhere outside of the modal, close it and remove styling
  window.onclick = function(event) {
    if (event.target == editBookModalPopup) {
      editBookModalPopup.style.display = "none";
      editBookTitleInput.style.border = "none";
      editBookAuthorInput.style.border = "none";
      editBookPagesInput.style.border = "none";
    }
  }

  // Identify which book edit button was clicked via index position
  const bookCardDiv = event.target.parentNode.parentNode;
  const bookCardIndex = bookCardDiv.dataset.id;

  // Populate the values from the Library array
  document.getElementById("edit-book-title").value = `${myLibrary[bookCardIndex].title}`;
  document.getElementById("edit-book-author").value = `${myLibrary[bookCardIndex].author}`;
  document.getElementById("edit-book-pages").value = `${myLibrary[bookCardIndex].pages}`;
  document.getElementById("edit-book-read").value = `${myLibrary[bookCardIndex].read}`;

  // Setting global variable
  clickedEdit = bookCardIndex;
})


// Submit Edit
function editBook() {

  // Create variables
  let editBookTitleValue = document.querySelector("#edit-book-title").value;
  let editBookAuthorValue = document.querySelector("#edit-book-author").value;
  let editBookPagesValue = document.querySelector("#edit-book-pages").value;
  let editBookReadValue = document.querySelector("#edit-book-read");

  // Split array into 2
  let number = parseInt(clickedEdit, 10);
  let firstArray = myLibrary.slice(0,(number+1));
  let secondArray = myLibrary.slice(number+1);

  // Pop end off first array
  firstArray.pop();

  // Push new book onto end of first array
  editedBook = new Book(editBookTitleValue, editBookAuthorValue, editBookPagesValue, editBookReadValue.checked);
  firstArray.push(editedBook);

  // Join second array on to end of first array
  let newArray = firstArray.concat(secondArray);
  myLibrary = newArray;
  clearLibrary();
  displayBooksInLibrary();
  informationUpdate();
  saveToLocalStorage();

  // Clear input fields
  document.querySelector("#edit-book-title").value = '';
  document.querySelector("#edit-book-author").value = '';
  document.querySelector("#edit-book-pages").value = '';
  document.querySelector("#edit-book-read").checked = false;

  // Hide modal
  editBookModalPopup.style.display = "none";
}


// Book Constructor
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}


// Display Books in Library
function displayBooksInLibrary() {

    // Loop through array
    for (i = 0; i < myLibrary.length; i++) {

        // Create card div and append to main container
        const cardDiv = document.createElement("div");
        const cardDivClass = document.createAttribute("class");
        cardDivClass.value = "book-card";
        cardDiv.setAttributeNode(cardDivClass);
        cardDiv.setAttribute("data-id", i);
        mainContainerDiv.appendChild(cardDiv);

        // Create a card title wrapper div
        const cardTitleWrapperDiv = document.createElement("div");
        const cardTitleWrapperDivClass = document.createAttribute("class");
        cardTitleWrapperDivClass.value = "book-card-title-wrapper";
        cardTitleWrapperDiv.setAttributeNode(cardTitleWrapperDivClass);
        cardDiv.appendChild(cardTitleWrapperDiv);

        // Create a card title div
        const cardTitleDiv = document.createElement("div");
        const cardTitleDivClass = document.createAttribute("class");
        cardTitleDivClass.value = "book-card-title";
        cardTitleDiv.setAttributeNode(cardTitleDivClass);
        cardTitleWrapperDiv.appendChild(cardTitleDiv);
        let cardHeaderElement = document.createElement("h2");
        let bookTitle = document.createTextNode(myLibrary[i].title); 
        cardHeaderElement.appendChild(bookTitle);
        cardTitleDiv.appendChild(cardHeaderElement);

        // Create a card info wrapper div
        const cardInfoWrapperDiv = document.createElement("div");
        const cardInfoWrapperDivClass = document.createAttribute("class");
        cardInfoWrapperDivClass.value = "book-card-info-wrapper";
        cardInfoWrapperDiv.setAttributeNode(cardInfoWrapperDivClass);
        cardDiv.appendChild(cardInfoWrapperDiv);

        // Create a card author div
        const cardAuthorDiv = document.createElement("div");
        const cardAuthorDivClass = document.createAttribute("class");
        cardAuthorDivClass.value = "book-card-author";
        cardAuthorDiv.setAttributeNode(cardAuthorDivClass);
        cardInfoWrapperDiv.appendChild(cardAuthorDiv);

        // Create a H3 element for author
        let cardAuthorElement = document.createElement("h3");
        let bookAuthor = document.createTextNode(myLibrary[i].author); 
        cardAuthorElement.appendChild(bookAuthor);
        cardAuthorDiv.appendChild(cardAuthorElement);

        // Create a card pages div
        const cardPagesDiv = document.createElement("div");
        const cardPagesDivClass = document.createAttribute("class");
        cardPagesDivClass.value = "book-card-pages";
        cardPagesDiv.setAttributeNode(cardPagesDivClass);
        cardInfoWrapperDiv.appendChild(cardPagesDiv);

        // Create a H4 element for pages
        let cardPagesElement = document.createElement("h4");
        let bookPages = document.createTextNode(`${myLibrary[i].pages} Pages`); 
        cardPagesElement.appendChild(bookPages);
        cardPagesDiv.appendChild(cardPagesElement);

        // Create a card read button
        const cardReadButton = document.createElement("button");
        const cardReadButtonClass = document.createAttribute("class");
        cardReadButtonClass.value = "book-card-read";
        if(myLibrary[i].read == false) {
          cardReadButton.textContent = 'Not Read';
          cardReadButton.style.backgroundColor = '#B74040';
        }
        else {
          cardReadButton.textContent = 'Read';
          cardReadButton.style.backgroundColor = '#40B782';
        }
        cardReadButton.setAttributeNode(cardReadButtonClass);
        cardInfoWrapperDiv.appendChild(cardReadButton);

        // Create a card edit button
        const cardEditButton = document.createElement("button");
        const cardEditButtonClass = document.createAttribute("class");
        cardEditButton.textContent = 'Edit';
        cardEditButtonClass.value = "book-card-edit";
        cardEditButton.setAttributeNode(cardEditButtonClass);
        cardInfoWrapperDiv.appendChild(cardEditButton);
    }
}


// New Book Modal Pop-up
newBookButton.onclick = function() {
  const sound = document.getElementById("audio3");
  sound.play();     // Play new book button sound
  newBookModalPopup.style.display = "block";
}
// When the user clicks on new book <span> (x), close all modals and remove styling
newBookSpan.onclick = function() {
  newBookModalPopup.style.display = "none";
  newBookTitleInput.style.border = "none";
  newBookAuthorInput.style.border = "none";
  newBookPagesInput.style.border = "none";
}
// When the user clicks anywhere outside of the modal, close it and remove styling
window.onclick = function(event) {
  if (event.target == newBookModalPopup) {
    newBookModalPopup.style.display = "none";
    newBookTitleInput.style.border = "none";
    newBookAuthorInput.style.border = "none";
    newBookPagesInput.style.border = "none";
  }
  if (event.target == registerModalPopup) {
    registerModalPopup.style.display = "none";
  } 
  if (event.target == loginModalPopup) {
    loginModalPopup.style.display = "none";
  } 
  if (event.target == accountModalPopup) {
    accountModalPopup.style.display = "none";
  } 
}


// Register Modal Pop-up
registerText.onclick = function() {
  registerModalPopup.style.display = "block";
}
// When the user clicks on register <span> (x), close all modals and remove styling
registerSpan.onclick = function() {
  registerModalPopup.style.display = "none";
}


// Login Modal Pop-up
loginText.onclick = function() {
  loginModalPopup.style.display = "block";
}
// When the user clicks on register <span> (x), close all modals and remove styling
loginSpan.onclick = function() {
  loginModalPopup.style.display = "none";
}


// Display Library
displayBooksInLibrary();


// New Book Addition
function newBook() {
  let newBookTitleValue = document.querySelector("#new-book-title").value;
  let newBookAuthorValue = document.querySelector("#new-book-author").value;
  let newBookPagesValue = document.querySelector("#new-book-pages").value;
  let newBookReadValue = document.querySelector("#new-book-read");
  let addedBook = new Book(newBookTitleValue, newBookAuthorValue, newBookPagesValue, newBookReadValue.checked);
  myLibrary.push(addedBook);
  clearLibrary();
  displayBooksInLibrary();
  informationUpdate();

  // Clear input fields
  document.querySelector("#new-book-title").value = '';
  document.querySelector("#new-book-author").value = '';
  document.querySelector("#new-book-pages").value = '';
  document.querySelector("#new-book-read").checked = false;

  // Hide modal
  newBookModalPopup.style.display = "none";
  saveToLocalStorage();
}


// Delete Book
function deleteBook() {

  // Split array into 2
  let number = parseInt(clickedEdit, 10);
  let firstArray = myLibrary.slice(0,(number+1));
  console.table(firstArray);
  let secondArray = myLibrary.slice(number+1);
  console.table(secondArray);

  // Pop end off first array
  firstArray.pop();
  console.table(firstArray);

  // Join second array on to end of first array
  let newArray = firstArray.concat(secondArray);
  console.table(newArray);
  console.log(myLibrary);
  clearLibrary();
  myLibrary = newArray;
  console.log(myLibrary);
  displayBooksInLibrary();
  informationUpdate();
  saveToLocalStorage();

  // Clear input fields
  document.querySelector("#edit-book-title").value = '';
  document.querySelector("#edit-book-author").value = '';
  document.querySelector("#edit-book-pages").value = '';
  document.querySelector("#edit-book-read").checked = false;
  
  // Hide modal
  editBookModalPopup.style.display = "none";
  return false;
}


// Clear Library
function clearLibrary() {
  for (i = 0; i < myLibrary.length; i++) {
    let books = document.querySelector(".book-card");
    if (books) {
      books.remove();
    }
  }
} 


// Information
function informationUpdate() {
  let books = 0;
  let read = 0;
  let notRead = 0;

  // Count number of books
  let bookCounter = document.querySelectorAll(".book-card");
  books = bookCounter.length;

  // Count number of read books
  let readCounter = document.querySelectorAll(".book-card-read");
  for (let i = 0; i < readCounter.length; i++) {
    if (readCounter[i].innerHTML === 'Read') {
      read++;
    }
    else {
      notRead++;
    }
  }

  // Clear information
  let paragraphBooks = document.getElementById("total-books");
  let paragraphRead = document.getElementById("books-read");
  let paragraphNotRead = document.getElementById("not-read");
  paragraphBooks.innerHTML = '';
  paragraphRead.innerHTML = '';
  paragraphNotRead.innerHTML = '';

  // Populate number of books in library
  paragraphBooks = document.getElementById("total-books");
  booksText = document.createTextNode(`Books: ${books}`);
  paragraphBooks.appendChild(booksText);

  // Populate number of read books in library
  paragraphRead = document.getElementById("books-read");
  readText = document.createTextNode(`Read: ${read}`);
  paragraphRead.appendChild(readText);

  // Populate number of not read books in library
  paragraphNotRead = document.getElementById("not-read");
  notReadText = document.createTextNode(`Not Read: ${notRead}`);
  paragraphNotRead.appendChild(notReadText);
}

// Function that saves the whole library array to localStorage every time a new book is created
function saveToLocalStorage() {
  localStorage.setItem('library', JSON.stringify(myLibrary));
}