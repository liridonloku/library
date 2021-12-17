// Import firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

// TODO: Add SDKs for Firebase products
import {
  getFirestore,
  collection,
  query,
  addDoc,
  setDoc,
  doc,
  getDocs,
  where,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
// https://firebase.google.com/docs/web/setup#available-libraries

const profileImage = document.querySelector(".user-image");
const profileName = document.querySelector(".user-name");
const userInfo = document.querySelector(".user");
const signInButton = document.querySelector(".sign-in");
const signOutButton = document.querySelector(".sign-out");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNDLT9ypRJDotHUSZ_-J3Cagy8BM7vDBk",
  authDomain: "library-b4865.firebaseapp.com",
  projectId: "library-b4865",
  storageBucket: "library-b4865.appspot.com",
  messagingSenderId: "206998508281",
  appId: "1:206998508281:web:0e3421199238e722f54828",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
let userId;

async function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

function signOutUser() {
  // Sign out of Firebase.
  signOut(getAuth());
}

// Initialize firebase auth
function initFirebaseAuth() {
  // Listen to auth state changes.
  onAuthStateChanged(getAuth(), authStateObserver);
}
initFirebaseAuth();

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  return getAuth().currentUser.photoURL || "/images/profile_placeholder.png";
}

// Returns the signed-in user's display name.
function getUserName() {
  return getAuth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!getAuth().currentUser;
}

function authStateObserver(user) {
  if (user) {
    // User is signed in!
    // Get the signed-in user's profile pic and name.
    let profilePicUrl = getProfilePicUrl();
    let userName = getUserName();
    userId = getAuth().currentUser.uid;
    getFromDatabase();

    // Set the user's profile pic and name.
    profileImage.setAttribute("src", addSizeToGoogleProfilePic(profilePicUrl));
    profileName.textContent = userName;

    // Show user's profile and sign-out button.
    userInfo.classList.remove("invisible");
    profileImage.removeAttribute("hidden");
    profileName.removeAttribute("hidden");
    signOutButton.removeAttribute("hidden");

    // Hide sign-in button.
    signInButton.setAttribute("hidden", "true");
  } else {
    // User is signed out!
    // Hide user's profile and sign-out button.
    userInfo.classList.add("invisible");
    profileName.setAttribute("hidden", "true");
    profileImage.setAttribute("hidden", "true");
    signOutButton.setAttribute("hidden", "true");

    // Show sign-in button.
    signInButton.removeAttribute("hidden");
  }
}

function addSizeToGoogleProfilePic(url) {
  if (url.indexOf("googleusercontent.com") !== -1 && url.indexOf("?") === -1) {
    return url + "?sz=150";
  }
  return url;
}

const addToDatabase = async (newBook) => {
  try {
    const docRef = await addDoc(
      collection(db, "users", `${getAuth().currentUser.uid}`, "books"),
      {
        title: newBook.title,
        author: newBook.author,
        pages: newBook.pages,
        read: newBook.read,
        id: newBook.id,
      }
    );
  } catch (e) {
    console.error("Error adding book to database", e);
  }
};

const getDocument = async (id) => {
  let q = query(
    collection(db, "users", `${userId}`, "books"),
    where("title", "==", id)
  );
  let snapShot = await getDocs(q);
  snapShot.forEach((book) => {
    console.log(book.data());
  });
};

let myLibrary = [
  {
    title: "1984",
    author: "George Orwell",
    pages: 360,
    read: "Yes",
    id: "1",
  },
];

//Check database
const getFromDatabase = async () => {
  const querySnapshot = await getDocs(
    collection(db, "users", `${userId}`, "books")
  );
  let newLibrary = [];
  querySnapshot.forEach((book) => {
    newLibrary.push(book.data());
  });
  myLibrary = newLibrary;
  updateLibrary();
};

//Book constructor
class Book {
  constructor(title, author, pages, read, id) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = id;
  }
}

function addBookToLibrary(newBook) {
  myLibrary.push(newBook);
  isUserSignedIn
    ? addToDatabase(newBook)
    : (localStorage.myLibrary = JSON.stringify(myLibrary));
}

