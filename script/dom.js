const books = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'BOOKSHELF_APP';
const SAVED_EVENT = 'saved-book';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('bookForm');

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    const changeFooterValue = document.getElementById('footerTitle');
    const mediaQuery = window.matchMedia('(max-width: 590px)');

    function handlerMediaQueryChange(event) {
        if (!event.matches) {
            changeFooterValue.textContent = '© 2024, Syahdan Nurmansyah | Submission Tugas Akhir Dicoding';
        }
        else {
            changeFooterValue.textContent = ('© 2024, Syahdan Nurmansyah');
        }
    };

    handlerMediaQueryChange(mediaQuery);
    mediaQuery.addEventListener('change', handlerMediaQueryChange);

    if (isStorageExits()) {
        localDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    
    const incompletedBOOKList = document.getElementById('incompleteBookList');
    incompletedBOOKList.innerHTML = '';

    const completedBOOKList = document.getElementById('completeBookList');
    completedBOOKList.innerHTML = '';
    
    for (const bookItem of books) {
        const bookElement = makeBookElement(bookItem);

        if (!bookItem.isComplete)
        incompletedBOOKList.append(bookElement);

        else
        completedBOOKList.append(bookElement);
    }
});

function generateId() {
    return new Date().getTime();
};

function generateBookObject(
    id,
    title,
    author,
    year,
    isComplete
) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
};


function localDataFromStorage() {
    const serializeData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializeData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function isStorageExits() {
    if (typeof (Storage) === undefined) {
        alert('Browser tidak mendukung local Storage');
        return false;
    }

    return true;
};

function saveData() {
    if (isStorageExits()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    };
}

function addBook() {
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = parseInt(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    document.getElementById('bookForm').reset();

    const generateID = generateId();
    const bookObject = generateBookObject(
        generateID,
        title,
        author,
        year,
        isComplete,
    );

    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function makeBookElement(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.setAttribute('data-testid', 'bookItemTitle')
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.setAttribute('data-testid', 'bookItemAuthor')
    textAuthor.innerText = 'Penulis: ' + bookObject.author;
    
    const textYear = document.createElement('p');
    textYear.setAttribute('data-testid', 'bookItemYear')
    textYear.innerText = 'Tahun: ' + bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');
    textContainer.setAttribute('data-bookid', bookObject.id);

    textContainer.append(
        textTitle,
        textAuthor,
        textYear
    )

    const bookContentContainer = document.createElement('div');
    bookContentContainer.classList.add('book-list-container');
    bookContentContainer.setAttribute('data-testid', 'bookItem');

    bookContentContainer.append(textContainer);


    // Fungsi ini untuk buku yang belum  selesai dibaca

    if (bookObject.isComplete) {
        const returnBookIcon = document.createElement('button');
        returnBookIcon.classList.add('undo-icon');
        returnBookIcon.setAttribute('data-testid', 'bookItemIsCompleteButton');

        returnBookIcon.addEventListener('click', function () {
            returnBookFromCompleted(bookObject.id);
        });

        const editBookIcon = document.createElement('button');
        editBookIcon.classList.add('edit-icon');
        editBookIcon.setAttribute('data-testid', 'bookItemEditButton');

        editBookIcon.addEventListener('click', function () {
            editBookFromCompleted(bookObject.id);
        });

        const removeBookIcon = document.createElement('button');
        removeBookIcon.classList.add('trash-icon');
        removeBookIcon.setAttribute('data-testid', 'bookItemDeleteButton');

        removeBookIcon.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        });

        const iconBookContainer = document.createElement('div');
        iconBookContainer.classList.add('book-button-icons');
        
        iconBookContainer.append(
            returnBookIcon,
            editBookIcon,
            removeBookIcon
        )

        bookContentContainer.append(iconBookContainer);
    }

    // Fungsi untuk buku yang selesai dibaca

    else {
        const completedBookIcon = document.createElement('button');
        completedBookIcon.classList.add('completed-icon');
        completedBookIcon.setAttribute('data-testid', 'bookItemIsCompleteButton');

        completedBookIcon.addEventListener('click', function () {
            checkedBookFromUncompleted(bookObject.id);
        });

        const editBookIcon = document.createElement('button');
        editBookIcon.classList.add('edit-icon');
        editBookIcon.setAttribute('data-testid', 'bookItemEditButton');

        editBookIcon.addEventListener('click', function () {
            editBookFromCompleted(bookObject.id);
        });

        const removeBookIcon = document.createElement('button');
        removeBookIcon.classList.add('trash-icon');
        removeBookIcon.setAttribute('data-testid', 'bookItemDeleteButton');

        removeBookIcon.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        });

        const iconBookContainer = document.createElement('div');
        iconBookContainer.classList.add('book-button-icons');
        
        iconBookContainer.append(
            completedBookIcon,
            editBookIcon,
            removeBookIcon
        )

        bookContentContainer.append(iconBookContainer);
    }

    return bookContentContainer;
}

