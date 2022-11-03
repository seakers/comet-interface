import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import controls from './modules/controls'
import problem from './modules/problem'
import services from "./modules/services";
import dataset from "./modules/dataset";

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
        async onWebsocketsMessage({ commit, state, getters, dispatch }, message) {
            let received_info = JSON.parse(message.data);
            console.log('--> WEBSOCKET MESSAGE', received_info);

            // ------------
            // --- PING ---
            // ------------
            if (received_info['type'] === 'ping') {
                if('status' in received_info){
                    console.log("Service Ping back!", received_info);
                    commit('setServiceStatus', received_info['status']);
                    if('ping_id' in received_info){
                        commit('setPingId', received_info['ping_id']);
                    }
                }
                else{
                    console.log("Ping back!", received_info);
                }
            }

            // -----------------------
            // --- SERVICE MESSAGE ---
            // -----------------------
            if (received_info['type'] === 'resource_msg_response') {
                console.log("Resource Response!", received_info);
                commit('setRequestResults', received_info['results']);
                commit('setRequestId', received_info['request_id']);
            }



        }
    },
    modules: {
        user,
        controls,
        problem,
        services,
        dataset
    },
    strict: debug
});