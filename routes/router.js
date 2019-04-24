/**
 * Created by rob on 1/24/2017.
 */
"use strict";

const router = require('koa-router')(),
    url = require('url');
let {myLibary} = require('./dummyData');



//Set up router
//Set up requests


//items.filter(item => item !== valueToRemove)
const filterArr = (arry,val) => {
    return arry.filter(item => {
        return item !== val
    });
} ;

const pf = (msg) =>{

    var rand = Math.random();
    console.log('rand ', rand);
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(msg), rand*100 )
    });
};


async function asyncFunction( msg) {


    const result = await pf(msg);
    // wait till the promise resolves (*)

    return result;
}




router.get("/api/testError", (ctx,next) =>{

    throw (Error('Test Error'));


});
router.get("/api/getBookList", (ctx,next) =>{

    ctx.body = JSON.stringify(myLibary.join('|'));
    ctx.type = "application/json";

});
router.post("/api/addBook", (ctx,next) =>{

    const {book} = ctx.request.body;
    console.log(`try to add book ${book}`);
    if(book){
        if(!myLibary.includes(book)){
            myLibary.push(book);
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
    if(myLibary.includes(book)){
        myLibary = filterArr(myLibary,book);
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
    if(myLibary.includes(original_book)){
       const idx = myLibary.indexOf(original_book);
        myLibary[idx] = new_book;
        ctx.type = "application/json";
        ctx.status = 200;

    }
    else{
        ctx.status = 400;
        throw (Error('Book is not in library'));
    }

});

router.put("/api/saveBooks", async (ctx, next) => {
    const {books} = ctx.request.body;
    const bookArry = books.split('|');

    for (let i = 0; i < bookArry.length; i++) {
        console.log( `book ${bookArry[i]}` );
        let res = await asyncFunction(bookArry[i]);
        console.log( `loop over books ${res}` )
    }

    ctx.status = 200;

});
module.exports = router;



