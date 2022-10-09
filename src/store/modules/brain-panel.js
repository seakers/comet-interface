import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";

const state = {
    standard_error: 'err not set',
    standard_output: 'out not set',
    standard_display: ''
};

// const initialState = _.cloneDeep(state);

const getters = {};

const actions = {};

const mutations = {
    set_brain_standard_error(state, update){
        state.standard_error = update;
    },
    set_brain_standard_output(state, update){
        state.standard_output = update;
    },
    update_brain_standard_error(state, update){
        state.standard_error += update;
    },
    update_brain_standard_output(state, update){
        state.standard_output += update;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}