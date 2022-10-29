<template>
    <v-card elevation="4">
        <v-container>
            <v-row>




                <!--CONTROL PANEL-->
                <v-col cols="4">
                    <v-container>
                        <v-row>
                            <v-col cols="6">
                                <div style="font-size: 1.25rem; font-weight: 500; letter-spacing: .0125em;">Visualizer</div>
                            </v-col>
                            <v-col cols="6">
                                <v-combobox v-model="visualization_type" :items="visualization_types" label="Visualization Type" solo dense></v-combobox>
                            </v-col>
                        </v-row>
                        <v-divider style="padding: 10px;"></v-divider>


                        <!--TYPE: Design Space-->
                        <v-container v-if="visualization_type === 'Design Space'">
                            <v-row style="padding-bottom: 7px;">
                                <div>Objectives</div>
                            </v-row>
                            <v-row>
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
                            </v-row>
                        </v-container>


                        <!--TYPE: Coverage Map-->
                        <v-container v-if="visualization_type === 'Coverage Map'">
                            <v-row>

                            </v-row>
                        </v-container>
                    </v-container>
                </v-col>

                <v-divider vertical></v-divider>



                <!--PLOT-->
                <v-col cols="8">
                    <plotly :data="plot.data"
                            :layout="plot.layout"
                            :display-mode-bar="true"
                            v-on:click="select_datapoint"
                            v-on:hover="hover_datapoint"
                    ></plotly>
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

    export default {
        name: "visualizer",
        components: {
            Plotly
        },
        data: function () {
            return {
                visualization_types: [
                    'Design Space',
                    'Coverage Map'
                ],
                visualization_type: 'Design Space',


                selected_objectives: [],


                problem_subscription: {
                    objectives: []
                },



                // --> Designs State <--
                initialized: false,
                design_subscription: [],


                plot_designs: [],
                plot_designs_ids: [],
                plot_designs_customdata: [],
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
            }),
            plot() {

                // --> 1. Validate plot can be returned
                if(this.selected_objectives.length === 0){
                    return { data: [], layout: {} }
                }

                // --> 2. Return proper plot type
                let return_plot = get_scatter_plot(this.selected_objectives, this.plot_designs, this.plot_designs_customdata);
                console.log('--> PLOT', return_plot);
                return return_plot
            },
        },
        methods: {
            async initialize() {
                this.initialized = false;

                // --> 1. Reset state
                this.plot_designs = [];
                this.plot_designs_ids = [];
                this.plot_designs_customdata = [];

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
                let design_ids = []
                let design_customdata = [];
                for(let x = 0; x < data.design_query.length; x++){
                    let design_id = data.design_query[x].id;
                    design_ids.push(design_id);
                    design_customdata.push({id: design_id, hovered: false, clicked: false});
                }
                this.plot_designs_ids = design_ids;
                this.plot_designs_customdata = design_customdata;
                this.plot_designs = data.design_query;

                this.initialized = true;
            },
            select_datapoint(event){
                let points = event.points;
                if(points.length === 0){
                    return;
                }
                let point = points[0];
                let point_id = point.customdata.id;
                let point_chromosome = point.text;

                this.highlight_clicked_designs([point_id]);
                this.$store.commit('set_design', point_chromosome);
                this.$store.commit('set_design_clicked', point_chromosome);
            },
            hover_datapoint(event){
                let points = event.points;
                if(points.length === 0){
                    return;
                }
                let point = points[0];
                let point_id = point.customdata.id;
                let point_chromosome = point.text;

                this.highlight_hovered_designs([point_id]);
                this.$store.commit('set_design', point_chromosome);
                this.$store.commit('set_design_hovered', point_chromosome);
            },
            highlight_hovered_designs(design_ids){
                let plot_designs_customdata = _.cloneDeep(this.plot_designs_customdata);
                for(let x = 0; x < plot_designs_customdata.length; x++){
                    if(design_ids.includes(plot_designs_customdata[x].id)){
                        plot_designs_customdata[x].hovered = true;
                    }
                    else{
                        plot_designs_customdata[x].hovered = false;
                    }
                }
                this.plot_designs_customdata = plot_designs_customdata;
            },
            highlight_clicked_designs(design_ids){
                let plot_designs_customdata = _.cloneDeep(this.plot_designs_customdata);
                for(let x = 0; x < plot_designs_customdata.length; x++){
                    if(design_ids.includes(plot_designs_customdata[x].id)){
                        plot_designs_customdata[x].clicked = true;
                    }
                    else{
                        plot_designs_customdata[x].clicked = false;
                    }
                }
                this.plot_designs_customdata = plot_designs_customdata;
            },

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
                            id_list: this.plot_designs_ids
                        }
                    },
                    result ({data}){
                        if(data.design_subscription.length === 0){
                            return;
                        }
                        console.log('--> ', data.design_subscription.length, ' NEW DESIGNS');
                        this.initialized = false;

                        let designs = data.design_subscription;
                        for(let x = 0; x < designs.length; x++){
                            let design = designs[x];
                            let design_customdata = {id: design.id, hovered: false, clicked: false};
                            if(x === (designs.length-1)){design_customdata.clicked = true;}
                            this.plot_designs_customdata.push(design_customdata);
                            this.plot_designs_ids.push(design.id);
                            this.plot_designs.push(design);
                        }

                        // --> Set last design as clicked
                        let last_design = designs[designs.length-1];
                        this.$store.commit('set_design_clicked', last_design.representation);

                        this.initialized = true;
                    },
                    skip() {
                        return !this.initialized;
                    }
                }
            }
        },
        watch: {
            selected_objectives(){
                console.log('SELECTED OBJECTIVES', this.selected_objectives);
            },
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