import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/', component: () => import('pages/overview.vue'), redirect: 'overview'
      },
      {
        path: 'overview', component: () => import('pages/overview.vue'),
        meta: { desc: '基础信息' }
      },
      {
        path: 'rules', component: () => import('pages/rules.vue'),
        meta: { desc: 'RULES' }
      },
      {
        path: 'rewrite', component: () => import('pages/rewrite.vue'),
        meta: { desc: 'REWRITE' }
      },
      {
        path: 'jsmanage', component: () => import('pages/jsmanage.vue'),
        meta: { desc: 'JSMANAGE' }
      },
      {
        path: 'task', component: () => import('pages/task.vue'),
        meta: { desc: 'TASK' }
      }

      ,
      {
        path: 'mitm', component: () => import('pages/mitm.vue'),
        meta: { desc: 'MITM' }
      },
      {
        path: 'cfilter', component: () => import('pages/cfilter.vue'),
        meta: { desc: 'CFILTER' }
      },
      {
        path: 'setting', component: () => import('pages/setting.vue'),
        meta: { desc: 'SETTING' }
      },
      {
        path: 'about', component: () => import('pages/about.vue'),
        meta: { desc: 'ABOUT' }
      },
      {
        path: 'donation', component: () => import('pages/donation.vue'),
        meta: { desc: 'DONATION' }
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
