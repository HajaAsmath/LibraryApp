var modal = document.querySelector("#modal");
var btn = document.querySelector(".plus");
var span = document.querySelector(".close");
var catalogue = document.querySelector(".catalogue");
let addBtn = document.querySelector(".add-button");
let editBtn = null;
let removeBtn = null;


btn.addEventListener("click", displayModal);
//catalogue.addEventListener("click",hideModal);
span.addEventListener("click",hideModal);
addBtn.addEventListener("click",addBook);

let books = []

let Book = (function() {
    let nextId = 1;
    return function Book(name, author, totalPages, pagesCompleted) {
        this.id = nextId++;
        this.name = name;
        this.author = author;
        this.totalPages = totalPages;
        this.pagesCompleted = pagesCompleted;
    }
})();

function addBook(e) {
    let totalPages = parseInt(document.querySelector("#total-pages").value);
    let pagesCompleted = parseInt(document.querySelector("#pages-completed").value);
    let bookId = parseInt(document.querySelector("#book-id").value);
    if (pagesCompleted > totalPages) {
        console.log(totalPages+" "+pagesCompleted);
        errorSpan = document.querySelector("#pagesError");
        errorSpan.style.display = "inline";
        return;
    }
    let newBook = null;
    
    if (bookId) {
        let books = new Map(JSON.parse(localStorage.getItem("books")));
        newBook = books.get(bookId);
        newBook.name = document.querySelector("#book-name").value;
        newBook.author = document.querySelector("#author").value;
        newBook.totalPages = totalPages;
        newBook.pagesCompleted = pagesCompleted;
        document.querySelector("#bookName_"+bookId).innerText = newBook.name;
        document.querySelector("#authorName_"+bookId).innerText = newBook.author;
        document.querySelector("#pagesCompleted_"+bookId).innerText = newBook.pagesCompleted;
        document.querySelector("#totalPages_"+bookId).innerText = newBook.totalPages;
    } else {
        
        newBook = new Book(document.querySelector("#book-name").value,document.querySelector("#author").value,
        totalPages,pagesCompleted);
        addToCatalogue(newBook);
    }
    saveToLocalstorage(newBook.id, newBook);
    hideModal(e);
}

function cleanInputFields() {
    let inputDiv = document.querySelector(".form")
    let inputFields = inputDiv.querySelectorAll("input");
    inputFields.forEach(input => input.value="");
}

function saveToLocalstorage(id,book) {
    let books = new Map(JSON.parse(localStorage.getItem("books")));
    books.set(id, book);
    localStorage.setItem("books",JSON.stringify([...books]));
}

function start() {
    let books = new Map(JSON.parse(localStorage.getItem("books")));
    if(books != null && books.size > 0) { 
        books.forEach(book => addToCatalogue(book));
    } else {
        localStorage.setItem("books",JSON.stringify([...new Map()]));
    }
}

function displayModal(e) {
    cleanInputFields();
    if(e.srcElement.className == "remove-button") {
        bookDiv = e.target.closest(".book");
        let bookId = bookDiv.getAttribute("id");
        let books = new Map(JSON.parse(localStorage.getItem("books")));
        books.delete(+bookId);
        localStorage.setItem("books",JSON.stringify([...books]));
        location.reload();
    } else if(e.srcElement.className == "edit-button"){
        let bookId = e.target.closest(".book").getAttribute("id");
        let bookName = document.querySelector("#bookName_"+bookId).innerText;
        let authorName = document.querySelector("#authorName_"+bookId).innerText;
        let pagesCompleted = document.querySelector("#pagesCompleted_"+bookId).innerText;
        let totalpages = document.querySelector("#totalPages_"+bookId).innerText;
        document.querySelector("#book-name").value = bookName;
        document.querySelector("#author").value = authorName;
        document.querySelector("#pages-completed").value = pagesCompleted;
        document.querySelector("#total-pages").value = totalpages;
        document.querySelector("#book-id").value = bookId;
        modal.style.display = "block";
    } else {
        modal.style.display = "block";
    }
}

function hideModal(e) {
    if (e.target == btn)
        displayModal(e);
    else
        modal.style.display = "none";
}

function addToCatalogue(book) {
    let bookDiv = document.createElement("div");
    bookDiv.classList.add("book");
    bookDiv.setAttribute("id",book.id);
    let bookNameDiv = document.createElement("div");
    let authorNameDiv = document.createElement("div");
    let bookNameSpan = document.createElement("span");
    let authorNameSpan = document.createElement("span");
    bookNameSpan.classList.add("name");
    authorNameSpan.classList.add("name");
    bookNameSpan.setAttribute("id","bookName_"+book.id);
    authorNameSpan.setAttribute("id","authorName_"+book.id);
    bookNameSpan.innerText = book.name;
    authorNameSpan.innerText = book.author;
    bookNameDiv.appendChild(bookNameSpan);
    authorNameDiv.appendChild(authorNameSpan);
    
    let pagesDiv = document.createElement("div");
    pagesDiv.setAttribute("id","pages");
    let pagesCompletedDiv = document.createElement("div");
    let totalPegesDiv = document.createElement("div");
    let pagesCompletedlabel = document.createElement("label");
    let totalPagesLabel = document.createElement("label");
    pagesCompletedlabel.innerText = "Pages Completed : ";
    totalPagesLabel.innerText = "Total Pages : ";
    pagesCompletedDiv.appendChild(pagesCompletedlabel);
    totalPegesDiv.appendChild(totalPagesLabel);
    let pagesCompletedSpan = document.createElement("span");
    let totalPagesSpan = document.createElement("span");
    pagesCompletedSpan.innerText = book.pagesCompleted;
    totalPagesSpan.innerText = book.totalPages;
    pagesCompletedSpan.classList.add("pages");
    totalPagesSpan.classList.add("pages");
    pagesCompletedSpan.setAttribute("id","pagesCompleted_"+book.id);
    totalPagesSpan.setAttribute("id","totalPages_"+book.id);
    pagesCompletedDiv.appendChild(pagesCompletedSpan);
    totalPegesDiv.appendChild(totalPagesSpan);
    pagesDiv.appendChild(pagesCompletedDiv);
    pagesDiv.appendChild(totalPegesDiv);

    let changeDiv = document.createElement("div");
    changeDiv.setAttribute("id","edit");
    let editDiv = document.createElement("div");
    let removeDiv = document.createElement("div");
    let editSpan = document.createElement("span");
    let removeSpan = document.createElement("span");
    editSpan.classList.add("edit-button");
    removeSpan.classList.add("remove-button");
    editSpan.innerText = "Edit";
    removeSpan.innerText = "Remove";
    editDiv.appendChild(editSpan);
    removeDiv.appendChild(removeSpan);
    changeDiv.appendChild(editDiv);
    changeDiv.appendChild(removeDiv);

    bookDiv.appendChild(bookNameDiv);
    bookDiv.appendChild(authorNameDiv);
    bookDiv.appendChild(pagesDiv);
    bookDiv.appendChild(changeDiv);

    catalogue.insertBefore(bookDiv, catalogue.childNodes[catalogue.childNodes.length -2]);
    initChangebuttons();
}

function initChangebuttons() {
    editBtn = document.querySelectorAll(".edit-button");
    removeBtn = document.querySelectorAll(".remove-button");
    editBtn.forEach(btn => btn.addEventListener("click",displayModal));
    removeBtn.forEach(btn => btn.addEventListener("click",displayModal));
}
start();