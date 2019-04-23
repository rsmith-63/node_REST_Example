/**
 * Created by rob on 1/24/2017.
 */
const path = require("path")
    , koa = require('koa')
    , serve = require("koa-static")
    , port = 4009
    , compress = require('koa-compress')
    , router = require("./routes/router.js")
    , bodyParser = require('koa-bodyparser')
    , session = require('koa-generic-session')
    , mount = require('koa-mount')
    ,  cors = require('kcors');


var app = new koa();
    app.use(cors());



//Centralized Error handler
const errorHandler = async (ctx,next) =>{
    try {
        await next();
    } catch(err){
        ctx.status = ctx.status || 500;
        ctx.message = err.message || "Unknown Error";

        if(!ctx.state.xhr) {
            ctx.type = 'text/html';
            ctx.body = { serverErr: err.message };
        } else {
            ctx.body = err.message;
        }
        if(ctx.status === 500){
            ctx.app.emit('error', err, this);
        }
        else{
            console.log(`status ${ctx.status} error ${ctx.message}`);
        }

    }
};


//Trust proxy
app.proxy = true;

//Session key
app.keys = ["secret secret 111"];

app.use( async (ctx,next) =>{
    if(ctx.request.url === "/api/status"){
        ctx.status = 200;
    } else {
        return await next();
    }
});




app
    .use(errorHandler)		//error handler goes at the top. It catches errors from all the middleware below it.
    .use(compress())
    .use(bodyParser())
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());



app.listen(port, err => {
    if(err){
        console.error(err);
    } else {
        console.info("Main server listening on port %s", port);
    }
});
