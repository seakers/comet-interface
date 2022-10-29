<template>
    <v-list dense nav>
        <v-subheader style="color: white !important; font-size: large;">Problem Picker</v-subheader>
        <v-list-item>
            <v-combobox
                label="Problem"
                v-model="selected_problem_obj"
                :items="user_problems"
                item-text="name"
                item-value="id"
                height="40"
                solo dense></v-combobox>
        </v-list-item>
        <v-list-item style="margin-bottom: 10px; margin-top: -20px;">
            <v-btn
                color="success"
                v-on:click="load_problem()"
                dark
            >Load</v-btn>
        </v-list-item>
    </v-list>
</template>

<script>
    import {mapState} from "vuex";
    import {UserProblemsSub, CurrentUserProblemSub} from "../scripts/subscriptions";

    export default {
        name: "problem-picker",
        data: function () {
            return {
                selected_problem_obj: null,

                user_problems: [],
                problem_id_sub: [],
            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                user_info_id: state => state.user.user_info_id,
                username: state => state.user.username,
                email: state => state.user.email,
                problem_id: state => state.problem.problem_id,
            }),
            disable_load() {
                if(this.selected_problem_obj === null){
                    return true;
                }
                return this.selected_problem_obj.id === this.problem_id;
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
                        this.user_problems = data.user_problems;
                    },
                    skip() {
                        return this.user_info_id === null;
                    }
                },
                problem_id_sub: {
                    query: CurrentUserProblemSub,
                    variables() {
                        return {
                            user_info_id: this.user_info_id
                        }
                    },
                    result ({data}){
                        let sub_problem_id = data.problem_id_sub[0]['problem_id'];
                        this.$store.commit('set_problem_id', sub_problem_id);
                    },
                    skip() {
                        return this.user_info_id === null;
                    }
                }
            }
        },
        watch: {
            async problem_id() {
                await this.sync_selected_problem();
            },
            async user_problems(){
                await this.sync_selected_problem()
            },
            selected_problem_id() {
                console.log('SELECTED ID CHANGED', this.selected_problem_obj)
            }
        },
        async mounted() {

        }
    }


</script>

<style scoped>

</style>