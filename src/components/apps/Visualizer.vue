<template>
    <v-card elevation="4">

        <v-app-bar class="primary white--text" elevation="0" dense>
            <v-toolbar-title>Visualizer</v-toolbar-title>
            <v-spacer></v-spacer>
            <!--            <v-img :src="lockheed_icon" max-width="170" style="margin-right: 10px;"></v-img>-->
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" dark v-bind="attrs" v-on="on">
                        {{visualization_type}}
                        <v-icon dark>
                            mdi-menu-down
                        </v-icon>

                    </v-btn>
                </template>
                <v-list>
                    <v-list-item-group v-model="visualization_type">
                        <v-list-item v-for="vis_type in visualization_types" :value="vis_type" :key="vis_type">
                            <v-list-item-title>{{ vis_type }}</v-list-item-title>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-menu>
        </v-app-bar>


        <v-container>
            <v-row>

                <!--CONTROL PANEL-->
                <v-col cols="4">
                    <v-card height="450" v-if="visualization_type === 'Design Space'">
                        <v-card-title>Design Space Plot</v-card-title>
                        <v-card-subtitle>Designs: {{plot_designs.length}}</v-card-subtitle>
                        <v-container>
                            <v-row style="padding-bottom: 7px;">
                                <v-col style="margin-bottom: -25px;">
                                    <div style="font-weight: bold;">Objectives</div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-combobox
                                        :items="this.problem_subscription.objectives"
                                        v-model="selected_objectives"
                                        label="Objectives"
                                        item-text="name"
                                        item-value="id"
                                        solo
                                        multiple
                                        small-chips
                                    ></v-combobox>
                                </v-col>
                            </v-row>
<!--                            <v-row style="padding-bottom: 7px;">-->
<!--                                <v-col style="margin-bottom: -20px;">-->
<!--                                    <div style="font-weight: bold;">Axis</div>-->
<!--                                </v-col>-->
<!--                            </v-row>-->
<!--                            <v-row>-->
<!--                                <v-col cols="12" style="padding-bottom: 0px;">-->
<!--                                    <v-select-->
<!--                                        :items="this.selected_objectives"-->
<!--                                        v-model="objective_axis[0]"-->
<!--                                        label="X Axis"-->
<!--                                        item-text="name"-->
<!--                                        item-value="id"-->
<!--                                        outlined-->
<!--                                        dense-->
<!--                                    ></v-select>-->
<!--                                </v-col>-->
<!--                                <v-col v-if="this.selected_objectives.length > 1" cols="12"  style="padding-bottom: 0; padding-top: 0; margin-top: -10px;">-->
<!--                                    <v-select-->
<!--                                        :items="this.selected_objectives"-->
<!--                                        v-model="objective_axis[1]"-->
<!--                                        label="Y Axis"-->
<!--                                        item-text="name"-->
<!--                                        item-value="id"-->
<!--                                        outlined-->
<!--                                        dense-->
<!--                                    ></v-select>-->
<!--                                </v-col>-->
<!--                                <v-col v-if="this.selected_objectives.length > 2" cols="12" style="padding-bottom: 0; padding-top: 0; margin-top: -10px;">-->
<!--                                    <v-select-->
<!--                                        :items="this.selected_objectives"-->
<!--                                        v-model="objective_axis[2]"-->
<!--                                        label="Z Axis"-->
<!--                                        item-text="name"-->
<!--                                        item-value="id"-->
<!--                                        outlined-->
<!--                                        dense-->
<!--                                    ></v-select>-->
<!--                                </v-col>-->
<!--                            </v-row>-->
                        </v-container>
                    </v-card>


                    <v-card height="450" v-if="visualization_type === 'Coverage Map'">
                        <v-card-title>Coverage Map Plot</v-card-title>
                        <v-card-subtitle>Designs: {{plot_designs.length}}</v-card-subtitle>

                        <!--TYPE: Coverage Map-->
                        <v-container v-if="visualization_type === 'Coverage Map'">
                            <v-row>

                            </v-row>
                        </v-container>

                    </v-card>
                </v-col>


                <!--PLOT-->
                <v-col cols="8">
                    <v-card v-if="selected_objectives.length < 4">
                        <plotly :data="plot.data"
                                :layout="plot.layout"
                                :display-mode-bar="true"

                                v-on:click="select_datapoint"
                                v-on:hover="hover_datapoint"
                        ></plotly>
                    </v-card>
                </v-col>

            </v-row>
        </v-container>
    </v-card>