function editBookFromCompleted(bookId) {
    const bookElementContainer = document.querySelector(`[data-bookid="${bookId}"]`);
    const textContainer = bookElementContainer;
    // console.log('bookElementContainer: ', bookElementContainer);

    const bookTitle = textContainer.querySelector('[data-testid="bookItemTitle"]');
    // console.log('bookTitle: ', bookTitle);

    const bookAuthor = textContainer.querySelector('[data-testid="bookItemAuthor"]');
    // console.log('bookAuthor: ', bookAuthor);

    const bookYear = textContainer.querySelector('[data-testid="bookItemYear"]');
    // console.log('bookYear: ', bookYear);


    const iconButtonContainer = bookElementContainer.closest('.book-list-container').querySelector('.book-button-icons');

    // console.log('iconButtonContainer: ', iconButtonContainer);

    const iconButtons = Array.from(iconButtonContainer.children);

    bookTitle.style.display = 'none';
    bookAuthor.style.display = 'none';
    bookYear.style.display = 'none';
    
    iconButtons.forEach(button => {
        button.style.display = 'none';
        button.style.marginLeft = '0';
    });

    const titleEditForm = document.createElement('input');
    titleEditForm.required = true;
    titleEditForm.type = 'text';
    titleEditForm.placeholder = 'Edit Judul Buku';
    titleEditForm.value = bookTitle.innerText;
    // console.log('titleEditForm: ', titleEditForm.value)

    const authorEditForm = document.createElement('input');
    authorEditForm.required = true;
    authorEditForm.type = 'text';
    authorEditForm.placeholder = 'Edit Penulis';
    authorEditForm.value = bookAuthor.innerText.replace('Penulis: ', '');

    const yearEditForm = document.createElement('input');
    yearEditForm.required = true;
    yearEditForm.type = 'number';
    yearEditForm.placeholder = 'Edit Tahun';
    yearEditForm.value = bookYear.innerText.replace('Tahun: ', '');

    const saveButtonIcon = document.createElement('button');
    saveButtonIcon.classList.add('completed-icon');
    
    saveButtonIcon.addEventListener('click', function () {
        const bookIndex = findIndexBook(bookId);

        // Memastikan nilai didalam form sebelum edit tetap utuh
        if (bookIndex !== -1) {
            books[bookIndex].title = titleEditForm.value;
            books[bookIndex].author = authorEditForm.value;
            books[bookIndex].year = yearEditForm.value;

            console.log('Book updated: ', books[bookIndex]);
        }

        // Mengganti nilai yang sudah diedit
        bookTitle.innerText = titleEditForm.value;
        bookAuthor.innerText = 'Penulis: ' + authorEditForm.value;
        bookYear.innerText = 'Tahun: ' + yearEditForm.value;;
        saveData();
        
        bookTitle.style.display = 'block';
        bookAuthor.style.display = 'block';
        bookYear.style.display = 'block';
        
        titleEditForm.remove();
        authorEditForm.remove();
        yearEditForm.remove();
        saveButtonIcon.remove();
        cancelButtonIcon.remove();

        iconButtons.forEach(button => button.style.display = 'block')
    });

    const cancelButtonIcon = document.createElement('button');
    cancelButtonIcon.classList.add('undo-icon');

    cancelButtonIcon.addEventListener('click', function () {
        titleEditForm.remove();
        authorEditForm.remove();
        yearEditForm.remove();
        saveButtonIcon.remove();
        cancelButtonIcon.remove();

        bookTitle.style.display = 'block';
        bookAuthor.style.display = 'block';
        bookYear.style.display = 'block';
        iconButtons.forEach(button => button.style.display = 'block');
    });

    const editContainer = document.createElement('div');
    editContainer.classList.add('edit-container');
    
    editContainer.append(
        titleEditForm,
        authorEditForm,
        yearEditForm,
        saveButtonIcon,
        cancelButtonIcon
    )


    textContainer.append(editContainer);
    console.log('Inputs appended and fucntion executed');
}

function returnBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData(); 
}

function checkedBookFromUncompleted(bookId) {
    const bookTarget = findBook(bookId);
    
    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromCompleted(bookId) {
    const indexBook = findIndexBook(bookId);

    if (indexBook === -1) return;

    books.splice(indexBook, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(id) {
    for (const book of books) {
        if (book.id === id) {
            return book;
        }
    }
}

function findIndexBook(id) {
    for (let i = 0; i < books.length; i++) {
        if (books[i].id == id) {
            return i;
        }
    }
    return -1;
}

// function findIndexBook(bookId) {
//     for (const bookIndex in books) {
//         if (books[bookIndex].id === bookId) {
//             return bookIndex;
//         }
//     }
//     return -1;
// }