import Vue from 'vue'

import Router from 'vue-router';
import Index from '../views/Index.vue';
import Article from '../views/Article.vue';
Vue.use(Router)

export function createRouter(){
  return new Router({
    mode: 'history',
    // scrollBehavior (to, from, savedPosition) {
    //   return savedPosition || {
    //     x: 0,
    //     y: 0
    //   }
    // },
    routes: [
      {
        path: '/',
        alias: '/index',
        name: 'index',
        component: Index,
      },
      {
        path: '/e/:id',
        name: 'article',
        component: Article,
      },
      {     //默认路由
        path: '*',
        redirect: '/'
      },
    ],
  });
};
