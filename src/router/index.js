import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/login.vue'),
  },
  {
    path: '/nfcc',
    name: 'NFCC',
    component: () => import('@/views/nfcc/nfcc.vue'),
  },
  {
    path: '/standard',
    name: 'standard',
    component: () => import('@/views/nfcc/standard.vue'),
  },
  {
    path: '/complete',
    name: 'complete',
    component: () => import('@/views/common/complete/complete.vue'),
  },
  {
    path: '/view/:nid',
    name: 'View',
    component: () => import('@/views/view/view.vue'),
  },
  {
    path: '/preview/:nid',
    name: 'preview',
    component: () => import('@/views/view/preview.vue'),
  },
  {
    path: '/view/:nid/:uid',
    name: 'Admin View',
    component: () => import('@/views/view/view.vue'),
  },
  {
    path: '/platform',
    name: 'Platform Layout',
    component: () => import('@/views/layout/layout.vue'),
    redirect: '/platform/index',
    children: [
      {
        path: 'index',
        name: 'Statics Index',
        component: () => import('@/views/index/index.vue'),
        meta: { importsAuth: true },
      },
      {
        path: 'list',
        name: 'Naire List',
        component: () => import('@/views/list/list.vue'),
        meta: { importsAuth: true },
      },
      {
        path: 'edit',
        name: 'Edit Question',
        component: () => import('@/views/edit/edit.vue'),
        meta: { importsAuth: true },
      },
      {
        path: 'edit/:id',
        name: 'Edit Detail',
        component: () => import('@/views/edit/update.vue'),
        meta: { importsAuth: true },
      },
      {
        path: 'user',
        component: () => import('@/views/user/user.vue'),
        meta: { importsAuth: true },
      },
      {
        path: 'admin',
        component: () => import('@/views/admin/changepwd.vue'),
        meta: { importsAuth: true },
      },
    ],
  },
  {
    // 此处vue3更新需要使用catchall方法匹配,不然会出现错误:
    // Catch all routes ("*") must now be defined using a param with a custom regexp
    path: '/:catchAll(.*)',
    redirect: '/404',
  },
  {
    path: '/404',
    name: '404页面',
    component: () => import('@/views/common/error/error.vue'),
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 };
  },
});

// JWT 用户权限校验，判断 TOKEN 是否在 localStorage 当中
// 对象解构，等于 {name} === to.name
router.beforeEach((to, from, next) => {
  // 获取 JWT Token
  if (to.meta.importsAuth) {
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
