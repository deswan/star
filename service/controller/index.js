module.exports = async function(req, res){
    console.log(req.query)
    let ret = await req.$model.getArticles({
        sort: ['modified_time', 'desc'], 
        page: req.query.page || 1,
        pageSize: 5
    })
    res.send(ret);
}