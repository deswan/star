import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api';
Vue.use(Vuex)

export function createStore(){
  return new Vuex.Store({
    strict: true,
    state: {
        allArticles:{},
        article:{
            document: '',
        }
    },
    mutations: {
        SET_ARTICLE(state, article){
            state.article = article;
        },
        SET_ALL_ARTICLES(state, allArticles){
            state.allArticles = allArticles;
        }
    },
    actions: {
        FETCH_ARTICLE({ commit }, { id }){
            console.log(id)
            return api.get(`/api/article`, {
                params: { id }
            }).then(res=>{
                commit('SET_ARTICLE', res.data);
            })
        },
        FETCH_ALL_ARTICLES({ commit }, { page }){
            return api.get(`/api/articles`, {
                params: { page }
            }).then(res=>{
                commit('SET_ALL_ARTICLES', res.data);
            })
        }
    },
  });
};
