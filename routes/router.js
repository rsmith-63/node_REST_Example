/**
 * Created by rob on 1/24/2017.
 */
"use strict";

const router = require('koa-router')(),
    url = require('url');
let data = require('./dummyData')

const userCache = [];


//Set up router
//Set up requests


//items.filter(item => item !== valueToRemove)
const filterArr = (arry,val) => {
    return arry.filter(item => {
        return item !== val
    });
} ;





router.get("/api/testError", (ctx,next) =>{

    throw (Error('Test Error'));


});
router.get("/api/getBookList", (ctx,next) =>{

    ctx.body = JSON.stringify(data.myLibary.join('|'));
    ctx.type = "application/json";

});
router.post("/api/addBook", (ctx,next) =>{

    //let queryString = url.parse(ctx.originalUrl,true);
    //let {book} = queryString.query;
    const {book} = ctx.request.body;
    console.log(`try to add book ${book}`);
    if(book){
        if(!data.myLibary.includes(book)){
            data.myLibary.push(book);
            ctx.type = "application/json";
            ctx.status = 201;

        }
        else{
            ctx.status = 400;
            throw (Error(`this is book Already in library ' ${book}' `));
        }

    }
    else{
        ctx.status = 400;
        throw (Error('No book to add'));
    }

});
router.del("/api/deleteBook", (ctx,next) =>{

    let queryString = url.parse(ctx.originalUrl,true);
    let {book} = queryString.query;
    console.log(`try to delete book ${book}`);
    if(data.myLibary.includes(book)){
        data.myLibary = filterArr(data.myLibary,book);
        ctx.type = "application/json";
        ctx.status = 200;

    }
    else{
        ctx.status = 400;
        throw (Error(`Book is not in library ${book}`));
    }

});

router.patch("/api/updateBook", (ctx,next) =>{

    let queryString = url.parse(ctx.originalUrl,true);
    let {original_book,new_book} = queryString.query;
    console.log(`try to updateBook book ${original_book}`);
    if(data.myLibary.includes(original_book)){
       const idx = data.myLibary.indexOf(original_book);
        data.myLibary[idx] = new_book;
        ctx.type = "application/json";
        ctx.status = 200;

    }
    else{
        ctx.status = 400;
        throw (Error('Book is not in library'));
    }

});


module.exports = router;



