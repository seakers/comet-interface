<template>
    <v-card elevation="4">

        <v-app-bar class="primary white--text" elevation="0" dense>
            <v-toolbar-title>Design Builder</v-toolbar-title>
            <v-spacer></v-spacer>
            <!--            <v-img :src="lockheed_icon" max-width="170" style="margin-right: 10px;"></v-img>-->
            <v-menu offset-y>
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
                <v-list dense>
                    <v-list-item-group>
                        <v-list-item v-on:click="clear_eval_queue()">
                            <v-list-item-title>Purge Queue</v-list-item-title>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-menu>
        </v-app-bar>

        <v-container>
            <v-row>

                <!--SELECTED ARCHITECTURE-->
                <v-col cols="6">
                    <v-card max-height="400" style="overflow-x: scroll; overflow-y: scroll;">
                        <v-card-title>Selected Design</v-card-title>
                        <v-card-subtitle>

                        </v-card-subtitle>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-card-text>
                                        <v-container>
                                            <v-row v-for="(decision, idx) in decisions" :key="decision.name">
                                                <v-btn-toggle v-model="local_design_clicked[idx]" mandatory>
                                                    <v-btn v-for="alternative in decision.alternatives" :key="alternative.value" small>{{alternative.value}}</v-btn>
                                                </v-btn-toggle>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                </v-col>
                            </v-row>
                        </v-container>
                        <v-card-actions>
                            <v-btn v-on:click="evaluate_design_clicked" :disabled="!can_evaluate_clicked" color="primary">Evaluate</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>


                <!--HOVERED ARCHITECTURE-->
                <v-col cols="6">
                    <v-card max-height="400" style="overflow-x: scroll; overflow-y: scroll;">
                        <v-card-title>Hovered Design</v-card-title>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-card-text>
                                        <v-container>
                                            <v-row v-for="(decision, idx) in decisions" :key="decision.name">
                                                <v-btn-toggle v-model="local_design_hovered[idx]" mandatory>
                                                    <v-btn v-for="alternative in decision.alternatives" :key="alternative.value" small>{{alternative.value}}</v-btn>
                                                </v-btn-toggle>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                </v-col>
                            </v-row>
                        </v-container>
                        <v-card-actions>
                            <v-btn v-on:click="evaluate_design_hovered" :disabled="!can_evaluate_hovered" color="primary">Evaluate</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
    import { mapGetters, mapState } from 'vuex';
    import { DesignExistsSub, ProblemDecisionsSub } from "../../scripts/subscriptions";
    import {sqsClient} from "../../scripts/sqsClient";
    import {ListQueuesCommand, SendMessageCommand, PurgeQueueCommand} from "@aws-sdk/client-sqs";
    import * as _ from "lodash";
    import {wsTools} from "../../scripts/websocket-tools";

    export default {
        name: "design-builder",
        data: function () {
            return {
                // --> SQS Client

                decisions: [],

                // --> Info about current design in builder
                local_design: [],
                local_design_hovered: [],
                local_design_clicked: [],

                design_sub: [],
                design_hovered_sub: [],
                design_clicked_sub: [],

                already_indexed: false,
                ldh_already_indexed: false,
                ldc_already_indexed: false,

                already_evaluated: false,
                ldh_already_evaluated: false,
                ldc_already_evaluated: false,
            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                is_admin: state => state.user.is_admin,
                user_info_id: state => state.user.user_info_id,
                username: state => state.user.username,
                email: state => state.user.email,
                nav_bar_apps: state => state.controls.nav_bar_apps,
                problem_id: state => state.problem.problem_id,
                design: state => state.problem.design,
                design_hovered: state => state.problem.design_hovered,
                design_clicked: state => state.problem.design_clicked,
                available_design_evaluators: state => state.services.available_design_evaluators,
                evaluation_queue: state => state.services.evaluation_queue,
            }),
            local_design_rep(){
                let representation = '';
                for(let x = 0; x < this.local_design.length; x++){
                    representation += this.local_design[x].toString();
                }
                return representation;
            },
            local_design_hovered_rep(){
                let representation = '';
                for(let x = 0; x < this.local_design_hovered.length; x++){
                    representation += this.local_design_hovered[x].toString();
                }
                return representation;
            },
            local_design_clicked_rep(){
                let representation = '';
                for(let x = 0; x < this.local_design_clicked.length; x++){
                    representation += this.local_design_clicked[x].toString();
                }
                return representation;
            },
            can_evaluate(){
                if(this.evaluation_queue === null){
                    return false;
                }
                if(this.available_design_evaluators === 0){
                    return false;
                }
                if(this.already_indexed === true){
                    if(this.already_evaluated === true){
                        return false;
                    }
                    return true;
                }
                else{
                    return true;
                }
            },
            can_evaluate_hovered(){
                if(this.evaluation_queue === null){
                    return false;
                }
                if(this.available_design_evaluators === 0){
                    return false;
                }
                if(this.ldh_already_indexed === true){
                    if(this.ldh_already_evaluated === true){
                        return false;
                    }
                    return true;
                }
                else{
                    return true;
                }
            },
            can_evaluate_clicked(){
                if(this.evaluation_queue === null){
                    return false;
                }
                if(this.available_design_evaluators === 0){
                    return false;
                }
                if(this.ldc_already_indexed === true){
                    if(this.ldc_already_evaluated === true){
                        return false;
                    }
                    return true;
                }
                else{
                    return true;
                }
            },
        },
        methods: {
            async evaluate_design() {
                await this.send_evaluate_message(this.local_design_rep);
            },
            async evaluate_design_hovered() {
                await this.send_evaluate_message(this.local_design_hovered_rep);
            },
            async evaluate_design_clicked() {
                await this.send_evaluate_message(this.local_design_clicked_rep);
            },
            async send_evaluate_message(input) {
                console.log('--> SENDING SQS EVAL MESSAGE')
                const command = new SendMessageCommand({
                    QueueUrl: this.evaluation_queue,
                    MessageBody: "evaluate",
                    MessageAttributes: {
                        msgType: {
                            DataType: "String",
                            StringValue: "evaluate"
                        },
                        input: {
                            DataType: "String",
                            StringValue: input
                        }
                    }
                });

                const response = await sqsClient.send(command);
                console.log('--> SQS RESPONSE', response);
            },
            async clear_eval_queue() {
                console.log('--> SENDING SQS PURGE QUEUE')
                const command = new PurgeQueueCommand({
                    QueueUrl: this.evaluation_queue
                });
                const response = await sqsClient.send(command);
                console.log('--> SQS RESPONSE', response);
            }
        },
        apollo: {
            $subscribe: {
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
                        this.$store.commit('set_design', local_design);
                        this.decisions = data.decisions;
                        console.log('--> PROBLEM DECISIONS:', this.decisions)
                    },
                    skip() {
                        return this.problem_id === null;
                    }
                },
                design_sub: {
                    query: DesignExistsSub,
                    variables() {
                        return {
                            problem_id: this.problem_id,
                            representation: this.local_design_rep
                        }
                    },
                    result ({data}){
                        let designs = data.design_sub;
                        if(designs.length === 0){
                            this.already_indexed = false;
                            this.already_evaluated = false;
                        }
                        else{
                            this.already_indexed = true;
                            this.already_evaluated = designs[0].evaluation_status;
                        }
                    },
                    skip() {
                        return this.problem_id === null;
                    }
                },
                design_hovered_sub: {
                    query: DesignExistsSub,
                    variables() {
                        return {
                            problem_id: this.problem_id,
                            representation: this.local_design_hovered_rep
                        }
                    },
                    result ({data}){
                        let designs = data.design_sub;
                        if(designs.length === 0){
                            this.ldh_already_indexed = false;
                            this.ldh_already_evaluated = false;
                        }
                        else{
                            this.ldh_already_indexed = true;
                            this.ldh_already_evaluated = designs[0].evaluation_status;
                        }
                    },
                    skip() {
                        return this.problem_id === null;
                    }
                },
                design_clicked_sub: {
                    query: DesignExistsSub,
                    variables() {
                        return {
                            problem_id: this.problem_id,
                            representation: this.local_design_clicked_rep
                        }
                    },
                    result ({data}){
                        let designs = data.design_sub;
                        if(designs.length === 0){
                            this.ldc_already_indexed = false;
                            this.ldc_already_evaluated = false;
                        }
                        else{
                            this.ldc_already_indexed = true;
                            this.ldc_already_evaluated = designs[0].evaluation_status;
                        }
                    },
                    skip() {
                        return this.problem_id === null;
                    }
                }
            }
        },
        watch: {
            design() {
                this.local_design = _.cloneDeep(this.design);
            },
            design_hovered() {
                this.local_design_hovered = _.cloneDeep(this.design_hovered);
            },
            design_clicked() {
                this.local_design_clicked = _.cloneDeep(this.design_clicked);
            }
        },
    }
</script>



<style scoped>

</style>