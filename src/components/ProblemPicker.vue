<template>
    <v-list dense nav>
        <v-subheader style="color: white !important; font-size: large;">Problem Picker</v-subheader>
        <v-list-item style="margin-top: 6px;">
            <v-select
                label="Problem"
                v-model="selected_problem_obj"
                :items="user_problems"
                item-text="name"
                item-value="id"
                height="40"
                outlined dark dense>
            </v-select>
        </v-list-item>
        <v-list-item style="margin-top: -12px;">
            <v-select
                label="Dataset"
                v-model="selected_dataset_obj"
                :items="user_datasets"
                item-text="combined"
                item-value="id"
                height="40"
                outlined dark dense>
            </v-select>
        </v-list-item>
        <v-list-item style="margin-bottom: 10px; margin-top: -15px;">
            <v-container style="padding: 0px 5px 0px 0px;">
                <v-row>
                    <v-col cols="4">
                        <v-btn color="success" v-on:click="load_problem()" dark>Load</v-btn>
                    </v-col>
                    <v-col cols="8">
                        <v-btn color="success" disabled dark block>New Dataset</v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" style="padding-top: 0;">
                        <v-btn color="success" disabled dark block>Problem Builder</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-list-item>
    </v-list>
</template>

<script>
    import {mapState} from "vuex";
    import {UserProblemsSub, CurrentUserProblemSub, UserDatasetsSub} from "../scripts/subscriptions";

    export default {
        name: "problem-picker",
        data: function () {
            return {
                selected_problem_obj: null,
                selected_dataset_obj: null,

                user_problems: [],
                user_datasets: []
            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                user_info_id: state => state.user.user_info_id,
                username: state => state.user.username,
                email: state => state.user.email,
                problem_id: state => state.problem.problem_id,
                dataset_id: state => state.problem.dataset_id,
            }),
            disable_load() {
                if(this.selected_problem_obj === null){
                    return true;
                }
                return this.selected_problem_obj.id === this.problem_id;
            },
            selected_dataset_id() {
                if(this.selected_dataset_obj === null){
                    return this.dataset_id;
                }
                else{
                    return this.selected_dataset_obj.id;
                }
            },
            selected_problem_id() {
                if(this.selected_problem_obj === null){
                    return this.problem_id;
                }
                else{
                    return this.selected_problem_obj.id;
                }
            }
        },
        methods: {
            async load_problem() {
                if(this.selected_problem_obj.id !== this.problem_id){
                    console.log('--> LOADING PROBLEM ', this.problem_id, ' --> ', this.selected_problem_obj.id);
                }
            },
            async sync_selected_problem() {
                if(this.problem_id !== null){
                    for(let x = 0; x < this.user_problems.length; x++){
                        let problem = this.user_problems[x];
                        if(problem.id === this.problem_id){
                            this.selected_problem_obj = problem;
                        }
                    }
                }
            },
            async sync_selected_dataset() {
                if(this.dataset_id !== null){
                    for(let x = 0; x < this.user_datasets.length; x++){
                        let dataset = this.user_datasets[x];
                        if(dataset.id === this.dataset_id){
                            this.selected_dataset_obj = dataset;
                        }
                    }
                }
            }
        },
        apollo: {
            $subscribe: {
                user_problems: {
                    query: UserProblemsSub,
                    variables() {
                        return {
                            user_info_id: this.user_info_id
                        }
                    },
                    result ({data}){
                        let user_problems = [];
                        for(let x = 0; x < data.user_problems.length; x++){
                            let user_problem = data.user_problems[x];
                            user_problem.combined =  '(' + user_problem.id.toString() + ') ' + user_problem.name.toString();
                            user_problems.push(user_problem);
                        }
                        this.user_problems = user_problems;
                    },
                    skip() {
                        return this.user_info_id === null;
                    }
                },
                user_datasets: {
                    query: UserDatasetsSub,
                    variables() {
                        return {
                            user_info_id: this.user_info_id,
                            problem_id: this.selected_problem_id
                        }
                    },
                    result ({data}){
                        let user_datasets = [];
                        for(let x = 0; x < data.user_datasets.length; x++){
                            let user_dataset = data.user_datasets[x];
                            user_dataset.combined = '(' + user_dataset.id.toString() + ') ' + user_dataset.name.toString();
                            user_datasets.push(user_dataset);
                        }
                        this.user_datasets = user_datasets;
                    },
                    skip() {
                        return (this.user_info_id === null || this.problem_id === null)
                    }
                },
            }
        },
        watch: {
            async problem_id() {
                await this.sync_selected_problem();
            },
            async user_problems(){
                await this.sync_selected_problem()
            },
            async dataset_id() {
                await this.sync_selected_dataset();
            },
            async user_datasets(){
                await this.sync_selected_dataset()
            },
        },
        async mounted() {

        }
    }


</script>

<style scoped>

</style>