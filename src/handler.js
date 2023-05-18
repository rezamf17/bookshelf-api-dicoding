const {nanoid} = require('nanoid')
const books = require('./books');

const addBookHandler = (request, h) => {
    let {  name, year, author, summary, publisher, pageCount, readPage, finished, reading } = request.payload;
   
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    if (pageCount == readPage) {
      finished = true
    }else{
      finished = false
    }
    const newBook = {
      id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };
    if(readPage > pageCount){
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }else if(request.payload.name == undefined){
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
    books.push(newBook);
    const isSuccess = books.filter((note) => note.id === id).length > 0;
    // console.log(isSuccess)
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }else{
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
      });
      response.code(500);
      return response;
    }
  };

  const getAllBooksHandler = (request) => {
    let filteredBooks = books;
    const { name, reading, finished } = request.query;

    if(name){
      filteredBooks = books.filter((book) => {
        let bookName = book.name.toLowerCase()
        return bookName.includes(name.toLowerCase())
      })
    }
    if (reading== 1){
      filteredBooks = filteredBooks.filter(book => book.reading == true)
    }else if(reading == 0){
      filteredBooks = filteredBooks.filter(book => book.reading == false)
    }else if(finished == 1){
      filteredBooks = filteredBooks.filter(book => book.finished === true)
    }else if(finished == 0){
      filteredBooks = filteredBooks.filter(book => book.finished === false)
    }
    const bookResponses = filteredBooks.map((book) => {
      return { 
        id: book.id,
        name : book.name,
        publisher: book.publisher,
      };
    }); 
    return {
      status: 'success',
      data: {
        books: bookResponses,
      },
    };
  }

  const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const book = books.filter((n) => n.id === id)[0];

    if (book !== undefined) {
      return {
        status: 'success',
        data: {
          book,
        },
      };
    }
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  };

  const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
   
    let { name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt } = request.payload;
    const updatedAt = new Date().toISOString();
    insertedAt = updatedAt
    if (pageCount == readPage) {
      finished = true
    }else{
      finished = false
    }
    const index = books.findIndex((note) => note.id === id);
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }else if(name == null || name == ""){
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }else if(index !== -1){
      books[index] = {
        ...books[index],
        name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt,
        updatedAt,
      };
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;

    }
   
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  };

  const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
   
    const index = books.findIndex((book) => book.id === id);
   
    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }
   
   const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  };
   

  module.exports = {addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler}