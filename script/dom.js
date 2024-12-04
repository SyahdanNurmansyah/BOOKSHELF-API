const books = [];

function generateId() {
    return new Date().getTime();
};

function generateBookObject(
    id,
    title,
    author,
    year,
    isCompleted,
) {
    return {
        id,
        title,
        author,
        year,
        isCompleted,
    };
};

function addBook() {
    const textTitle = document.getElementById('bookFormTitle').value;
    const textAuthor = document.getElementById('bookFormAuthor').value;
    const textYear = parseInt(document.getElementById('bookFormYear').value);
    const isCompleted = document.getElementById('bookFormIsComplete').checked;

    const generateID = generateId();
    const bookObject = generateBookObject(
        generateID,
        textTitle,
        textAuthor,
        textYear,
        isCompleted,
    );

    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function makeBookElement(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.setAttribute('data-testid', 'bookItemTitle')
    textTitle.innerText = 'Judul:' + bookObject.title;
    textTitle.style.color = '#4e4ed6';

    const textAuthor = document.createElement('p');
    textTitle.setAttribute('data-testid', 'bookItemAuthor')
    textAuthor.innerText = 'Penulis: ' + bookObject.author;
    
    const textYear = document.createElement('p');
    textTitle.setAttribute('data-testid', 'bookItemYear')
    textYear.innerText = 'Tahun: ' + bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(
        textTitle,
        textAuthor,
        textYear,
    )

    const container = document.createElement('div');
    container.setAttribute('data-testid', 'bookItem');
    container.setAttribute('data-bookid', `book-${bookObject.id}`);
    container.classList.add('item', 'shadow');

    container.append(textContainer);


    // Fungsi ini untuk buku yang belum  selesai dibaca

    if (bookObject.isCompleted) {
        const undoBookIcon = document.createElement('button');
        undoBookIcon.classList.add('undo-icon');
        undoBookIcon.setAttribute('data-testid', 'bookItemIsCompleteButton');

        undoBookIcon.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id);
        });

        const removeBookIcon = document.createElement('button');
        removeBookIcon.classList.add('trash-icon');
        removeBookIcon.setAttribute('data-testid', 'bookItemDeleteButton');

        removeBookIcon.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        });

        const editBookIcon = document.createElement('button');
        editBookIcon.classList.add('edit-icon');
        editBookIcon.setAttribute('data-testid', 'bookItemEditButton');

        editBookIcon.addEventListener('click', function () {
            editBookFromCompleted(bookObject.id);
        });

        const containerButton = document.createElement('div');
        containerButton.classList.add('book-button-icons');
        containerButton.append(
            undoBookIcon,
            removeBookIcon,
            editBookIcon,
        )

        container.append(containerButton);
    }

    // Fungsi untuk buku yang selesai dibaca

    else {

        const unCompletedBookIcon = document.createElement('button');
        unCompletedBookIcon.classList.add('completed-icon');
        unCompletedBookIcon.setAttribute('data-testid', 'bookItemIsCompleteButton');

        unCompletedBookIcon.addEventListener('click', function () {
            checkedBookFromUncompletedList(bookObject.id);
        });

        const removeBookIcon = document.createElement('button');
        removeBookIcon.classList.add('trash-icon');
        removeBookIcon.setAttribute('data-testid', 'bookItemDeleteButton');

        removeBookIcon.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        });

        const editBookIcon = document.createElement('button');
        editBookIcon.classList.add('edit-icon');
        editBookIcon.setAttribute('data-testid', 'bookItemEditButton');
        
        editBookIcon.addEventListener('click', function () {
            editBookFromCompleted(bookObject.id);
        });

        const containerButton = document.createElement('div');
        containerButton.classList.add('book-button-icons');
        containerButton.append(
            unCompletedBookIcon,
            removeBookIcon,
            editBookIcon,
        )

        container.append(containerButton);
    }   

    return container;
}

function editBookFromCompleted(bookId) {
    const bookElement = document.querySelector(`[data-bookid="${bookId}"]`);
    
    const bookTitle = bookElement.querySelector('[data-testid="bookItemTitle"]');
    const bookAuthor = bookElement.querySelector('[data-testid="bookItemAuthor"]');
    const bookYear = bookElement.querySelector('[data-testid="bookItemYear"]');

    const containerButton = bookElement.querySelector('.book-button-icons');
    const buttons = Array.from(containerButton.children);

    bookTitle.sytle.display = 'none';
    bookAuthor.sytle.display = 'none';
    bookYear.sytle.display = 'none';

    buttons.forEach(button => button.style.display = 'none');

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = bookTitle.innerText.replace('');
    titleInput.placeholder = 'Edit Judul';

    const authorInput = document.createElement('input');
    authorInput.type = 'text';
    authorInput.value = bookAuthor.innerText.replace('');
    authorInput.placeholder = 'Edit Penulis';

    const yearInput = document.createElement('input');
    yearInput.type = 'number';
    yearInput.value = bookYear.innerText.replace('');
    yearInput.placeholder = 'Edit Tahun';

    saveButtonIcon = documnent.createElement('button');
    // saveButtonIcon.classList.add('completed-icon');
    saveButtonIcon.innerText = 'Simpan Perubahan';

    saveButtonIcon.addEventListener('click', function () {
        const indexBook = findIndexBook(bookId);

        if (indexBook !== -1) {
            books[indexBook].title = titleInput.value;
            books[indexBook].author = authorInput.value;
            books[indexBook].year = parseInt(yearInput.value);
        }

        bookTitle.innerText = titleInput.value;
        bookAuthor.innerText = 'Penulis: ' + authorInput.value;
        bookYear = 'Tahun ' + parseInt(yearInput.value);
        saveData();

        titleInput.remove();
        authorInput.remove();
        yearInput.remove();
        saveButtonIcon.remove();

        buttons.forEach(button => button.sytle.display = 'inline');
    });

    const cancelButton = document.createElement('button');
    cancelButton.innerText = 'Batal';
    cancelButton.addEventListener('click', function () {
        titleInput.remove();
        authorInput.remove();
        saveButtonIcon.remove();
        cancelButton.remove();

        bookTitle.style.display = 'block';
        bookAuthor.style.display = 'block';
        bookYear.style.display = 'block';
        buttons.forEach(button => button.style.display = 'inline');
    })

    buttonContainer.append(
        titleInput,
        authorInput,
        yearInput,
        saveButtonIcon,
        cancelButton
    )
}

function findBook(id) {
    for (const book of books) {
        if (book.id === id) {
            return book
        }
    }
}

function findIndexBook(bookId) {
    for (const bookIndex in books) {
        if (books[bookIndex].id === bookId) {
            return bookIndex;
        }
    }
    return -1;
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget === null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function checkedBookFromUncompletedList(bookId) {
    const bookTarget = findBook(bookId);
    
    if (bookTarget === null) return;

    bookTarget.isCompleted = true;
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

