const express = require('express');
const app = express();
const fs = require('fs-extra');
const path = require('path');
const Model = require('./model')

function wrap(fn){
    return (req, res, next) => fn(req, res, next).catch(next);
}

app.use(function(req, res, next){
    req.$model = new Model();
    next();
})
// app.use('/api', function(req, res){
//     console.log(JSON.stringify(req, ['url','complete','headers','rawHeaders','trailers','rawTrailers','url','statusCode','method','statusMessage','next','baseUrl','originalUrl','params','query',''],2))
// })
app.get('/api/articles', wrap(require('./controller')))

app.get('/api/article', wrap(require('./controller/article')))


app.use(function(err, req, res, next){
    console.log('err!', err);
    res.send({
        code: -1,
        msg: 'server error'
    })
})

require('./model/pool').init(()=>{
    console.log('读取md文件完成')
    const port = process.env.PORT || 8000
    app.listen(port, () => {
        console.log(`server started at localhost:${port}`)
    })
})

  