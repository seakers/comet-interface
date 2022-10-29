import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';
import {convertDesign} from "../../scripts/design-helpers";

const state = {

    problem_id: null,
    design: [],
    design_clicked: [],
    design_hovered: [],
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
        state.design = convertDesign(design);
    },
    set_design_hovered(state, design){
        state.design_hovered = convertDesign(design);
    },
    set_design_clicked(state, design){
        state.design_clicked = convertDesign(design);
    },
};



export default {
    state,
    getters,
    actions,
    mutations
}