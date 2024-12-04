document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('bookForm');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
});

document.addEventListener(RENDER_EVENT, function () {

    const uncompleteBookList = document.getElementById('incompleteBookList');
    uncompleteBookList.innerHTML = '';
    
    const completeBookList = document.getElementById('completeBookList');
    completeBookList.innerHTML = '';
    
    for (const bookItem of books) {
        const bookElements = makeBookElement(bookItem);

        if (!bookItem.isCompleted)
            uncompleteBookList.append(bookElements);

        else
            completeBookList.append(bookElements);
    }
});