const { nanoid } = require('nanoid');
const books = require('./books');

/*  MENAMPILKAN BUKU */

const AddBookHandler = (request, h) => {
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading
    } = request.payload;

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });

        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });

        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const finished = readPage === pageCount;
    const updatedAt = insertedAt;

    /* Memasukan nilai-nilai ke dalam array */
    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        });

        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan'
    });

    response.code(400);
    return response;
};

/*  MENAMPILKAN SELURUH BUKU */

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    /* Query Oarameter: Name */
    if (name) {
        const filteredBooksName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));

        const response = h.response({
            status: 'success',
            data: {
                books: filteredBooksName.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            }
        });

        response.code(200);
        return response;
    }

    /* Query Oarameter: Reading */
    if (reading) {
        const filteredBooksReading = books.filter((book) => Number(book.reading) === Number(reading));

        const response = h.response({
            status: 'success',
            data: {
                books: filteredBooksReading.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            }
        });
        response.code(200);
        return response;
    }

    /* Query Oarameter: Finished */
    if (finished) {
        const filteredBooksFinished = books.filter((book) => Number(book.finished) === Number(finished));

        const response = h.response({
            status: 'success',
            data: {
                books: filteredBooksFinished.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            }
        });

        response.code(200);
        return response;
    }

    /* Query Oarameter: Tanpa Query */
    const response = h.response({
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }))
        }
    });

    response.code(200);
    return response;
};

/*  MENAMPILKAN BUKU BY ID */

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const book = books.filter((b) => b.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book
            }
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });

    response.code(404);
    return response;
};

/*  MENGUBAH BUKU BY ID */

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading
    } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        };
        if (!name) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku'
            });

            response.code(400);
            return response;
        }

        if (readPage > pageCount) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
            });

            response.code(400);
            return response;
        }

        const finished = (readPage === pageCount);
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });

        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });

    response.code(404);
    return response;
};

/*  MENGHAPUS BUKU BY ID */

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
        books.splice(index, 1);

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });

        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    });

    response.code(404);
    return response;
};

module.exports = {
    AddBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
};