//create DOM card element for each book
function createBookElement(object) {
  const card = document.createElement("div");
  card.setAttribute("class", "card");
  card.setAttribute("data", myLibrary.indexOf(object).toString());
  const book = document.createElement("div");
  book.setAttribute("class", "book");
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
  const readButton = document.createElement("button");
  readButton.textContent = "Read";
  readButton.setAttribute("data", myLibrary.indexOf(object).toString());
  readButton.addEventListener("click", toggleRead);
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("data", myLibrary.indexOf(object).toString());
  deleteButton.setAttribute("id", "delete-button");
  deleteButton.addEventListener("click", deleteBook);
  const buttonsDiv = document.createElement("div");
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

function toggleRead() {
  if (myLibrary[this.attributes.data.value].read.toLowerCase() === "yes") {
    myLibrary[this.attributes.data.value].read = "No";
    updateLibrary();
  } else {
    myLibrary[this.attributes.data.value].read = "Yes";
    updateLibrary();
  }
  localStorage.myLibrary = JSON.stringify(myLibrary);
}

function deleteBook() {
  myLibrary.splice(this.attributes.data.value, 1);
  updateLibrary();
  localStorage.myLibrary = JSON.stringify(myLibrary);
}

//Create the '+' card
function createAddNewElement() {
  const addNew = document.createElement("div");
  addNew.setAttribute("class", "card");
  addNew.setAttribute("id", "add-new");
  const newBook = document.createElement("div");
  newBook.setAttribute("class", "add-book");
  newBook.setAttribute("id", "new-book");
  const text = document.createElement("h1");
  text.textContent = "+";
  newBook.appendChild(text);
  addNew.appendChild(newBook);
  return addNew;
}

function updateLibrary() {
  const library = document.querySelector(".library");
  library.replaceChildren();
  myLibrary.forEach((book) => {
    let bookElement = createBookElement(book);
    library.appendChild(bookElement);
  });
  const addNewCard = createAddNewElement();
  library.appendChild(addNewCard);
  const plusButton = document.getElementById("new-book");
  plusButton.addEventListener("click", toggleForm);
}

let formToggled = false;
function toggleForm() {
  const form = document.getElementById("form");
  if (form.style.display === "none" || form.style.display === "") {
    form.style.display = "flex";
    formToggled = true;
  } else {
    form.style.display = "none";
    formToggled = false;
  }
}

function addBook() {
  const title = document.getElementById("title");
  const author = document.getElementById("author");
  const pages = document.getElementById("pages");
  const read = document.getElementById("read");
  if (
    title.value === "" ||
    author.value === "" ||
    pages.value === "" ||
    read.value === ""
  ) {
    alert("Please fill all the fields.");
    console.log(title.value, author.value, pages.value, read.value);
    return;
  }
  if (
    isNaN(pages.value) ||
    parseFloat(pages.value) % 1 != 0 ||
    parseFloat(pages.value) < 1
  ) {
    alert("Pages must be a whole positive number.");
    return;
  }
  if (read.value.toLowerCase() != "yes" && read.value.toLowerCase() != "no") {
    alert("Read must be 'yes' or 'no'.");
    return;
  }
  let id =
    Date.now().toString(16) + Math.random().toString(16) + "0".repeat(16);
  const newBook = new Book(
    title.value,
    author.value,
    parseInt(pages.value).toString(),
    read.value,
    id
  );
  addBookToLibrary(newBook);
  updateLibrary();
  toggleForm();
  title.value = "";
  author.value = "";
  pages.value = "";
  read.value = "";
}

function cancelAdd() {
  const title = document.getElementById("title");
  const author = document.getElementById("author");
  const pages = document.getElementById("pages");
  const read = document.getElementById("read");
  title.value = "";
  author.value = "";
  pages.value = "";
  read.value = "";
  toggleForm();
}

const enterSupport = (e) => {
  if (formToggled && e.key === "Enter") {
    if (document.activeElement.id === "add-button") {
      e.preventDefault();
      console.log("works");
    }
    if (document.activeElement.id === "cancel") {
      return;
    }
    addBook();
  }
};

const addButton = document.getElementById("add-button");
addButton.addEventListener("click", addBook);

const cancelButton = document.getElementById("cancel");
cancelButton.addEventListener("click", cancelAdd);

document.addEventListener("keydown", enterSupport);

signInButton.addEventListener("click", signIn);
signOutButton.addEventListener("click", signOutUser);

//Form validation
(function () {
  const title = document.getElementById("title");
  const author = document.getElementById("author");
  const pages = document.getElementById("pages");
  const read = document.getElementById("read");
  title.addEventListener("focusout", () => {
    title.reportValidity();
  });
  author.addEventListener("focusout", () => {
    author.reportValidity();
  });
  pages.addEventListener("focusout", () => {
    pages.reportValidity();
  });
  read.addEventListener("focusout", () => {
    read.reportValidity();
  });
})();

updateLibrary();
