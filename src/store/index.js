import Vue from 'vue';
import Vuex from 'vuex';
import interfacePanel from './modules/interface-panel';
import brainPanel from './modules/brain-panel';
import vassarPanel from './modules/vassar-panel';
import dataminingPanel from './modules/datamining-panel';
import user from './modules/user';

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
        interfacePanel,
        brainPanel,
        vassarPanel,
        dataminingPanel,
        user
    },
    strict: debug
});