const md_meta = require('markdown-meta');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');
const util = require('../util');
function resolve(file){
    return path.resolve(__dirname, '../md', file); 
}
function argExist(e){
    return process.argv.slice(3).includes(e);
}
let md_name = process.argv[2];
let md_file_name = md_name + '.md';
let md_file_path = resolve(md_file_name);
let isUpdate = argExist('--update-time');
let isExist = fs.existsSync(md_file_path);
if(!isUpdate){
    console.log('==== 新建markdown文件 ====');
    if(isExist){
        console.warn('此markdown文件已存在，请重新命名');
        return process.exit(-1);
    }
    if(!util.isEnStrikethrough(md_name)){
        console.warn('此名称不合法，请重新命名');
        return process.exit(-1);
    }
    let metaStr = md_meta.toMarkdown({
        modified_time: dayjs().format('YYYY-MM-DD HH:mm'),
        title: md_name
    })
    fs.writeFileSync(md_file_path, metaStr + '\n');
    console.log('新建成功^_^')
}else{
    console.log('==== 更新markdown文件修改时间 ====');
    if(!isExist){
        console.warn('此markdown文件不存在');
        return process.exit(-1);
    }
    let content = fs.readFileSync(md_file_path, 'utf-8');
    let meta = md_meta.parse(content);
    meta.modified_time = dayjs().format('YYYY-MM-DD HH:mm');
    let metaStr = md_meta.toMarkdown(meta);
    fs.writeFileSync(md_file_path, metaStr + '\n' + util.filterMeta(content));
    console.log('更新成功^_^')
}