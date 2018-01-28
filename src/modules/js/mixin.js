import Foot from 'components/Foot.vue';

let mixin = {
  filters: {
    currency(price) {
      return /^\d{0,100}\.\d{1,10}$/.test(price) ? price.toFixed(2) : price + '.00';
    }
  },
  components: {
    Foot
  },
};

export default mixin;
