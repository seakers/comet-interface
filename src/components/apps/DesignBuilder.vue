<template>
    <v-card elevation="4">

        <v-app-bar class="primary white--text" elevation="0" dense>
            <v-toolbar-title>Design Builder</v-toolbar-title>
            <v-spacer></v-spacer>
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
                    <v-card max-height="450" style="overflow-x: scroll; overflow-y: scroll;" :loading="this.design_clicked_eval_request !== null">
                        <v-list-item three-line>
                            <v-list-item-content>
                                <v-container>
                                    <v-row>
                                        <v-col style="padding: 0;">
                                            <div class="text-overline mb-4">Clicked</div>
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <v-col align="right" style="padding: 0">
                                            <v-chip class="ma-2" color="#ff8200" label text-color="white" v-if="clicked_design_edited === true" small pill>
                                                <v-icon left small>mdi-alert</v-icon>
                                                Modified
                                            </v-chip>
                                        </v-col>
                                    </v-row>
                                </v-container>
                                <v-list-item-title class="text-h5 mb-1">
                                    {{ this.clicked_design_title }}
                                </v-list-item-title>
                                <v-list-item-subtitle>{{this.clicked_design_objectives}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-container v-if="local_design_clicked !== null">
                            <v-row>
                                <v-col cols="12">
                                    <v-card-text>
                                        <v-container>
                                            <v-row v-for="(decision, idx) in decisions" :key="decision.name">
                                                <v-btn-toggle v-model="local_design_clicked.structure[idx]" mandatory>
                                                    <v-btn v-for="alternative in decision.alternatives" :key="alternative.value" small>{{alternative.value}}</v-btn>
                                                </v-btn-toggle>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                </v-col>
                            </v-row>
                        </v-container>
                        <v-card-actions>
                            <v-tooltip right :disabled="clicked_design_eval_reason === ''">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-bind="attrs" v-on="on"  v-on:click="evaluate_design_clicked" :disabled="!can_evaluate_clicked" color="primary">Evaluate Design</v-btn>
                                </template>
                                <span>{{clicked_design_eval_reason}}</span>
                            </v-tooltip>
                        </v-card-actions>
                    </v-card>
                </v-col>

                <!--HOVERED ARCHITECTURE-->
                <v-col cols="6">
                    <v-card max-height="450" style="overflow-x: scroll; overflow-y: scroll;" :loading="this.design_hovered_eval_request !== null">
                        <v-list-item three-line>
                            <v-list-item-content>
                                <v-container>
                                    <v-row>
                                        <v-col style="padding: 0;">
                                            <div class="text-overline mb-4">Hovered</div>
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <v-col align="right" style="padding: 0">
                                            <v-chip class="ma-2" color="#ff8200" label text-color="white" v-if="hovered_design_edited === true" small pill>
                                                <v-icon left small>mdi-alert</v-icon>
                                                Modified
                                            </v-chip>
                                        </v-col>
                                    </v-row>
                                </v-container>
                                <v-list-item-title class="text-h5 mb-1">
                                    {{ this.hovered_design_title }}
                                </v-list-item-title>
                                <v-list-item-subtitle>{{this.hovered_design_objectives}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-container  v-if="local_design_hovered !== null">
                            <v-row>
                                <v-col cols="12">
                                    <v-card-text>
                                        <v-container>
                                            <v-row v-for="(decision, idx) in decisions" :key="decision.name">
                                                <v-btn-toggle v-model="local_design_hovered.structure[idx]" mandatory>
                                                    <v-btn v-for="alternative in decision.alternatives" :key="alternative.value" small>{{alternative.value}}</v-btn>
                                                </v-btn-toggle>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                </v-col>
                            </v-row>
                        </v-container>
                        <v-card-actions>
                            <v-tooltip right :disabled="hovered_design_eval_reason === ''">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-bind="attrs" v-on="on" v-on:click="evaluate_design_hovered" :disabled="!can_evaluate_hovered" color="primary">Evaluate Design</v-btn>
                                </template>
                                <span>{{hovered_design_eval_reason}}</span>
                            </v-tooltip>
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
    import {convertDesignToString} from "../../scripts/design-helpers";
    import Vue from "vue";

    export default {
        name: "design-builder",
        data: function () {
            return {
                // --> Decisions for assuming chromosome structure
                decisions: [],

                // --> Info about current design in builder
                local_design_clicked: null,
                local_design_hovered: null,

                design_clicked_sub: [],
                design_hovered_sub: [],

                clicked_design_already_indexed: false,
                hovered_design_already_indexed: false,

                clicked_design_already_evaluated: false,
                hovered_design_already_evaluated: false,

                clicked_design_eval_reason: '',
                hovered_design_eval_reason: '',
            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                is_admin: state => state.user.is_admin,
                user_info_id: state => state.user.user_info_id,
                problem_id: state => state.problem.problem_id,
                dataset_id: state => state.problem.dataset_id,
                store_design_hovered: state => state.problem.store_design_hovered,
                store_design_clicked: state => state.problem.store_design_clicked,
                available_design_evaluators: state => state.services.available_design_evaluators,
                evaluation_queue: state => state.services.evaluation_queue,
            }),
            design_hovered_eval_request: {
                get() {
                    return this.$store.state.problem.design_hovered_eval_request;
                },
                set(value) {
                    this.$store.commit('setDesignHoveredEvalRequest', value);
                }
            },
            design_clicked_eval_request: {
                get() {
                    return this.$store.state.problem.design_clicked_eval_request;
                },
                set(value) {
                    this.$store.commit('setDesignClickedEvalRequest', value);
                }
            },
            can_evaluate_hovered(){
                if(this.evaluation_queue === null || this.available_design_evaluators === 0){
                    this.hovered_design_eval_reason = 'Evaluation Queue not set OR No available design evaluators!'
                    return false;
                }
                if(!this.hovered_design_already_indexed){
                    this.hovered_design_eval_reason = '';
                    return true;
                }
                else{
                    if(!this.hovered_design_already_evaluated){
                        this.hovered_design_eval_reason = '';
                        return true;
                    }
                    this.hovered_design_eval_reason = 'Design already indexed and evaluated';
                    return false;
                }
            },
            can_evaluate_clicked(){
                if(this.evaluation_queue === null || this.available_design_evaluators === 0){
                    this.clicked_design_eval_reason = 'Evaluation Queue not set OR No available design evaluators!'
                    return false;
                }
                if(!this.clicked_design_already_indexed){
                    this.clicked_design_eval_reason = '';
                    return true;
                }
                else{
                    if(!this.clicked_design_already_evaluated){
                        this.clicked_design_eval_reason = '';
                        return true;
                    }
                    this.clicked_design_eval_reason = 'Design already indexed and evaluated';
                    return false;
                }
            },
            clicked_design_title(){
                if(this.local_design_clicked === null){
                    return "";
                }
                return ("Design D" + this.local_design_clicked.id);
            },
            hovered_design_title(){
                if(this.local_design_hovered === null){
                    return "";
                }
                return ("Design D" + this.local_design_hovered.id);
            },
            clicked_design_structure(){
                return convertDesignToString(this.local_design_clicked.structure);
            },
            hovered_design_structure(){
                return convertDesignToString(this.local_design_hovered.structure);
            },
            clicked_design_objectives(){
                if(this.local_design_clicked === null){
                    return "";
                }
                let objective_str = '';
                for(let x = 0; x < this.local_design_clicked.objectives.length; x++){
                    if(x !== 0){
                        objective_str += ', ';
                    }
                    let objective = this.local_design_clicked.objectives[x];
                    let objective_name = objective.objective_name.name;
                    let value = objective.value;
                    objective_str += (objective_name + ': ' + value);
                }
                return objective_str;
            },
            hovered_design_objectives(){
                if(this.local_design_hovered === null){
                    return "";
                }
                let objective_str = '';
                for(let x = 0; x < this.local_design_hovered.objectives.length; x++){
                    if(x !== 0){
                        objective_str += ', ';
                    }
                    let objective = this.local_design_hovered.objectives[x];
                    let objective_name = objective.objective_name.name;
                    let value = objective.value;
                    objective_str += (objective_name + ': ' + value);
                }
                return objective_str;
            },
            clicked_design_edited(){
                if(this.local_design_clicked === null){
                    return false;
                }
                if(convertDesignToString(this.local_design_clicked.structure) !== this.local_design_clicked.representation){
                    return true;
                }
                return false;
            },
            hovered_design_edited(){
                if(this.local_design_hovered === null){
                    return false;
                }
                if(convertDesignToString(this.local_design_hovered.structure) !== this.local_design_hovered.representation){
                    return true;
                }
                return false;
            },
        },
        methods: {
            async evaluate_design_hovered() {
                let design_str = convertDesignToString(this.local_design_hovered.structure);
                this.$store.commit('setDesignHoveredEvalRequest', design_str);
                console.log('--> DESIGN:', design_str)
                await this.send_evaluate_message(design_str);
            },
            async evaluate_design_clicked() {
                let design_str = convertDesignToString(this.local_design_clicked.structure);
                this.$store.commit('setDesignClickedEvalRequest', design_str);
                console.log('--> DESIGN:', design_str)
                await this.send_evaluate_message(design_str);
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
                        },
                        dataset_id: {
                            DataType: "String",
                            StringValue: this.dataset_id.toString()
                        },
                        origin: {
                            DataType: "String",
                            StringValue: "user"
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
            },
            generate_empty_design() {
                let design_ary = [];
                let design_str = "";
                for(let x = 0; x < this.decisions.length; x++){
                    let decision = this.decisions[x];
                    design_ary.push(0);
                    design_str = design_str + "0";
                }
                let design_obj = {
                    'representation': design_str,
                    'structure': design_ary,
                    'objectives': [],
                    'id': 0,
                    'evaluation_status': false
                };
                return design_obj;
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
                        console.log('--> PROBLEM DECISIONS:', this.decisions);
                        this.local_design_clicked = this.generate_empty_design();
                        this.local_design_hovered = this.generate_empty_design();
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
                            dataset_id: this.dataset_id,
                            representation: this.hovered_design_structure
                        }
                    },
                    result ({data}){
                        let designs = data.design_sub;
                        if(designs.length === 0){
                            this.hovered_design_already_indexed = false;
                            this.hovered_design_already_evaluated = false;
                        }
                        else{
                            this.hovered_design_already_indexed = true;
                            this.hovered_design_already_evaluated = designs[0].evaluation_status;
                        }
                    },
                    skip() {
                        return (this.problem_id === null || this.dataset_id === null || this.local_design_hovered === null)
                    }
                },
                design_clicked_sub: {
                    query: DesignExistsSub,
                    variables() {
                        return {
                            problem_id: this.problem_id,
                            dataset_id: this.dataset_id,
                            representation: this.clicked_design_structure,
                        }
                    },
                    result ({data}){
                        let designs = data.design_sub;
                        console.log('--> CHECKING IF CLICKED DESIGN EXISTS:', designs)
                        if(designs.length === 0){
                            this.clicked_design_already_indexed = false;
                            this.clicked_design_already_evaluated = false;
                        }
                        else{
                            this.clicked_design_already_indexed = true;
                            this.clicked_design_already_evaluated = designs[0].evaluation_status;
                        }
                    },
                    skip() {
                        return (this.problem_id === null || this.dataset_id === null || this.local_design_clicked === null);
                    }
                }
            }
        },
        watch: {
            store_design_hovered() {
                if(this.store_design_hovered !== null){
                    this.local_design_hovered = _.cloneDeep(this.store_design_hovered);
                }
            },
            store_design_clicked() {
                if(this.store_design_clicked !== null){
                    this.local_design_clicked = _.cloneDeep(this.store_design_clicked);
                }
            },
            evaluation_queue() {
                console.log('--> EVAL QUEUE', this.evaluation_queue);
            },
        },
    }
</script>



<style scoped>

</style>