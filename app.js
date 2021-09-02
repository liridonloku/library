
let myLibrary = [
    {
        title: "1984",
        author: "George Orwell",
        pages: 360,
        read: "Yes"
    }
];

if(localStorage.myLibrary){
    myLibrary = JSON.parse(localStorage.myLibrary);
}

//Book constructor
function Book(title, author, pages, read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary(newBook){
    myLibrary.push(newBook);
    localStorage.myLibrary = JSON.stringify(myLibrary);
}

//create DOM card element for each book
function createBookElement(object){
    const card = document.createElement("div");
    card.setAttribute('class', 'card');
    card.setAttribute('data', myLibrary.indexOf(object).toString());
    const book = document.createElement("div");
    book.setAttribute('class', 'book');
    const title = document.createElement("p");
    title.textContent = object.title;
    const titleDiv = document.createElement("div");
    titleDiv.appendChild(title);
    const author = document.createElement("p");
    author.textContent = object.author;
    const authorDiv = document.createElement("div");
    authorDiv.appendChild(author);
    const pages = document.createElement("p");
    pages.textContent = `Pages: ${object.pages.toString()}`;
    const pagesDiv = document.createElement("div");
    pagesDiv.appendChild(pages);
    const read = document.createElement("p");
    read.textContent = `Read: ${object.read}`;
    const readDiv = document.createElement("div");
    readDiv.appendChild(read);
    const readButton = document.createElement('button');
    readButton.textContent = 'Read';
    readButton.setAttribute('data', myLibrary.indexOf(object).toString());
    readButton.addEventListener('click', toggleRead);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('data', myLibrary.indexOf(object).toString());
    deleteButton.addEventListener('click', deleteBook);
    const buttonsDiv = document.createElement('div');
    buttonsDiv.appendChild(readButton);
    buttonsDiv.appendChild(deleteButton);
    book.appendChild(titleDiv);
    book.appendChild(authorDiv);
    book.appendChild(pagesDiv);
    book.appendChild(readDiv);
    book.appendChild(buttonsDiv);
    card.appendChild(book);
    return card;
}

function toggleRead(){
    if(myLibrary[this.attributes.data.value].read.toLowerCase() === "yes"){
        myLibrary[this.attributes.data.value].read = "No";
        updateLibrary();
    }
    else{
        myLibrary[this.attributes.data.value].read = "Yes";
        updateLibrary();
    }
    localStorage.myLibrary = JSON.stringify(myLibrary);
}

function deleteBook(){
    myLibrary.splice(this.attributes.data.value,1);
    updateLibrary();
    localStorage.myLibrary = JSON.stringify(myLibrary);
}

//Create the '+' card
function createAddNewElement(){
    const addNew = document.createElement('div');
    addNew.setAttribute('class', 'card');
    addNew.setAttribute('id', 'add-new');
    const newBook = document.createElement('div');
    newBook.setAttribute('class', 'add-book');
    newBook.setAttribute('id', 'new-book');
    const text = document.createElement('h1');
    text.textContent = '+';
    newBook.appendChild(text);
    addNew.appendChild(newBook);
    return addNew;
}

function updateLibrary(){
    const library = document.querySelector('.library');
    library.replaceChildren();
    myLibrary.forEach( book => {
        let bookElement = createBookElement(book);
        library.appendChild(bookElement);
    })
    const addNewCard = createAddNewElement();
    library.appendChild(addNewCard);
    const plusButton = document.getElementById('new-book');
    plusButton.addEventListener('click', toggleForm);
}

let formToggled = false;
function toggleForm(){
    const form = document.getElementById('form');
    if(form.style.display === 'none' || form.style.display === ''){
        form.style.display = 'flex';
        formToggled = true;
    }
    else{
        form.style.display = 'none';
        formToggled = false;
    }
}

function addBook(){
    const title = document.getElementById('title');
    const author = document.getElementById('author');
    const pages = document.getElementById('pages');
    const read = document.getElementById('read');
    if(title.value === '' || author.value === '' || pages.value === '' || read.value === ''){
        alert('Please fill all the fields.');
        return;
    }
    if(isNaN(pages.value) || parseFloat(pages.value)%1 != 0){
        alert('Pages must be a whole number.');
        return;
    }
    if(read.value.toLowerCase() != 'yes' && read.value.toLowerCase() != 'no'){
        alert("Read must be 'yes' or 'no'.");
        return;
    }
    const newBook = new Book(title.value,author.value,parseInt(pages.value).toString(),read.value);
    addBookToLibrary(newBook);
    updateLibrary();
    toggleForm();
    title.value = '';
    author.value = '';
    pages.value = '';
    read.value = '';
}

function cancelAdd(){
    const title = document.getElementById('title');
    const author = document.getElementById('author');
    const pages = document.getElementById('pages');
    const read = document.getElementById('read');
    title.value = '';
    author.value = '';
    pages.value = '';
    read.value = '';
    toggleForm();
}

const enterSupport = (e) => {
    if(formToggled && e.key === 'Enter'){
        addBook();
    }
}

const addButton = document.getElementById('add-button');
addButton.addEventListener('click', addBook);

const cancelButton = document.getElementById('cancel');
cancelButton.addEventListener('click', cancelAdd);

document.addEventListener('keydown', enterSupport);

updateLibrary();