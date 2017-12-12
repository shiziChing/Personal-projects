import api from './../../fetch/api';
import * as types from './../types.js';

const state = {
  getMineBaseMsg: {
    errno: 1,
    msg: {}
  },
  count: 0
}

const actions = {
  getMineBaseApi({commit},info) {

    // api.mineBaseMsgApi()
    // .then(res => {
    //     alert('action中调用封装后的axios成功');
    //     console.log(res)
    //     commit(types.GET_BASE_API, res)
    // })
    commit(types.GET_BASE_API, info)
  },
  increase({commit}, val) {
    commit(types.GET_COUNT,val)
  },
  decrease({commit}, val) {
    commit(types.GET_COUNT, val)
  },
  selectval({commit}, val) {
    commit(types.GET_COUNT, val)
  },
}

const getters = {
  getMineBaseMsg: state => state.getMineBaseMsg,
  count: state => state.count
}

const mutations = {
  [types.GET_BASE_API](state, res) {
    alert('进入mutation');
    console.log(state)
    console.log(res)
    state.getMineBaseMsg = {getMineBaseMsg: res.data, msg: res.msg }
    alert('进入mutations修改state成功');
  },
  [types.GET_COUNT](state,val){
    console.log(val)
    if(val=="add"){
      state.count++;
    }else if(val=="acc"){
      state.count--;
    }else{
      state.count = val;
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
