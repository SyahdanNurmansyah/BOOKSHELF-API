const STORAGE_KEY = 'BOOKSHELF_APP';
const SAVED_EVENT = 'saved-book';
const RENDER_EVENT = 'render-book';

function isStorageExits() {
    if (typeof (Storage) === undefined) {
        alert('Browser tidak mendukung Local Storage');
        return false;
    }

    return true;
};

function saveData() {
    if (isStorageExits()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(RENDER_EVENT));
    };
;}