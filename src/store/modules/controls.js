import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';

const state = {

    nav_bar_apps: [
        {name: 'Visualizer', icon: 'mdi-chart-scatter-plot', component: 'visualizer', cols: 12, active: true},
        {name: 'Design Builder', icon: 'mdi-wrench', component: 'design-builder', cols: 12, active: false},
        {name: 'Data Mining', icon: 'mdi-pickaxe', component: 'data-mining', cols: 6, active: false},
        {name: 'Enumeration Tool', icon: 'mdi-basket-fill', component: 'enumeration-tool', cols: 12, active: false},
        {name: 'Algorithms', icon: 'mdi-function-variant', component: 'algorithms', cols: 12, active: true}
    ]



};


const getters = {

};


const actions = {



};


const mutations = {

    async toggle_app(state, app_name){
        for(let x = 0; x < state.nav_bar_apps.length; x++){
            let app = state.nav_bar_apps[x];
            if(app.name === app_name){
                let set_value = !app.active;
                Vue.set(state.nav_bar_apps[x], 'active', set_value);
            }
        }
    }
};



export default {
    state,
    getters,
    actions,
    mutations
}