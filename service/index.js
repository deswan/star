const express = require('express');
const app = express();
const model = require('./model')

//Promise异步中间件错误捕获器
function wrap(fn){
    return (req, res, next) => fn(req, res, next).catch(next);
}

//attach data model
app.use(function(req, res, next){
    req.$model = model;
    next();
})

// app.get('/api/articles', function(req, res, next){
//     console.log(JSON.stringify(req, ['url','complete','headers','rawHeaders','trailers','rawTrailers','url','statusCode','method','statusMessage','next','baseUrl','originalUrl','params','query',''],2))
//     next();
// })

app.get('/api/articles', wrap(require('./controller')))

app.get('/api/article', wrap(require('./controller/article')))

//错误捕获
app.use(function(err, req, res, next){
    console.error('err!', err);
    res.send({
        code: -1,
        msg: 'server error'
    })
})

require('./model/pool').init(() => {
    console.log('读取md文件完成')
    const port = process.env.PORT || 8000
    app.listen(port, () => {
        console.log(`server started at localhost:${port}`)
    })
})

  