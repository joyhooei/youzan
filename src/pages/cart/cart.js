import './cart.css';
import './cart_base.css';
import './cart_trade.css';

import Vue from 'vue';
import url from 'js/api.js';
import axios from 'axios';
import mixin from 'js/mixin.js';
import qs from 'qs';

new Vue({
  el: '.container',
  data: {
    lists: null
  },
  computed: {},
  created() {
    this.getList();
  },
  methods: {
    getList() {
      axios.post(url.cartLists).then(res => {
        this.lists = res.data.cartList;
      });
    }
  },
  mixins: [mixin]
});
