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
    let min = 1,
        max = 10;
    let rand = Math.floor(Math.random() * (max - min + 1) + min);

    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(msg), rand*100 )
    });
};


async function saveItemOnDatabase( msg) {



    // wait till the promise resolves (*)

    return await pf(msg);
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
    const out = {};
    for (let i = 0; i < bookArry.length; i++) {
        let start = Date.now();
        await saveItemOnDatabase(bookArry[i]);
        let end = Date.now();
        out[bookArry[i]] = end-start;

    }
    ctx.body = JSON.stringify(out);
    ctx.status = 200;

});
module.exports = router;



