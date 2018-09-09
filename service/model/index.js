const fs = require('fs-extra');
const path = require('path');
const dayjs = require('dayjs');
const config = require('../config');
const {
    resolve
} = require('../../util');
const pool = require('./pool')();
const defaultOptions = {
    root: config.markdownDir
}

function getAllArticlesName() {
    return pool.getAllArticles();
}

function mapToList(map){
    return Object.keys(map).reduce((target, key) => {
        target.push({
            name: key,
            ...map[key]
        })
        return target;
    }, [])
}

module.exports = class Model {

    constructor(options) {
        this.options = { 
            ...defaultOptions,
            ...options
        };
    }

    async getArticles(args = {}) {
        let articles = mapToList(pool.getAllArticles());
        articles = this.sortMD(articles, args.sort)
        let {items, totalPage } = this.pagination(articles, args.page, args.pageSize)
        items = items.map(item => {
            return {
                name: item.name,
                title: item.meta.title,
                modified_date: dayjs(item.meta.modified_time).format('YYYY-MM-DD'),
            }
        })
        console.log(items)

        return {
            totalPage,
            items
        };
    }

    getArticleByName(name, args) {
        return pool.getArticle(name);
    }

    sortMD(mdList, expression = []){
        if(!expression.length) {
            throw new Error('排序参数不正确');
        };
        let field = expression[0] || 'create_time'
        let desc = (expression[1] || 'desc') === 'desc';

        return mdList.sort((mdObj_a, mdObj_b) => {
            let field_a = mdObj_a.meta[field];
            let field_b = mdObj_b.meta[field];
            if(field.endsWith('_time')){
                field_a = new Date(field_a).valueOf();
                field_b = new Date(field_b).valueOf();
            }
            if (desc) {
                return field_b - field_a;
            } else {
                return field_a - field_b;
            }
        })
    }

    pagination(list, page = 1, pageSize = 10){
        return {
            items: list.slice((page - 1) * pageSize, page * pageSize),
            totalPage: list.length ? parseInt((list.length - 1) / pageSize) + 1 : 1
        };
    }

    /**
     * 文件名数组 =》 文件对象数组
     * @param {Array<String>} mdList 文件名数组
     * @return {Array<{name, meta}>} 
     */
    async attachMeta(mdList){
        return await Promise.all(mdList.map(async name => {
            return {name, meta: md_meta.parse(await fs.readFile(path.resolve(this.options.root, name), 'utf-8'))};
        }))
    }

    /**
     * 数组中间件：删除name中的md后缀
     * @param {Array<{name}>} mdObjList 文件对象数组
     * @return {Array<{name}>}
     */
    removeExtension(mdObjList){
        return mdObjList.map(item => {
            let name = item.name;
            if (~name.indexOf('.md')) name = name.slice(0, name.indexOf('.md'));
            if (~name.indexOf('.markdown')) name = name.slice(0, name.indexOf('.markdown'));
            item.name = name;
            return item;
        })
    }
    
    /**
     * 过滤meta文本
     * @param {String} mdText markdown文本
     * @return {String} 
     */
    filterMeta(mdText){
        return mdText.replace(/<!--\*([\s\S]*)\*-->/,'')
    }
}