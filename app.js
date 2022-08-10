// UI values
const bookForm = document.getElementById("book-form");
const title = document.getElementById("title");
const author = document.getElementById("author");
const isbn = document.getElementById("isbn");
const list = document.getElementById("book-list");
const filter = document.getElementById("filter")

// Book Object
class Book {
    constructor(title, author, isbn, id){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.id = id;
    }
}

// UI Object
class UI {
    // Add Book To UI
    addBookToList(book){
        // Create Table row
        const row = document.createElement("tr")
        // Add row unique id
        row.id = book.id;
        // Add row innerHTML
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
        `;
        // Add row to list
        list.appendChild(row);
    }

    // Show Alert
    showAlert(message, className){
        // Create alert div
        const div = document.createElement("div");
        // Add classes. alert comes from skeleton css.
        div.className = `alert ${className}`;
        // Add the alert message
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector(".container");
        // Add alert before the form
        container.insertBefore(div, bookForm);
        // Remove the alert after 3 secs.
        setTimeout(function(){
            document.querySelector(".alert").remove();
        }, 3000)
    }

    // Delete Book From UI
    deleteBook(target){
        const ui = new UI
        if(target.className === "delete"){
            target.parentElement.parentElement.remove();
            // Show Alert
            ui.showAlert("Book deleted.", "success");
        }
    }

    // Clear Fields
    clearFields(){
        title.value = "";
        author.value = "";
        isbn.value = "";
    }

    // Filter Books
    filterBooks(target){
        const text = target.value.toLowerCase();
        const trs = document.querySelectorAll("tr");
        trs.forEach(function(tr){
            if(tr.hasAttribute("id")){
                const trText = tr.textContent.toLowerCase(); 
                if(trText.indexOf(text) !== -1){
                    tr.style.display = "table-row";
                }else{
                    tr.style.display = "none";
                }
            }
        })
    }
}

// LS Object
class Store {
    static getBooks(){
        let books;
        //  Check For LS Is Empty Or Not.
        if(localStorage.getItem("books") === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books
    }

    // Display Books On UI
    static displayBooks(){
        const books = Store.getBooks();
        books.forEach(function(book){
            const ui = new UI;
            ui.addBookToList(book);
        })
    }

    // Add Book To LS
    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    // Delete Book From LS
    static removeBook(id){
        const books = Store.getBooks();
        books.forEach(function(book, index){
            if(book.id === id){
                books.splice(index, 1);
            }
        })
        localStorage.setItem("books", JSON.stringify(books));
    }
}

// Event Listener For DOMLoaded
document.addEventListener("DOMContentLoaded", Store.displayBooks);

// Event Listener For Form Submit
bookForm.addEventListener("submit", function(e){
    // Instantiate Book
    const book = new Book(title.value, author.value, isbn.value, `${Date.now()}`);
    
    // Instantiate UI
    const ui = new UI;

    // Validation
    if(title.value === "" || author.value === "" || isbn.value === ""){
        ui.showAlert("Please fill in all the form fields.", "error")
    }else{
        // Add Book To List
        ui.addBookToList(book);
        // Add Book To LS
        Store.addBook(book);
        // Show Alert
        ui.showAlert("Book added.", "success");
        //
        ui.clearFields();
    }

    e.preventDefault();
})

// Event Lstener For Delete Book
list.addEventListener("click", function(e){
    // Instantiate UI
    const ui = new UI;

    // Delete Book From UI
    ui.deleteBook(e.target);

    // Remove Book From LS
    Store.removeBook(e.target.parentElement.parentElement.id)

    e.preventDefault();
})

// Event Listener For Filter
filter.addEventListener("keyup", function(e){
    const ui = new UI;
    ui.filterBooks(e.target)
})