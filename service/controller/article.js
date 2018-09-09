module.exports = async function(req, res){
    console.log('id', req.query)
    let article = req.$model.getArticleByName(req.query.id);
    res.send(article);
}