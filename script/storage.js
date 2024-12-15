const STORAGE_KEY = 'BOOKSHELF_APP';
const SAVED_EVENT = 'saved-book';

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