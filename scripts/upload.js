const Client = require('ssh2-sftp-client');
const COS = require('cos-nodejs-sdk-v5');
const fs = require('fs');
const md_meta = require('markdown-meta');
const dayjs = require('dayjs');
let path = require('path');
const util = require('../util');
let config = require('../.config');
let md_name = process.argv[2];
let md_path = path.resolve(__dirname, '../md', md_name + '.md');
let remote_md_path = path.posix.resolve(config.server.md_dir, md_name + '.md');

if(!md_name || !fs.existsSync(md_path)) console.error('md文件不存在'), process.exit(-1);

let content = fs.readFileSync(md_path, 'utf-8');

function modify_meta(){
    let meta = md_meta.parse(content);
    meta.modified_time = dayjs().format('YYYY-MM-DD HH:mm');
    let metaStr = md_meta.toMarkdown(meta);
    console.log(md_path)
    fs.writeFileSync(md_path, content = metaStr + '\n' + util.filterMeta(content));
    console.log('更新 modify_time 成功 ^_^')
}

async function upload_replace_img(){
    const cos = new COS({
        SecretId: config.img_server.SecretId,
        SecretKey: config.img_server.SecretKey,
    });
    const imgRegExp = /!\[(.+?)\]\((.+?)\)/g
    const URLRegExp = /^https?:\/\//;
    let matched;
    let renameMap = {};
    while(matched = imgRegExp.exec(content)){
        let imgName = matched[2];
        let isURL = URLRegExp.test(imgName);
        let imgPath = path.resolve(__dirname, '../images', imgName);
        let remotePath = '/images/' + encodeURIComponent(imgName);
        let url = config.img_server.Origin + remotePath
        if(!isURL && fs.existsSync(imgPath)){
            await new Promise((resolve, reject) => {
                if(renameMap[imgName]){
                    resolve(url)
                }else{
                    cos.getObject({
                        Bucket : config.img_server.Bucket,        /* 必须 */
                        Region : config.img_server.Region,        /* 必须 */
                        Key : remotePath,            /* 必须 */
                    }, function(err, data) {
                        if(err && err.statusCode === 404){
                            console.log(`上传 ${imgName} 开始...`)
                            cos.putObject({
                                Bucket : config.img_server.Bucket,        /* 必须 */
                                Region : config.img_server.Region,        /* 必须 */
                                Key : remotePath,                          /* 必须 */
                                Body: fs.createReadStream(imgPath),           /* 必须 */
                                onProgress: function (progressData) {
                                    console.log(progressData);
                                },
                            }, function(err, data) {
                                if(err) {
                                    reject(err)
                                } else {
                                    resolve(url);
                                    console.log(`== 上传 ${imgName} 成功 ==`)
                                }
                            });
                        } else if(err){
                            reject(err)
                        } else {
                            console.log(`${url} 已存在`)
                            resolve(url);
                        } 
                    });
                }
            }).then(url => {
                renameMap[imgName] = url;
                console.log(`${imgName} => ${url}`);
            })
        }else if(!isURL){
            console.warn(`${imgName} 未在images文件夹中找到`)
        }
    }
    content = content.replace(imgRegExp, function(word, alt, name){
        return `![${alt}](${renameMap[name] || name})`;
    })
    fs.writeFileSync(md_path, content)
    console.log('== 写入文件成功 ==')
}

async function upload_md(){
    console.log('上传文件开始...')
    let sftp = new Client();
    await sftp.connect({
        host: config.server.host,
        port: '22',
        username: config.server.username,
        password: config.server.password
    })
    await sftp.put(md_path, remote_md_path)
    console.log('== 上传文件成功 ==')
    sftp.end();
}

modify_meta();
upload_replace_img().then(upload_md)
.catch(err => {
    console.log('error', err)
})

