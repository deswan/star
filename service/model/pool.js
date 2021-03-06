const Reader = require('./reader')

//数据池
// { [articleName]: { meta: Object, document: String} }
let POOL = {};

function mapToList(map){
  return Object.keys(map).reduce((target, name) => {
      target.push(getArticle(name))
      return target;
  }, [])
}

//获取单个数据
/**
 *  name: my-md
 *  modified_time: 2018-10-10 08:00:00
 *  title: Blogging Like a Boss
 *  document: <p>123</p>
 */
function getArticle(name) {
  if(!POOL[name]) return;
  let article = POOL[name];
  return {
    name,
    ...article.meta,
    document: article.document
  }
}

//获取数据列表（不保证顺序）
function getAllArticles() {
  return mapToList(POOL);
}

function Pool() {
  return {
    getArticle,
    getAllArticles
  }
}

Pool.init = function (cb) {
  let first = true;
  Reader.onData((err, data) => {
    if(err) throw err
    POOL = data;
    console.log('加载数据池完成', POOL)
    if(first) cb(data);
    first = false;
  })
}

module.exports = Pool;