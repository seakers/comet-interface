import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';
import {convertDesignToList} from "../../scripts/design-helpers";

const state = {

    // --> Problem Info <--
    problem_id: null,

    // --> Dataset Info <--
    dataset_id: null,



    design: [],
    design_clicked: [],
    design_hovered: [],


    store_designs: [],
    store_design_clicked: null,
    store_design_hovered: null,

    design_clicked_eval_request: null,
    design_hovered_eval_request: null,
};


const getters = {

};


const actions = {


};


const mutations = {
    async set_problem_id(state, problem_id){
        state.problem_id = problem_id;
    },
    async set_dataset_id(state, dataset_id){
        state.dataset_id = dataset_id;
    },
    set_design(state, design){
        state.design = convertDesignToList(design);
    },



    async set_store_designs(state, store_designs){
        state.store_designs = store_designs;
    },
    async set_store_design_clicked(state, store_design_clicked){
        state.store_design_clicked = store_design_clicked;
    },
    async set_store_design_hovered(state, store_design_hovered){
        state.store_design_hovered = store_design_hovered;
    },


    setDesignClickedEvalRequest(state, design_clicked_eval_request){
        state.design_clicked_eval_request = design_clicked_eval_request;
    },
    setDesignHoveredEvalRequest(state, design_hovered_eval_request){
        state.design_hovered_eval_request = design_hovered_eval_request;
    },
};



export default {
    state,
    getters,
    actions,
    mutations
}