const config = require('../config');
const fs = require('fs-extra');
const path = require('path');
const util = require('../../util');
const chokidar = require('chokidar');
const md_meta = require('markdown-meta')
// const hljs = require('highlight.js')
var md = require('markdown-it')({
    linkify: true
})
.use(require('markdown-it-highlightjs'), {})
// .use(require('markdown-it-emoji'), {})
  
let pool = {};

function getArticle(name) {
  if (pool[name]) {
    return pool[name];
  } else {
    return null;
  }
}

function getAllArticles() {
  return { 
    ...pool
  };
}

function Pool() {
  return {
    getArticle,
    getAllArticles
  }
}
async function readObj(file) {
  let filePath = path.resolve(config.markdownDir, file);
  let fileContent = await fs.readFile(filePath, 'utf-8');
  let meta = md_meta.parse(fileContent);
  let document = md.render(filterMeta(fileContent));
  return {
    meta,
    document
  }
}

/**
 * 过滤meta文本
 * @param {String} mdText markdown文本
 * @return {String} 
 */
function filterMeta(mdText) {
  return mdText.replace(/<!--\*([\s\S]*)\*-->/, '')
}

function watch() {
  console.log('start watch')
  chokidar.watch(config.markdownDir, {
    ignored: /(^|[\/\\])\../,
    ignoreInitial: true
  }).on('all', (event, path) => {
    console.log(event, path);
    readData()
  });
}

async function readData() {
  console.log('start readData')
  let exi = await fs.exists(config.markdownDir)
  if (!exi) throw new Error('文件池格式错误');
  let isDir = (await fs.stat(config.markdownDir)).isDirectory();
  if (!isDir) throw new Error('文件池格式错误');
  let files = await fs.readdir(config.markdownDir);

  let newPool = {};
  await Promise.all(files.map(async (file) => {
    if (file.startsWith('.')) return;
    let ext = path.extname(file);
    let filePath = path.join(config.markdownDir, file);
    let isFile = (await fs.stat(filePath)).isFile();
    if (!isFile) return console.log(`${file} 不是文件！`);
    let fileBaseName = path.basename(file, ext);
    let isValidName = (ext === '.md' || ext === '.markdown') && util.isEnStrikethrough(fileBaseName);
    if (!isValidName) return console.log(`${file} 文件名不合法！`);

    newPool[fileBaseName] = await readObj(file)
  }))
  pool = newPool;
  console.log('pool after readData', pool);
  return pool;
}

Pool.init = async function (cb) {
  readData().then(pool => {
    cb && cb();
  })
  watch();
}
module.exports = Pool;
