import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';

const state = {

    dataset_metrics: null,





};


const getters = {

};


const actions = {
    async calculateMetrics({ state, commit }, design_set){
        let metrics = {}

        for(let x = 0; x < design_set.length; x++){
            let design = design_set[x];
            for(let y = 0; y < design.objectives.length; y++){
                let objective = design.objectives[y];
                let objective_id = objective.objective_id;
                if(!(objective_id in metrics)){
                    metrics[objective_id] = [];
                }
                metrics[objective_id].push(objective.value);
            }
        }

        let extended_metrics = {}
        for (let objective_id of Object.keys(metrics)) {
            let dataset = metrics[objective_id];
            let objective_metrics = {
                'max': Math.max.apply(null, dataset),
                'min': Math.min.apply(null, dataset),
                'avg': (dataset => dataset.reduce((a, b) => a + b)) / dataset.length
            }
            extended_metrics[objective_id] = objective_metrics;
        }
        await commit('setDatasetMetrics', extended_metrics);
    }
};


const mutations = {

    async setDatasetMetrics(state, dataset_metrics){
        console.log('--> NEW DATASET METRICS', dataset_metrics);
        state.dataset_metrics = dataset_metrics;
    }


};



export default {
    state,
    getters,
    actions,
    mutations
}