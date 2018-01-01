let url = {
    hostLists: '/index/hotLists'
}

//开发环境与真实环境的切换
let host = 'http://rap.taobao.org/mockjsdata/23334'

for (let key in url) {
    if (url.hasOwnProperty(key)) {
        url[key] = host + url[key]
    }
}

export default url