import './cart.css';
import './cart_base.css';
import './cart_trade.css';

import Vue from 'vue';
import url from 'js/api.js';
import axios from 'axios';
import mixin from 'js/mixin.js';
import qs from 'qs';
import Velocity from 'velocity-animate';
import Cart from 'js/cartService.js';

new Vue({
  el: '.container',
  data: {
    lists: null,
    total: 0,
    editingShop: null,
    editingShopIndex: -1
  },
  computed: {
    allSelected: {
      get() {
        if (this.lists && this.lists.length) {
          return this.lists.every(shop => {
            return shop.checked;
          });
        }
        return false;
      },
      set(newValue) {
        this.lists.forEach(shop => {
          shop.checked = newValue;
          shop.goodsList.forEach(good => {
            good.checked = newValue;
          });
        });
      }
    },
    allRemoveSelected: {
      get() {
        if (this.editingShop) {
          return this.editingShop.removeChecked;
        }
        return false;
      },
      set(newVal) {
        if (this.editingShop) {
          this.editingShop.removeChecked = newVal;
          this.editingShop.goodsList.forEach(good => {
            good.removeChecked = newVal;
          });
        }
      }
    },
    selectLists() {
      if (this.lists && this.lists.length) {
        let arr = [],
          total = 0;
        this.lists.forEach(shop => {
          shop.goodsList.forEach(good => {
            if (good.checked) {
              arr.push(good);
              total += good.price * good.number;
            }
          });
        });
        this.total = total;
        return arr;
      }
      return [];
    },
    removeLists() {
      if (this.editingShop) {
        let arr = [];
        this.editingShop.goodsList.forEach(good => {
          if (good.removeChecked) {
            arr.push(good);
          }
        });
        return arr;
      }
      return [];
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      axios.post(url.cartLists).then(res => {
        let lists = res.data.cartList;
        lists.forEach(shop => {
          shop.checked = true;
          shop.removeChecked = false;
          shop.editing = false;
          shop.editingMsg = '编辑';
          shop.goodsList.forEach(good => {
            good.checked = true;
            good.removeChecked = false;
          });
        });
        this.lists = lists;
      });
    },
    selectGood(shop, good) {
      let attr = this.editingShop ? 'removeChecked' : 'checked';
      good[attr] = !good[attr];
      shop[attr] = shop.goodsList.every(good => {
        return good[attr];
      });
    },
    selectShop(shop) {
      let attr = this.editingShop ? 'removeChecked' : 'checked';
      shop[attr] = !shop[attr];
      shop.goodsList.forEach(good => {
        good[attr] = shop[attr];
      });
    },
    selectAll() {
      let attr = this.editingShop ? 'allRemoveSelected' : 'allSelected';
      this[attr] = !this[attr];
    },
    edit(shop, shopIndex) {
      shop.editing = !shop.editing;
      shop.editingMsg = shop.editing ? '完成' : '编辑';
      this.lists.forEach((item, i) => {
        if (shopIndex !== i) {
          item.editing = false;
          item.editingMsg = shop.editing ? '' : '完成';
        }
      });
      this.editingShop = shop.editing ? shop : null;
      this.editingShopIndex = shop.editing ? shopIndex : -1;
    },
    reduce(good) {
      if (good.number === 1) return;
      Cart.reduce(good.id).then(res => {
        good.number--;
      });
    },
    add(good) {
      Cart.add(good.id).then(res => {
        good.number++;
      });
    },
    remove(shop, shopIndex, good, goodIndex) {
      let ids = [];
      this.removeLists.forEach(good => {
        ids.push(good.id);
      });
      axios
        .post(url.cartRemove, {
          id: ids
        })
        .then(res => {
          let arr = [];
          if (this.editingShop) {
            this.editingShop.goodsList.forEach(good => {
              let index = this.removeLists.findIndex(item => {
                return item.id === good.id;
              });
              if (index === -1) {
                arr.push(good);
              }
            });
          }
          if (arr.length) {
            this.editingShop.goodsList = arr;
          } else {
            this.lists.splice(this.editingShopIndex, 1);
            this.removeShop();
          }
        });
    },
    removeShop() {
      this.editingShop = null;
      this.editingShopIndex = -1;
      this.lists.forEach(shop => {
        shop.editing = false;
        shop.editingMsg = '编辑';
      });
    },
    start(e, good) {
      good.startX = e.changedTouches[0].clientX;
    },
    end(e, shopIndex, good, goodIndex) {
      let endX = e.changedTouches[0].clientX;
      let left = '0';
      if (good.startX - endX > 100) {
        left = '-60px';
      }
      if (endX - good.startX > 100) {
        left = '0px';
      }
      Velocity(this.$refs[`goods-${shopIndex}-${goodIndex}`], {
        left
      });
    }
  },
  mixins: [mixin]
});