</template>

<script>
    import { mapState } from 'vuex';
    import {ProblemDesignSubscription, CurrentProblemInfoSub} from "../../scripts/subscriptions";
    import { get_scatter_plot } from "../../scripts/plots";
    import { Plotly } from 'vue-plotly'
    import * as _ from "lodash";
    import {ProblemDesignQuery} from "../../scripts/queries";
    import {convertDesignToList} from "../../scripts/design-helpers";

    export default {
        name: "visualizer",
        components: {
            Plotly
        },
        data: function () {
            return {

                // --> VIZ Types
                visualization_types: [
                    'Design Space',
                    'Coverage Map'
                ],
                visualization_type: 'Design Space',

                // --> VIS: Coverage Map
                // --> VIS: Design Space
                selected_objectives: [],
                objective_axis: [0, 0, 0],


                // --> Problem State
                problem_subscription: {
                    objectives: []
                },

                // --> Designs
                initialized: false,
                design_subscription: [],

                plot_designs: [],
                plot_designs_ids: [],
            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                user_info_id: state => state.user.user_info_id,
                username: state => state.user.username,
                email: state => state.user.email,
                nav_bar_apps: state => state.controls.nav_bar_apps,
                problem_id: state => state.problem.problem_id,
                dataset_id: state => state.problem.dataset_id,
                design_clicked_eval_request: state => state.problem.design_clicked_eval_request,
                design_hovered_eval_request: state => state.problem.design_hovered_eval_request,
            }),
            plot() {

                // --> 1. Validate plot can be returned
                if(this.selected_objectives.length === 0){
                    return { data: [], layout: {} }
                }


                // --> 2. Return proper plot type
                let return_plot = get_scatter_plot(this.selected_objectives, this.plot_designs, this.objective_axis);
                console.log('--> PLOT', return_plot);
                return return_plot
            },
        },
        methods: {
            async initialize() {
                if(this.dataset_id === null || this.problem_id === null){
                    return;
                }

                this.initialized = false;

                // --> 1. Reset state
                this.plot_designs = [];
                this.plot_designs_ids = [];


                // --> 2. Get current designs
                let query = await this.$apollo.query({
                    deep: true,
                    fetchPolicy: 'no-cache',
                    query: ProblemDesignQuery,
                    variables: {
                        problem_id: this.problem_id,
                        dataset_id: this.dataset_id
                    }
                });
                let data = query.data;

                // --> 3. Set state
                let plot_designs = [];
                let plot_designs_ids = [];
                for(let x = 0; x < data.design_query.length; x++){
                    let design = _.cloneDeep(data.design_query[x]);
                    design.hovered = false;
                    design.clicked = false;
                    design.structure = convertDesignToList(design.representation);
                    plot_designs.push(design);
                    plot_designs_ids.push(design.id);
                }
                this.plot_designs = plot_designs;
                this.plot_designs_ids = plot_designs_ids;

                this.initialized = true;
            },
            select_datapoint(event){
                let points = event.points;
                if(points.length === 0){
                    return;
                }
                let point = points[0];

                this.highlight_clicked_designs([point.customdata.id]);
                this.$store.commit('set_store_design_clicked', _.cloneDeep(point.customdata));
            },
            hover_datapoint(event){
                let points = event.points;
                if(points.length === 0){
                    return;
                }
                let point = points[0];

                this.highlight_hovered_designs([point.customdata.id]);
                this.$store.commit('set_store_design_hovered', _.cloneDeep(point.customdata));
            },
            highlight_hovered_designs(design_ids){
                for(let x = 0; x < this.plot_designs.length; x++){
                    let design = this.plot_designs[x];
                    if(design_ids.includes(design.id)){
                        design.hovered = true;
                    }
                    else{
                        design.hovered = false;
                    }
                }
            },
            highlight_clicked_designs(design_ids){
                for(let x = 0; x < this.plot_designs.length; x++){
                    let design = this.plot_designs[x];
                    if(design_ids.includes(design.id)){
                        design.clicked = true;
                    }
                    else{
                        design.clicked = false;
                    }
                }
            },
            async clear_clicked(){
                let designs = _.cloneDeep(this.plot_designs);
                for(let x = 0; x < designs.length; x++){
                    designs[x].clicked = false;
                }
                this.plot_designs = designs;
            },
            async clear_hovered(){
                let designs = _.cloneDeep(this.plot_designs);
                for(let x = 0; x < designs.length; x++){
                    designs[x].hovered = false;
                }
                this.plot_designs = designs;
            }
        },
        apollo: {
            $subscribe: {
                problem_subscription: {
                    query: CurrentProblemInfoSub,
                    variables() {
                        return {
                            problem_id: this.problem_id
                        }
                    },
                    result ({data}){
                        this.problem_subscription = data.problem_subscription[0];
                        this.selected_objectives = [];
                        for(let x = 0; x < this.problem_subscription.objectives.length; x++){
                            let objective = this.problem_subscription.objectives[x];
                            if(objective.name === 'Lifecycle Cost' || objective.name === 'Weighted Design Score'){
                                this.selected_objectives.push(_.cloneDeep(objective));
                            }
                        }
                    },
                    skip() {
                        return this.problem_id === null;
                    }
                },
                design_subscription: {
                    query: ProblemDesignSubscription,
                    variables() {
                        return {
                            problem_id: this.problem_id,
                            dataset_id: this.dataset_id,
                            id_list: this.plot_designs_ids
                        }
                    },
                    async result ({data}){
                        if(data.design_subscription.length === 0){
                            return;
                        }
                        console.log('--> ', data.design_subscription.length, ' NEW DESIGNS');
                        this.initialized = false;

                        // --> Clear clicked designs
                        await this.clear_clicked();

                        let designs = data.design_subscription;
                        for(let x = 0; x < designs.length; x++){
                            let design = _.cloneDeep(designs[x]);
                            design.clicked = false;
                            design.hovered = false;
                            design.structure = convertDesignToList(design.representation);
                            if(x === (designs.length-1)){design.clicked = true;}
                            this.plot_designs.push(design);
                            this.plot_designs_ids.push(design.id);

                            if(this.design_clicked_eval_request === design.representation){
                                await this.$store.commit('set_store_design_clicked', _.cloneDeep(design));
                                this.$store.commit('setDesignClickedEvalRequest', null);
                            }
                            if(this.design_hovered_eval_request === design.representation){
                                await this.$store.commit('set_store_design_hovered', _.cloneDeep(design));
                                this.$store.commit('setDesignHoveredEvalRequest', null);
                            }
                        }

                        // --> Set clicked design in store
                        let last_design = designs[designs.length-1];
                        last_design.structure = convertDesignToList(last_design.representation);
                        last_design.clicked = true;
                        last_design.hovered = false;

                        this.initialized = true;
                    },
                    skip() {
                        return !this.initialized;
                    }
                }
            }
        },
        watch: {
            async problem_id() {
                await this.initialize();
            },
            async dataset_id() {
                await this.initialize();
            },
            async plot_designs(){
                await this.$store.dispatch('calculateMetrics', _.cloneDeep(this.plot_designs));
                await this.$store.commit('set_store_designs', _.cloneDeep(this.plot_designs));
            }
        },
        async mounted() {
            await this.initialize();
        }
    }
</script>



<style scoped>

</style>