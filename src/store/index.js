import { createStore } from 'vuex';

import * as actions from './actions';
import * as getters from './getters';
import mutations from './mutations';

const debug = process.env.NODE_ENV !== 'production';

export default createStore({
  // 将各组件分别模块化存入 Store
  state: {
    naire: {},
    isAdmin: false,
    status: 'create', // create or update
  },
  actions,
  getters,
  mutations,
  strict: debug,
});
