const books = [];

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

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

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

function searchBooks () {
    const inputBookTitle = document.getElementById('searchBookTitle');
    const filteredBooks = inputBookTitle.value.toUpperCase();
    const bookItem = document.querySelectorAll(".book-content");

    for (let i = 0; i < bookItem.length; i++) {
        textValue = bookItem[i].textContent || bookItem[i].innerText;
        if (textValue.toUpperCase().indexOf(filteredBooks) > -1) {
            bookItem[i].style.display = '';
        }
        else {
            bookItem[i].style.display = 'none';
        }
    }
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
    textAuthor.innerText = 'Penulis: ' + toTitleCase(bookObject.author);
    
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
        returnBookIcon.classList.add('book-uncompleted-icon');
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
        completedBookIcon.classList.add('book-iscompleted-icon');
        completedBookIcon.setAttribute('data-testid', 'bookItemIsCompleteButton');

        completedBookIcon.addEventListener('click', function () {
            returnBookFromUncompleted(bookObject.id);
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
};


function returnBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData(); 
};

function returnBookFromUncompleted(bookId) {
    const bookTarget = findBook(bookId);
    
    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function editBookFromCompleted(bookId) {
    const bookElementContainer = document.querySelector(`[data-bookid="${bookId}"]`);
    const textContainer = bookElementContainer;
    const bookTitle = textContainer.querySelector('[data-testid="bookItemTitle"]');
    const bookAuthor = textContainer.querySelector('[data-testid="bookItemAuthor"]');
    const bookYear = textContainer.querySelector('[data-testid="bookItemYear"]');

    const iconButtonContainer = bookElementContainer.closest('.book-list-container').querySelector('.book-button-icons');

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

    const authorEditForm = document.createElement('input');
    authorEditForm.classList.add('bookAuthorEditForm')
    authorEditForm.required = true;
    authorEditForm.type = 'text';
    authorEditForm.placeholder = 'Edit Penulis';
    authorEditForm.value = bookAuthor.innerText.replace('Penulis: ', '');

    const yearEditForm = document.createElement('input');
    yearEditForm.classList.add('bookYearEditForm');
    yearEditForm.required = true;
    yearEditForm.type = 'number';
    yearEditForm.placeholder = 'Edit Tahun';
    yearEditForm.value = bookYear.innerText.replace('Tahun: ', '');

    const saveButtonIcon = document.createElement('button');
    saveButtonIcon.classList.add('completed-icon');
    
    saveButtonIcon.addEventListener('click', function () {

        let isValid = true;

        
        if (titleEditForm.value.trim() === '') {
            titleEditForm.setCustomValidity('Judul wajib diisi');
            titleEditForm.reportValidity();
            isValid = false;
        }
        else {
            titleEditForm.setCustomValidity('');
        }

        if (authorEditForm.value.trim() === '') {
            authorEditForm.setCustomValidity('Penulis wajib diisi');
            authorEditForm.reportValidity();
            isValid = false;
        }
        else {
            titleEditForm.setCustomValidity('');
        }

        if (yearEditForm.value.trim() === '') {
            yearEditForm.setCustomValidity('Tahun wajib diisi');
            yearEditForm.reportValidity();
            isValid = false;
        }
        else {
            yearEditForm.setCustomValidity('');
        }

        if (!isValid) {
            return;
        }

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

        iconButtons.forEach(button => button.style.display = 'inline')
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

        iconButtons.forEach(button => button.style.display = 'inline');
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
}

function removeBookFromCompleted(bookId) {
    const indexBook = findIndexBook(bookId);

    if (indexBook === -1) return;

    books.splice(indexBook, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}