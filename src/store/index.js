import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import controls from './modules/controls'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';


export default new Vuex.Store({
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        user,
        controls
    },
    strict: debug
});