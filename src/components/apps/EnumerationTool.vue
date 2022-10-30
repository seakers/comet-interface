<template>
    <v-card elevation="4" style="overflow-y: scroll">

        <v-app-bar class="primary white--text" elevation="0" dense>
            <v-toolbar-title>Enumeration Tool</v-toolbar-title>
            <v-spacer></v-spacer>
            <!--            <v-img :src="lockheed_icon" max-width="170" style="margin-right: 10px;"></v-img>-->
            <v-menu>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" dark v-bind="attrs" v-on="on">
                        <v-icon dark>
                            mdi-cog
                        </v-icon>
                        <v-icon dark>
                            mdi-menu-down
                        </v-icon>
                    </v-btn>
                </template>
            </v-menu>
        </v-app-bar>


        <v-container>
            <v-row>
                <v-col cols="5">
                    <v-card height="300">
                        <v-tabs v-model="tab" grow>
                            <v-tab>Evaluation Space</v-tab>
                            <v-tab>Enumeration Space</v-tab>
                        </v-tabs>


                        <v-container>

                            <!--EVAL SPACE-->
                            <v-row justify="center" v-if="tab === 0">
                                <v-col cols="12">
                                    <v-radio-group v-model="curr_designs_selected" style="margin-top: 0;" row class="d-flex flex-row justify-center">
                                        <v-radio v-for="item in curr_page_designs" :key="item.id" :label="`D${item.id}`" :value="item.id" v-on:click="select_design(item)"></v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" style="padding-top: 0;">
                                    <div class="text-center">
                                        <v-pagination
                                            v-model="curr_designs_page"
                                            :length="parseInt(this.curr_designs.length / this.designs_per_page)+1"
                                            :total-visible="3"
                                        ></v-pagination>
                                    </div>
                                </v-col>
                            </v-row>


                            <!--ENUM SPACE-->
                            <v-row justify="center" v-if="tab === 1">
                                <v-col cols="12">
                                    <v-radio-group v-model="enum_designs_selected" style="margin-top: 0;" row>
                                        <v-radio v-for="item in enum_page_designs" :key="item.id" :label="`D${item.id}`" :value="item.id"></v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12">
                                    <div class="text-center">
                                        <v-pagination
                                            v-model="enum_designs_page"
                                            :length="parseInt(this.enum_designs.length / this.designs_per_page)+1"
                                            :total-visible="3"
                                        ></v-pagination>
                                    </div>
                                </v-col>
                            </v-row>


                        </v-container>
                    </v-card>
                </v-col>

                <v-col cols="7">
                    <v-card max-height="400" style="overflow-x: scroll; overflow-y: scroll;">
                        <v-card-title>Selected Design</v-card-title>
                        <v-card-subtitle>ID</v-card-subtitle>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-card-text>
                                        <v-container>
                                            <v-row v-for="(decision, idx) in decisions" :key="decision.name">
                                                <v-btn-toggle v-model="selected_design[idx]" mandatory>
                                                    <v-btn v-for="alternative in decision.alternatives" :key="alternative.value" small>{{alternative.value}}</v-btn>
                                                </v-btn-toggle>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
    import {mapState} from "vuex";
    import {ProblemDesignQuery} from "../../scripts/queries";
    import {ProblemDecisionsSub, ProblemDesignSubscription} from "../../scripts/subscriptions";
    import Vue from "vue";

    export default {
        name: "enumeration-tool",
        data: function () {
            return {
                tab: 0,
                decisions: [],

                // --> Designs State <--
                designs_per_page: 20,
                initialized: false,
                design_subscription: [],

                // --> Evaluation Space
                curr_designs: [],
                curr_designs_ids: [],
                curr_designs_reps: [],
                curr_designs_selected: [],
                curr_designs_page: 1,

                selected_design: {id:0, representation:''},

                // --> Enumeration Space
                enum_designs: [],
                enum_designs_selected: [],
                enum_designs_page: 1,
            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                user_info_id: state => state.user.user_info_id,
                problem_id: state => state.problem.problem_id,
                evaluation_queue: state => state.services.evaluation_queue,
                available_design_evaluators: state => state.services.available_design_evaluators
            }),
            curr_page_designs(){
                let start_idx = (this.curr_designs_page - 1) * this.designs_per_page;
                let end_idx = start_idx + this.designs_per_page;
                return this.curr_designs.slice(start_idx, end_idx);
            },
            enum_page_designs(){
                let start_idx = (this.enum_designs_page - 1) * this.designs_per_page;
                let end_idx = start_idx + this.designs_per_page;
                return this.enum_designs.slice(start_idx, end_idx);
            },
        },
        methods: {
            async initialize() {
                this.initialized = false;

                // --> 1. Reset state
                this.curr_designs = [];
                this.curr_designs_ids = [];
                this.curr_designs_reps = [];

                // --> 2. Get current designs
                let query = await this.$apollo.query({
                    deep: true,
                    fetchPolicy: 'no-cache',
                    query: ProblemDesignQuery,
                    variables: {
                        problem_id: this.problem_id,
                    }
                });
                let data = query.data;

                // --> 3. Set state
                let design_ids = [];
                let design_reps = [];
                for(let x = 0; x < data.design_query.length; x++){
                    let design = data.design_query[x];
                    design.selected = false;
                    let design_id = design.id;
                    design_ids.push(design_id);
                    design_reps.push(design.representation);
                }
                this.curr_designs_reps = design_reps;
                this.curr_designs_ids = design_ids;
                this.curr_designs = data.design_query;

                console.log('--> ENUM DESIGNS', this.curr_designs);

                this.initialized = true;
            },
            async enumerate_space() {

            },
            async select_design(design){
                console.log('--> SELECTED DESIGN', design);
                let selected_design = [];
                for(let x = 0; x < design.representation.length; x++){
                    selected_design.push(parseInt(design.representation.charAt(x)))
                }
                this.selected_design = selected_design;
            },
        },
        apollo: {
            $subscribe: {
                design_subscription: {
                    query: ProblemDesignSubscription,
                    variables() {
                        return {
                            problem_id: this.problem_id,
                            id_list: this.curr_designs_ids
                        }
                    },
                    result ({data}){
                        if(data.design_subscription.length === 0){
                            return;
                        }
                        this.initialized = false;


                        let designs = data.design_subscription;
                        for(let x = 0; x < designs.length; x++){
                            let design = designs[x];
                            design.selected = true;
                            this.curr_designs_ids.push(design.id);
                            this.curr_designs_reps.push(design.representation)
                            this.curr_designs.push(design);
                        }

                        this.initialized = true;
                    },
                    skip() {
                        return !this.initialized;
                    }
                },
                decisions: {
                    query: ProblemDecisionsSub,
                    variables() {
                        return {
                            problem_id: this.problem_id
                        }
                    },
                    result ({data}){
                        let local_design = [];
                        for(let x = 0; x < data.decisions.length; x++){
                            let decision = data.decisions[x];
                            local_design.push(0);
                        }
                        this.decisions = data.decisions;
                    },
                    skip() {
                        return this.problem_id === null;
                    }
                },
            }
        },
        watch: {
            async problem_id() {
                if(this.problem_id !== null){
                    await this.initialize();
                }
            }
        },
        async mounted() {
            if(this.problem_id !== null){
                await this.initialize();
            }
        }
    }
</script>

<style scoped>

</style>