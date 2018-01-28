let url = {
  hostLists: '/index/hotLists',
  banner: '/index/banner',
  topLists: '/category/topList',
  subList: '/category/subList',
  rank: '/category/rank',
  searchList: '/search/list'
};

//开发环境与真实环境的切换
let host = 'http://rap.taobao.org/mockjsdata/24170';

for (let key in url) {
  if (url.hasOwnProperty(key)) {
    url[key] = host + url[key];
  }
}

export default url;
