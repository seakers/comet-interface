import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';
import {convertDesignToList} from "../../scripts/design-helpers";
import {id} from "html-webpack-plugin/lib/chunksorter";

const state = {

    // --> Problem Info <--
    problem_id: null,

    // --> Dataset Info <--
    dataset_id: null,

    // --> Feature Info <--
    features: [],
    selected_feature: null,
    feature_itemsets: null,



    design: [],
    design_clicked: [],
    design_hovered: [],


    store_designs: [],
    store_design_clicked: null,
    store_design_hovered: null,
    store_design_selected: [],

    design_clicked_eval_request: null,
    design_hovered_eval_request: null,
};


const getters = {

};


const actions = {

    async mineFeatures({ state, commit }){
        console.log('--> MINING FEATURES FROM SELECTED DESIGNS', state.store_design_selected);

        let id_vector = [];
        for(let x=0; x < state.store_design_selected.length; x++){
            id_vector.push(state.store_design_selected[x].id);
        }
        console.log(id_vector);


        let request_data = new FormData();
        request_data.append('arch_ids', JSON.stringify(id_vector));
        let data_response = await fetchPost(API_URL + 'problem/run-data-mining', request_data);
        if (data_response.ok) {
            let data = await data_response.json();
            if(Object.hasOwn(data, 'rules')) {
                let rules = JSON.parse(data['rules']);
                let itemsets = JSON.parse(data['itemsets']);
                await commit('set_features', rules);
                await commit('set_feature_itemsets', itemsets);
                console.log('--> FEATURE DATA:', rules, itemsets);
            }
        }
    }



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
    async set_features(state, features){
        state.features = features;
    },
    async set_feature_itemsets(state, feature_itemsets){
        state.feature_itemsets = feature_itemsets;
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
    async set_store_design_selected(state, store_design_selected){
        state.store_design_selected = store_design_selected;
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