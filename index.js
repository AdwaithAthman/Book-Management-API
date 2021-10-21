require("dotenv").config();

const express = require("express");
//Mongoose
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Database
const database = require("./database")

//initialise express
const booky=express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useFindAndModify: false,
    //useCreateIndex: true
}
).then(() => console.log("Connection established"));

/*
Route            /
Description      Get all the access
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/",(req,res) => {
    return res.json({books: database.books})
});

/*
Route            /is
Description      Get specific book on ISBN
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/is/:isbn",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );
    if(getSpecificBook.length === 0) {
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
    }
    return res.json({book: getSpecificBook});
});

/*
Route            /c
Description      Get specific book on category
Access           PUBLIC
Parameter        category
Methods          GET
*/
booky.get("/c/:category",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );
    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the category of ${req.params.category}`});
    } 
    return res.json({book: getSpecificBook});
});

/*
Route            /lang
Description      Get specific book on category
Access           PUBLIC
Parameter        category
Methods          GET
*/
booky.get("/lang/:language",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.language === req.params.language
    );
    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the category of ${req.params.language}`});
    } 
    return res.json({book: getSpecificBook});
});

/*
Route            /author
Description      Get all the authors
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/author",(req,res) => {
    return res.json({author: database.author});
});

/*
Route            /author
Description      Get authors based on id
Access           PUBLIC
Parameter        id
Methods          GET
*/
booky.get("/author/:id",(req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.id === parseInt(req.params.id)
    );
    if(getSpecificAuthor.length === 0) {
        return res.json({error: `No author found for the book ${req.params.id}`});
    }
    return res.json({authors: getSpecificAuthor});
});

/*
Route            /author/book
Description      Get all authors based on Book
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/author/book/:isbn",(req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );
    if(getSpecificAuthor.length === 0) {
        return res.json({error: `No author found for the book ${req.params.isbn}`});
    }
    return res.json({authors: getSpecificAuthor});
});

/*
Route            /publication
Description      Get all publications
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/publications",(req,res) => {
    return res.json({publications: database.publications});
});


//POST 

/*
Route            /book/new
Description      Add new books
Access           PUBLIC
Parameter        NONE
Methods          POST
*/

booky.post("/book/new",(req,res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books});
});

/*
Route            /author/new
Description      Add new author
Access           PUBLIC
Parameter        NONE
Methods          POST
*/

booky.post("/author/new",(req,res) => {
const newAuthor = req.body;
database.author.push(newAuthor);
return res.json({updatedAuthor: database.author});
});

/*
Route            /publications/new
Description      Add new publication
Access           PUBLIC
Parameter        NONE
Methods          POST
*/

booky.post("/publications/new",(req,res) => {
const newPublication= req.body;
database.publications.push(newPublication);
return res.json({updatedPublication: database.publications});
});

/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/ 

/*
Route            /publications/update/book
Description      Update/add new publication
Access           PUBLIC
Parameter        isbn
Methods          POST
*/

booky.put("/publications/update/book/:isbn",(req,res) => {
//update the publication database
database.publications.forEach((pub) => {
if(pub.id === req.body.pubId){
    return pub.books.push(req.params.isbn);
}
});

//update the books Database
database.books.forEach((book) => {
if(book.ISBN === req.params.isbn){
    book.publications = req.body.pubId;
    return;
}
});

return res.json({
    books: database.books,
    publications: database.publications,
    message: "successfully updated publications"
});
});

/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/

/**************DELETE***************/

/*
Route            /book/delete
Description      Delete a book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
*/

booky.delete("/book/delete/:isbn",(req,res) => {
//Whichever book that does not match with the isbn, just send it to an updatedBookDatabase array
//and rest will be filtered out.
const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn)
    database.books = updatedBookDatabase;
    return res.json({ books: database.books});
});

/*
Route            /book/delete/author
Description      Delete an author from book and vice versa.
Access           PUBLIC
Parameter        isbn, authorId
Methods          DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId",(req, res) => {
//Update the book database 
database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
        const newAuthorList = book.author.filter(
            (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
        );
        book.author = newAuthorList;
        return;
    }
});

//Update the author database
database.author.forEach((eachAuthor) => {
    if(eachAuthor.id === req.params.authorId){
        const newBookList = eachAuthor.books.filter(
            (book) => book !== req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
    }
});

return res.json({
    book: database.books,
    author: database.author,
    message: "Author was deleted!!!"
});
});

/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/

/*
Route            /publication
Description      Get a specific publication
Access           PUBLIC
Parameter        name
Methods          GET
*/
booky.get("/publications/:name",(req,res) => {
    const getSpecificPublication = database.publications.filter(
        (publication) => publication.name === req.params.name
    );
    if(getSpecificPublication.length === 0){
        return res.json({error: `No publication found by the name of ${req.params.name}`});
    }
    return res.json({publication: getSpecificPublication});
});

/*
Route            /publication/book
Description      Get a list of publications based on a book
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/publications/book/:isbn",(req,res) => {
    const getPublications = database.publications.filter(
        (publication) => publication.books.includes(req.params.isbn)
    );
    if(getPublications.length === 0){
        return res.json({error: `No publication found for the book ${req.params.isbn}`});
    }
    return res.json({publication: getPublications});
});

booky.listen(3000,() => {
    console.log("Server is up and running");
});