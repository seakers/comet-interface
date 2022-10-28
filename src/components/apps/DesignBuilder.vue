<template>
    <v-card elevation="4">
        <v-card-title>Design Builder</v-card-title>

        <v-container>
            <v-row>

                <!--DECISIONS VALUE-->
                <v-col cols="12">
                    <v-container>
                        <v-row v-for="(decision, idx) in decisions" :key="decision.name">
                            <v-container>
                                <v-row>
                                    {{decision.name}}
                                </v-row>
                                <v-row>
                                    <v-btn-toggle v-model="local_design[idx]" mandatory>
                                        <v-btn v-for="alternative in decision.alternatives" :key="alternative.value" small>{{alternative.value}}</v-btn>
                                    </v-btn-toggle>
                                </v-row>
                            </v-container>
                        </v-row>
                    </v-container>
                </v-col>
            </v-row>
        </v-container>

        <v-card-actions>
            <v-btn color="primary" :disabled="!can_evaluate" v-on:click="evaluate_design()">
                Evaluate Design
            </v-btn>
        </v-card-actions>
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
                design_sub: [],

                // --> Info about current design in builder
                already_indexed: false,
                already_evaluated: false,

                local_design: []
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
                design: state => state.problem.design,
                available_design_evaluators: state => state.services.available_design_evaluators,
                evaluation_queue: state => state.services.evaluation_queue,

            }),
            design_representation(){
                let representation = '';
                for(let x = 0; x < this.local_design.length; x++){
                    representation += this.local_design[x].toString();
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
        },
        methods: {
            async evaluate_design() {
                await this.send_evaluate_message();
            },
            async send_evaluate_message() {
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
                            StringValue: this.design_representation
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
                            representation: this.design_representation
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
                }
            }
        },
        watch: {
            design() {
                console.log('--> DESIGN UPDATED BACKEND', this.design);
                this.local_design = _.cloneDeep(this.design);
            }
        },
    }
</script>



<style scoped>

</style>