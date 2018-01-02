import 'css/common.css';
import './index.css';

import Vue from 'vue';
import axios from 'axios';
import url from 'js/api.js';
import { InfiniteScroll } from 'mint-ui';
Vue.use(InfiniteScroll);

import Foot from 'components/Foot.vue';
import Swipe from 'components/Swipe.vue';

let app = new Vue({
  el: '#app',
  data: {
    lists: null,
    pageNum: 1,
    pageSize: 6,
    loading: false, //可以加载
    allLoaded: false,
    bannerLists: null
  },
  created() {
    this.getLists()
    this.getBanner()
  },
  methods: {
    getLists() {
      if (this.allLoaded) return;
      //是否在加载中
      this.loading = true;
      axios.post(url.hostLists, {
          pageNum: this.pageNum,
          pageSize: 6
        })
        .then(res => {
          let currentList = res.data.lists
          //判断当前的长度是否小于页面的长度
          if (currentList.length < this.pageSize) this.allLoaded = true
          if (this.lists) {
            this.lists = this.lists.concat(currentList)
          } else {
            this.lists = currentList
          }
          this.loading = false
          this.pageNum++
        });
    },
    getBanner() {
        axios.get(url.banner).then(res => {
            this.bannerLists = res.data.lists
        })
    }
  },
  components: {
      Foot,
      Swipe
  }
});
