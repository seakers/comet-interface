<template>
    <v-card elevation="4">



        <v-container>

            <v-row>
                <v-col cols="4">
                    <v-container>
                        <v-row>
                            <v-card-title>Visualizer</v-card-title>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-container>
                                    <!--VIS TYPE-->
                                    <v-row>
                                        <v-combobox v-model="visualization_type" :items="visualization_types" label="Visualization Type" solo></v-combobox>
                                    </v-row>

                                    <!--TYPE: Design Space-->
                                    <v-row v-if="visualization_type === 'Design Space'">
                                        <v-combobox
                                            :items="this.problem_info.objectives"
                                            v-model="selected_objectives"
                                            label="Objectives"
                                            item-text="name"
                                            item-value="id"
                                            solo
                                            multiple
                                            small-chips
                                        ></v-combobox>

                                    </v-row>

                                    <!--TYPE: Coverage Map-->
                                    <v-row v-if="visualization_type === 'Coverage Map'">

                                    </v-row>
                                </v-container>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-col>

                <v-col cols="8">
                    <Plotly :data="plot.data"
                            :layout="plot.layout"
                            :display-mode-bar="true"
                            v-on:click="select_datapoint"
                            v-on:hover="hover_datapoint"
                    ></Plotly>



                </v-col>

            </v-row>


        </v-container>



<!--        -->
<!--        <v-card-title>Visualizer</v-card-title>-->
<!--        <v-container>-->
<!--            <v-row>-->

<!--                &lt;!&ndash;CONTROLS&ndash;&gt;-->
<!--                <v-col cols="4">-->
<!--                    <v-container>-->
<!--                        &lt;!&ndash;VIS TYPE&ndash;&gt;-->
<!--                        <v-row>-->
<!--                            <v-combobox v-model="visualization_type" :items="visualization_types" label="Visualization Type" solo></v-combobox>-->
<!--                        </v-row>-->

<!--                        &lt;!&ndash;TYPE: Design Space&ndash;&gt;-->
<!--                        <v-row v-if="visualization_type === 'Design Space'">-->
<!--                            <v-combobox-->
<!--                                :items="this.problem_info.objectives"-->
<!--                                v-model="selected_objectives"-->
<!--                                label="Objectives"-->
<!--                                item-text="name"-->
<!--                                item-value="id"-->
<!--                                solo-->
<!--                                multiple-->
<!--                                small-chips-->
<!--                            ></v-combobox>-->

<!--                        </v-row>-->

<!--                        &lt;!&ndash;TYPE: Coverage Map&ndash;&gt;-->
<!--                        <v-row v-if="visualization_type === 'Coverage Map'">-->

<!--                        </v-row>-->
<!--                    </v-container>-->
<!--                </v-col>-->

<!--                &lt;!&ndash;PLOT&ndash;&gt;-->
<!--                <v-col cols="8">-->
<!--                    <Plotly :data="plot.data"-->
<!--                            :layout="plot.layout"-->
<!--                            :display-mode-bar="true"-->
<!--                            v-on:click="select_datapoint"-->
<!--                            v-on:hover="hover_datapoint"-->
<!--                    ></Plotly>-->
<!--                </v-col>-->
<!--                -->
<!--                -->
<!--            </v-row>-->
<!--        </v-container>-->
<!--        -->





    </v-card>
</template>

<script>
    import { mapState } from 'vuex';
    import {ProblemDesignsSub, SelectedProblemInfoSub} from "../../scripts/subscriptions";
    import { get_scatter_plot } from "../../scripts/plots";
    import { Plotly } from 'vue-plotly'

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

                problem_info: {
                    objectives: []
                },

                designs_sub: [],

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
                let return_plot = get_scatter_plot(this.selected_objectives, this.designs_sub);
                console.log('--> PLOT', return_plot);
                return return_plot
            },
        },
        methods: {
            select_datapoint(event){
                console.log('--> POINT SELECTED', event);
            },
            hover_datapoint(event){
                let points = event.points;
                if(points.length === 0){
                    return;
                }
                let point = points[0];
                let point_design = [];
                for(let x = 0; x < point.text.length; x++){
                    point_design.push(parseInt(point.text[x]))
                }
                this.$store.commit('set_design', point_design);
            }
        },
        apollo: {
            $subscribe: {
                problem_info: {
                    query: SelectedProblemInfoSub,
                    variables() {
                        return {
                            problem_id: this.problem_id
                        }
                    },
                    result ({data}){
                        this.problem_info = data.problem_info[0];
                        console.log('--> PROBLEM INFO SUB UPDATE', this.problem_info);
                    },
                    skip() {
                        return this.problem_id === null;
                    }
                },
                designs_sub: {
                    query: ProblemDesignsSub,
                    variables() {
                        return {
                            problem_id: this.problem_id
                        }
                    },
                    result ({data}){
                        this.designs_sub = data.designs_sub;
                        console.log('problem designs', this.designs_sub)
                    },
                    skip() {
                        return this.problem_id === null;
                    }
                }
            }
        },
        watch: {
            selected_objectives(){
                console.log('SELECTED OBJECTIVES', this.selected_objectives);
            }
        },
        async mounted() {

        }
    }
</script>



<style scoped>

</style>