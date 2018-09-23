module.exports = {
    filterFields(list, fields){
        return list.map(item => {
            return fields.reduce((target, field) => {
                target[field] = item[field]
            }, {})
        })
    }
}