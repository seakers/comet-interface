import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import {wsTools} from "../../scripts/websocket-tools";

const state = {

    // --> User Info <--
    user_id: null,
    user_info_id: null,
    username: '',
    email: '',

    // --> Problem Info <--
    problem_id: null,


    // --> Navigation Drawer State <--
    drawer: true,
    drawer_store: null,


    // --> Chatbox Drawer State <--
    chatbox: false,
    new_messages: 0,


    // --> Login Module State <--
    login_overlay: false,
    register_overlay: false,
};

const getters = {

};

const actions = {
    async initialize({ state, commit }){
        console.log('--> SETTING USER INFO');

        // --> 1. Check to see if user is logged in
        let dataResponse     = await fetchGet(API_URL + 'auth/check-status');
        let auth_information = await dataResponse.json();

        if(auth_information.is_logged_in){
            await wsTools.wsReconnect();

            // --> 2. If logged in, get: username, email, pk
            await commit('set_user_id', auth_information.pk);
            await commit('set_user_info_id', auth_information.user_info_pk);
            await commit('set_user_username', auth_information.username);
            await commit('set_user_email', auth_information.email);
            await commit('set_problem_id', auth_information.problem_id);
            await commit('setEvaluationQueue', auth_information.evaluation_queue);


            await commit('set_login_overlay', false);
            await commit('set_register_overlay', false);
        }
        else{
            // --> 3. If not logged in, open login overlay
            await commit('set_login_overlay', true);
            await commit('set_register_overlay', false);
        }
    },
};

const mutations = {
    async set_user_id(state, user_id){
        state.user_id = user_id;
    },
    async set_user_info_id(state, user_id){
        state.user_info_id = user_id;
    },
    async set_user_username(state, username){
        state.username = username;
    },
    async set_user_email(state, email){
        state.email = email;
    },



    async set_new_messages(state, new_messages){
        state.new_messages = new_messages;
    },
    async add_new_messages(state, new_messages){
        state.new_messages += new_messages;
    },


    set_drawer_value(state, drawer){
        state.drawer = drawer;
    },
    set_chatbox_value(state, chatbox){
        if(chatbox === true){
            state.new_messages = 0;
        }
        state.chatbox = chatbox;
    },


    async set_login_overlay(state, login_overlay){
        state.login_overlay = login_overlay;
    },
    async set_register_overlay(state, register_overlay){
        state.register_overlay = register_overlay;
    },

};

export default {
    state,
    getters,
    actions,
    mutations
}
