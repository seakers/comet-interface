import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";

const state = {

    // --> User Info <--
    user_id: null,
    username: 'gapaza',
    email: 'gapaza@tamu.edu',


    // --> Navigation Drawer State <--
    drawer: true,
    drawer_store: null,


    // --> Chatbox Drawer State <--
    chatbox: false,
    chatbox_store: null,
    new_messages: 0,


    // --> Login Module State <--
    login_overlay: false,
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
            // --> 2. If logged in, get: username, email, pk
            await commit('set_user_id', auth_information.pk);
            await commit('set_user_username', auth_information.username);
            await commit('set_user_email', auth_information.email);
            await commit('set_login_overlay', false);
        }
        else{
            // --> 3. If not logged in, open login overlay
            await commit('set_login_overlay', true);
        }
    },
};

const mutations = {
    async set_user_id(state, user_id){
        state.user_id = user_id;
    },
    async set_user_username(state, username){
        state.username = username;
    },
    async set_user_email(state, email){
        state.email = email
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


};

export default {
    state,
    getters,
    actions,
    mutations
}
