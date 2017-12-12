import Vue from 'vue'
import Vuex from 'vuex'

import mine from './modules/mine';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    mine
  }
});
