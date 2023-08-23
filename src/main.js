import { createApp } from 'vue';
import ViewUIPlus from 'view-ui-plus';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles/index.less';
// import './mock'
import axios from 'axios';
// import IEcharts from 'vue-echarts-v3/src/full.vue';
import myConfig from './config';

axios.defaults.baseURL = myConfig.APIBaseURL;

// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    if (localStorage.JWT_TOKEN) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = `token ${localStorage.JWT_TOKEN}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  (response) => {
    if (response.data.err === 1) {
      store.commit('LOG_OUT');
      router.replace({
        path: '/login',
        query: { redirect: router.currentRoute.fullPath },
      });
      Vue.prototype.$Message.warning('登录超时，请重新登录！');
    }
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          store.commit('LOG_OUT');
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath },
          });
          Vue.prototype.$Message.error('非法访问，请重试！');
      }
    }
    return Promise.reject(error.response.data); // 返回接口返回的错误信息
  }
);

const app = createApp(App);
app.config.globalProperties.$http = axios;
app.config.productionTip = false;

app.use(router).use(store).use(ViewUIPlus).mount('#app');

export default app;
