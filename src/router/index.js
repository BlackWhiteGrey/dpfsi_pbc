import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: (resolve) => require(['@/views/login/login'], resolve),
    },
    {
      path: '/nfcc',
      name: 'NFCC',
      component: (resolve) => require(['@/views/nfcc/nfcc'], resolve),
    },
    {
      path: '/standard',
      name: 'standard',
      component: (resolve) => require(['@/views/nfcc/standard'], resolve),
    },
    {
      path: '/complete',
      name: 'complete',
      component: (resolve) =>
        require(['@/views/common/complete/complete'], resolve),
    },
    {
      path: '/view/:nid',
      name: 'View',
      component: (resolve) => require(['@/views/view/view'], resolve),
    },
    {
      path: '/preview/:nid',
      name: 'preview',
      component: (resolve) => require(['@/views/view/preview'], resolve),
    },
    {
      path: '/view/:nid/:uid',
      name: 'Admin View',
      component: (resolve) => require(['@/views/view/view'], resolve),
    },
    {
      path: '/platform',
      name: 'Platform Layout',
      component: (resolve) => require(['@/views/layout/layout'], resolve),
      redirect: '/platform/index',
      children: [
        {
          path: 'index',
          name: 'Statics Index',
          component: (resolve) => require(['@/views/index/index'], resolve),
          meta: { requiresAuth: true },
        },
        {
          path: 'list',
          name: 'Naire List',
          component: (resolve) => require(['@/views/list/list'], resolve),
          meta: { requiresAuth: true },
        },
        {
          path: 'edit',
          name: 'Edit Question',
          component: (resolve) => require(['@/views/edit/edit'], resolve),
          meta: { requiresAuth: true },
        },
        {
          path: 'edit/:id',
          name: 'Edit Detail',
          component: (resolve) => require(['@/views/edit/update'], resolve),
          meta: { requiresAuth: true },
        },
        {
          path: 'user',
          component: (resolve) => require(['@/views/user/user'], resolve),
          meta: { requiresAuth: true },
        },
        {
          path: 'admin',
          component: (resolve) => require(['@/views/admin/changepwd'], resolve),
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '/404',
      name: '404页面',
      component: (resolve) => require(['@/views/common/error/error'], resolve),
    },
    {
      path: '*',
      name: '未找到页面',
      redirect: '/404',
    },
  ],
});

// JWT 用户权限校验，判断 TOKEN 是否在 localStorage 当中
// 对象解构，等于 {name} === to.name
router.beforeEach((to, from, next) => {
  // 获取 JWT Token
  if (to.meta.requiresAuth) {
    // 判断该路由是否需要登录权限
    if (localStorage.getItem('JWT_TOKEN')) {
      // 通过获取当前的token是否存在
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
        // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  } else {
    next();
  }
});

export default router;
