const state = {

    // --> Services (ping results)
    serviceStatus: {
        'comet-evaluator': [],
        'comet-algorithm': []
    },
    requestId: null,
    pingId: null,
    requestResults: { 'comet-evaluator': [], 'comet-algorithm': [] },

    available_design_evaluators: 0,
    available_genetic_algorithms: 0,

    evaluation_queue: null
};


const getters = {
    getServiceStatus(state){
        return state.serviceStatus;
    },
    getPingId(state){
        return state.pingId;
    },
    getRequestId(state){
        return state.requestId;
    },
    getRequestResults(state){
        return state.requestResults;
    }
};

const actions = {
};


const mutations = {
    setServiceStatus(state, serviceStatus){
        state.serviceStatus = serviceStatus;
    },
    setPingId(state, pingId){
        state.pingId = pingId;
    },
    setRequestId(state, requestId){
        state.requestId = requestId;
    },
    setRequestResults(state, requestResults){
        state.requestResults = requestResults;
    },
    setAvailableDesignEvaluators(state, num){
        state.available_design_evaluators = num;
    },
    setAvailableGeneticAlgorithms(state, num){
        state.available_genetic_algorithms = num;
    },
    async setEvaluationQueue(state, evaluation_queue){
        state.evaluation_queue = evaluation_queue;
    }
};


export default {
    state,
    getters,
    actions,
    mutations
}

