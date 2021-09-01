let myLibrary = [
    {
        title: "1984",
        author: "George Orwell",
        pages: 360,
        read: "Yes"
    },
    {
        title: "Animal Farm",
        author: "George Orwell",
        pages: 250,
        read: "Yes"
    }
];

function createBookElement(object){
    const book = document.createElement("div");
    book.setAttribute('class', 'book');
    const title = document.createElement("p");
    title.textContent = object.title;
    const author = document.createElement("p");
    author.textContent = object.author;
    const pages = document.createElement("p");
    pages.textContent = object.pages.toString();
    const read = document.createElement("p");
    read.textContent = object.read;
    book.appendChild(title);
    book.appendChild(author);
    book.appendChild(pages);
    book.appendChild(read);
    return book;
}

function updateLibrary(){
    const library = document.querySelector('.library');
    myLibrary.forEach( book => {
        let bookElement = createBookElement(book);
        library.appendChild(bookElement);
    })
}

updateLibrary();