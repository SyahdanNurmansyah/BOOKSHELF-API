const RENDER_EVENT = 'render-book';

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
