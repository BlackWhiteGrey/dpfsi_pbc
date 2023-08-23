// 引入 api 接口
import * as types from './mutation-types';

export default {
  [types.REQUEST_QUESTION_LIST](state, action) {
    // 获取mock数据
    let data = JSON.stringify(action.naire);
    state.naire = JSON.parse(data);
  },
  [types.CREATE_NEW_NAIRE](state, data) {
    // state.naire = data.naire
    state.naire = { ...state.naire, ...data.naire };
  },
  [types.EDIT_NAIRE](state, data) {
    // state.naire = data.naire
    state.naire = { ...state.naire, ...data.naire };
  },
  [types.SAVE_NEW_NAIRE](state, data) {
    // state.naire = action.naire
    state.naire = { ...state.naire, ...data.naire };
  },
  [types.ADD_NEW_QUESTION](state, action) {
    state.naire.topic.push(action.topic);
  },
  [types.DEL_QUESTION](state, index) {
    state.naire.topic.splice(index, 1);
  },
  [types.CLEAR_QUESTION](state) {
    state.naire.topic = [];
  },
  [types.DEL_OPTION](state, data) {
    state.naire.topic[data.index].options.splice(data.opIndex, 1);
  },
  [types.CHANGE_STATUS](state, data) {
    state.status = data;
  },
  [types.CHANGE_NAIRE_STATUS](state, data) {
    state.naire.status = data;
  },
  [types.UPDATE_TITLE](state, data) {
    // state.title = data
    state.naire = { ...state.naire, title: data };
  },
  [types.UPDATE_INTRO](state, data) {
    // state.intro = data
    state.naire = { ...state.naire, intro: data };
  },
  [types.UPDATE_RATIO](state, data) {
    // state.intro = data
    state.naire = { ...state.naire, ratio: data };
  },
  [types.UPDATE_UPLOADFILE](state, data) {
    // state.intro = data
    state.naire = { ...state.naire, uploadfile: data };
  },
  [types.UPDATE_ATTACH](state, data) {
    // state.intro = data
    state.naire = { ...state.naire, attach: data };
  },
  [types.UPDATE_DESCRIPTION](state, data) {
    state.naire.topic[data.index].description = data.description;
  },
  [types.UPDATE_DEADLINE](state, data) {
    // state.deadline = data
    state.naire = { ...state.naire, deadline: data };
  },
  [types.UPDATE_CATEGORIES](state, data) {
    // state.categories = data
    state.naire = { ...state.naire, categories: data };
  },
  [types.UPDATE_AREAS](state, data) {
    // state.areas = data
    state.naire = { ...state.naire, areas: data };
  },
  [types.UPDATE_NTYPE](state, data) {
    // state.ntype = data
    state.naire = { ...state.naire, ntype: data };
  },
  [types.USER_LOGIN](state, data) {
    state.isAdmin = true;
    localStorage.setItem('isAdmin', true);
    localStorage.setItem('USER', JSON.stringify(data.user));
    localStorage.setItem('JWT_TOKEN', data.token);
  },
  [types.LOG_OUT](state) {
    state.isAdmin = false;
    localStorage.clear();
  },
};
