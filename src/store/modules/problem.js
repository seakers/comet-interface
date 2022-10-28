import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';

const state = {

    problem_id: null,
    design: [],
};


const getters = {

};


const actions = {


};


const mutations = {
    async set_problem_id(state, problem_id){
        state.problem_id = problem_id;
    },
    set_design(state, design){
        state.design = design;
    },
};



export default {
    state,
    getters,
    actions,
    mutations
}