import './search.css';
import '../../modules/css/common.css';

import Vue from 'vue';
import axios from 'axios';
import url from 'js/api.js';
import qs from 'qs';
import mixin from 'js/mixin.js';
import Velocity from 'velocity-animate';
let { keyword, id } = qs.parse(location.search.substr(1));

new Vue({
  el: '.container',
  data: {
    searchList: null,
    keyword,
    isShow: false
  },
  created() {
    this.getSearchList();
  },
  methods: {
    getSearchList() {
      axios.post(url.searchList, { keyword, id }).then(res => {
        this.searchList = res.data.lists;
      });
    },
    move() {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > 100) {
            this.isShow = true;
        } else {
            this.isShow = false;
        }
    },
    toTop() {
        Velocity(document.body,'scroll',{
            duration: 1000
        });
    }
  },
  mixins: [mixin]
});
