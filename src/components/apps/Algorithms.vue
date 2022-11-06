<template>
    <v-card elevation="4">

        <!--SERVER SELECTION-->
        <v-app-bar class="primary white--text" elevation="0" dense clipped-left>
            <v-toolbar-title>Algorithms</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" dark v-bind="attrs" v-on="on">
                        <div v-if="selected_container !== null">
                            Server {{selected_container_idx}}
                        </div>
                        <div v-if="selected_container === null">
                            NO SELECTION
                        </div>
                        <v-icon dark>
                            mdi-menu-down
                        </v-icon>
                    </v-btn>
                </template>
                <v-list v-if="container_store !== null" dense>
                    <v-list-item-group>
                        <v-list-item v-for="(container, idx) in container_store" v-on:click="select_container(container, idx+1)" :key="container.id" :disabled="container.container.Status === 'Stopped'" dense>
                            <v-list-item-icon><v-icon>mdi-server</v-icon></v-list-item-icon>
                            <v-list-item-title>Server {{idx+1}}</v-list-item-title>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-menu>

        </v-app-bar>
        <v-container>
            <v-row>

                <!--CONTAINER ALGORITHMS-->
                <v-col cols="4">
                    <v-card>
                        <v-card-title v-if="selected_container === null">No Server Selected</v-card-title>
                        <v-card-title v-if="selected_container !== null">Server {{selected_container_idx}}</v-card-title>
                        <v-divider></v-divider>
                        <v-container>
                            <v-row justify="center">
                                <v-col cols="12" style="padding: 0">



                                    <v-virtual-scroll :items="container_algorithms" item-height="65" height="250">
                                        <template v-slot:default="{ item }">
                                            <v-list-item :key="item.ga_id" two-line>
                                                <v-list-item-content>
                                                    <v-list-item-title>{{ item.ga_id }}</v-list-item-title>
                                                    <v-list-item-subtitle>NSGA-II</v-list-item-subtitle>
                                                </v-list-item-content>

                                                <v-list-item-action>
                                                    <v-btn depressed small>
                                                        LOAD
                                                        <v-icon color="orange darken-4" right>
                                                            mdi-open-in-new
                                                        </v-icon>
                                                    </v-btn>
                                                </v-list-item-action>

                                            </v-list-item>
                                            <v-divider></v-divider>
                                        </template>
                                    </v-virtual-scroll>





                                </v-col>
                            </v-row>
                        </v-container>
                        <v-divider></v-divider>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-btn :disabled="selected_container === null" block elevation="0" color="primary" v-on:click="build_run_view = !build_run_view">Build Algorithm</v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card>
                </v-col>


                <!--ALGORITHM VIEWER-->
                <v-col cols="8" v-if="build_run_view === false">
                    <v-card height="375">
                        <v-btn v-on:click="ping_selected_container()">
                            test
                        </v-btn>

                        <v-btn v-on:click="stop_all_container_algorithms()">
                            stop all
                        </v-btn>

                    </v-card>
                </v-col>


                <!--ALGORITHM BUILDER-->
                <v-col cols="8" v-if="build_run_view === true">
                    <v-card>
                        <v-card-title>Algorithm Builder</v-card-title>
                        <v-container>
                            <v-row style="padding-top: 30px;">
                                <v-spacer></v-spacer>
                                <v-col cols="5">
                                    <v-form>
                                        <v-select label="Algorithm" v-model="build_type" :items="['E-MOEA']" height="40" required dense></v-select>
                                        <v-select label="Crossover" v-model="build_crossoverProb" :items="['Uniform']" item-text="name" item-value="id" height="40" required dense></v-select>
                                        <v-select label="Mutation" v-model="build_mutationProb" :items="['Uniform']" item-text="name" item-value="id" height="40" required dense></v-select>
                                    </v-form>
                                </v-col>
                                <v-col cols="6">
                                    <v-slider v-model="build_popSize" label="Initial Population Size" min="20" max="200" thumb-label="always" :thumb-size="30"></v-slider>
                                    <v-slider v-model="build_maxEvals" label="Max NFE" min="400" max="5000" thumb-label="always" :thumb-size="30" style="margin-top: 5px;"></v-slider>
                                    <v-combobox
                                        :items="this.problem_subscription.objectives"
                                        v-model="objective_ids"
                                        label="Objectives"
                                        item-text="name"
                                        item-value="id"
                                        solo
                                        multiple
                                        small-chips
                                    ></v-combobox>
                                </v-col>
                            </v-row>
                            <v-spacer></v-spacer>
                        </v-container>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-btn :disabled="!can_run_algorithm" elevation="0" color="success" v-on:click="run_algorithm()">Run Algorithm</v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
<!--                        <v-card-actions>-->
<!--                            <v-spacer></v-spacer>-->
<!--                            <v-btn color="warning" elevation="0">Submit</v-btn>-->
<!--                        </v-card-actions>-->
                    </v-card>
                </v-col>

            </v-row>
        </v-container>
    </v-card>
</template>

<script>
    import {ProblemDesignSubscription, CurrentProblemInfoSub} from "../../scripts/subscriptions";
    import {mapState} from "vuex";
    import {sqsClient} from "../../scripts/sqsClient";
    import * as _ from "lodash";
    import {SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand} from "@aws-sdk/client-sqs";

    export default {
        name: "algorithms",
        data: function () {
            return {
                items: [
                    {name: 'GeneticAlgorithm 1', type: 'NSGA-II', id: 1, state: 1, selected: false},
                    {name: 'GeneticAlgorithm 2', type: 'NSGA-II', id: 2, state: 1, selected: true},
                    {name: 'GeneticAlgorithm 3', type: 'NSGA-II', id: 3, state: 1, selected: false},
                    {name: 'GeneticAlgorithm 4', type: 'NSGA-II', id: 4, state: 0, selected: false},
                    {name: 'GeneticAlgorithm 5', type: 'NSGA-II', id: 5, state: 1, selected: false},
                    {name: 'GeneticAlgorithm 6', type: 'NSGA-II', id: 6, state: 1, selected: false},
                    {name: 'GeneticAlgorithm 7', type: 'NSGA-II', id: 7, state: 1, selected: false},
                    {name: 'GeneticAlgorithm 8', type: 'NSGA-II', id: 8, state: 1, selected: false}
                ],
                selected_item: null,


                // --> Problem State
                problem_subscription: {
                    objectives: []
                },

                // --> ALGORITHM BUILDER
                build_id: null,
                build_run_view: false,
                build_type: null,
                build_popSize: 30,
                build_maxEvals: 500,
                build_crossoverProb: null, // uniform
                build_mutationProb: null,  // uniform
                objective_ids: null,




                // --> CONTAINER STORE
                container_store: null,

                // --> CONTAINER INFO
                selected_container: null,
                selected_container_idx: null,
                ping_request_queue: null,
                ping_response_queue: null,
                private_request_queue: null,
                private_response_queue: null,
                container_init_status: null,

                container_algorithms: [],

            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                is_admin: state => state.user.is_admin,
                user_info_id: state => state.user.user_info_id,
                problem_id: state => state.problem.problem_id,
                dataset_id: state => state.problem.dataset_id,
                available_design_evaluators: state => state.services.available_design_evaluators,
                evaluation_queue: state => state.services.evaluation_queue,
                serviceStatus: state => state.services.serviceStatus,
                available_genetic_algorithms: state => state.services.available_genetic_algorithms,
            }),
            can_run_algorithm(){
                // --> Primary condition
                if(this.selected_container === null){
                    return false;
                }
                if(this.available_genetic_algorithms === 0){
                    return false;
                }
                if(this.objective_ids === null){
                    return false;
                }
                if(this.objective_ids.length === 0){
                    return false;
                }
                if(this.selected_container.container.Status !== 'Running'){
                    return false;
                }
                return true;
            },

        },
        methods: {
            async generate_ga_id(){
                let length = 15;
                let result           = '';
                let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let charactersLength = characters.length;
                for ( let i = 0; i < length; i++ ) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            },
            async select_container(container, idx){
                this.selected_container = container;
                this.selected_container_idx = idx;
                this.ping_request_queue = container.PING_REQUEST_QUEUE;
                this.ping_response_queue = container.PING_RESPONSE_QUEUE;
                this.private_request_queue = container.PRIVATE_REQUEST_QUEUE;
                this.private_response_queue = container.PRIVATE_RESPONSE_QUEUE;
                this.container_init_status = container.init_status;

                // --> 1. Ping selected container and get info
                // await this.ping_selected_container();

                // --> 2. Set info in local store

            },
            async ping_selected_container(){
                if(this.selected_container === null){
                    return;
                }

                // --> 1. Send ping message / get response
                await this.send_ping_message();


                // --> 2. Poll for response
                let message = null;
                let attempts = 3;
                let counter = 0;
                while(message === null && counter <= attempts){
                    message = await this.poll_ping_response();
                    counter += 1;
                    await new Promise(r => setTimeout(r, 1000));
                }
                if(counter === attempts){
                    console.log("--> NO RESPONSE", message);
                    return;
                }
                else{
                    console.log('--> GA RESPONSE', message);
                }

                // --> Parse container controller updates
                let controller_json = message['MessageAttributes']['controller']['StringValue'];
                let controller = JSON.parse(JSON.parse(controller_json));

                // --> Parse container algorithm updates
                this.container_algorithms = [];
                let keyset = Object.keys(message['MessageAttributes']);
                let ga_keys = keyset.filter(function (str) { return str.indexOf("GA-") !== -1; })
                console.log('--> GA PING KEYSET', ga_keys);
                for(let x = 0; x < ga_keys.length; x++){
                    let ga_key = ga_keys[x];
                    let algorithm =  JSON.parse(JSON.parse(_.cloneDeep(message['MessageAttributes'][ga_key]['StringValue'])));
                    algorithm.ga_id = ga_key;
                    console.log('--> ALGORITHM ITEM', algorithm);

                    let population = [];
                    for(let y = 0; y < algorithm.population.length; y++){
                        let design = JSON.parse(algorithm.population[y])
                        population.push(design);
                        console.log('--> DESIGN ITEM', design);
                    }
                    algorithm.pop = population;

                    this.container_algorithms.push(algorithm);
                }

                await this.delete_message(message);
            },
            async send_ping_message(){
                console.log('--> SENDING SQS GA PING MESSAGE');
                const command = new SendMessageCommand({
                    QueueUrl: this.ping_request_queue,
                    MessageBody: "boto3",
                    MessageAttributes: {
                        msgType: {
                            DataType: "String",
                            StringValue: "ping"
                        }
                    }
                });
                const response = await sqsClient.send(command);
                console.log('--> SQS RESPONSE', response);
            },
            async poll_ping_response(){
                if(this.ping_response_queue !== null){
                    console.log('--> SENDING SQS GA PING POLL', this.ping_response_queue);
                    const command = new ReceiveMessageCommand({
                        QueueUrl: this.ping_response_queue,
                        MaxNumberOfMessages: 1,
                        WaitTimeSeconds: 5,
                        MessageAttributeNames: ['All']
                    });
                    const response = await sqsClient.send(command);
                    console.log('--> SQS RECEIVE MESSAGE RESPONSE', response);
                    if(response['Messages'] === null){
                        return null;
                    }
                    return response['Messages'][0];
                }
                else{
                    return null;
                }
            },
            async delete_message(message){
                const del_command = new DeleteMessageCommand({
                    QueueUrl: this.ping_response_queue,
                    ReceiptHandle: message['ReceiptHandle']
                });
                const response = await sqsClient.send(del_command);
                console.log('--> SQS DELETE MESSAGE RESPONSE', response);
            },
            async run_algorithm(){
                let id_string = "[";
                for(let x = 0; x < this.objective_ids.length; x++){
                    if(x !== 0){
                        id_string += ", ";
                    }
                    id_string += this.objective_ids[x].id.toString();
                }
                id_string += "]";
                this.build_id = 'GA-' + await this.generate_ga_id()
                console.log('--> SENDING SQS START ALGORITHM METHOD');
                const command = new SendMessageCommand({
                    QueueUrl: this.private_request_queue,
                    MessageBody: "boto3",
                    MessageAttributes: {
                        msgType: {
                            DataType: "String",
                            StringValue: "start_ga"
                        },
                        maxEvals: {
                            DataType: "String",
                            StringValue: this.build_maxEvals.toString()
                        },
                        crossoverProbability: {
                            DataType: "String",
                            StringValue: "1"
                        },
                        mutationProbability: {
                            DataType: "String",
                            StringValue: "0.016666"
                        },
                        problem_id: {
                            DataType: "String",
                            StringValue: this.problem_id.toString()
                        },
                        dataset_id: {
                            DataType: "String",
                            StringValue: this.dataset_id.toString()
                        },
                        user_id: {
                            DataType: "String",
                            StringValue: this.user_info_id.toString()
                        },
                        initialPopSize: {
                            DataType: "String",
                            StringValue: this.build_popSize.toString()
                        },
                        ga_id: {
                            DataType: "String",
                            StringValue: this.build_id
                        },
                        objective_ids: {
                            DataType: "String",
                            StringValue: id_string
                        }
                    }
                });
                const response = await sqsClient.send(command);
                console.log('--> SQS RESPONSE', response);
            },
            async stop_all_container_algorithms(){
                for(let x = 0; x < this.container_algorithms.length; x++){
                    let ga_id = this.container_algorithms[x].ga_id;
                    await this.stop_algorithm(ga_id);
                }
            },
            async stop_algorithm(ga_id){
                const command = new SendMessageCommand({
                    QueueUrl: this.private_request_queue,
                    MessageBody: "boto3",
                    MessageAttributes: {
                        msgType: {
                            DataType: "String",
                            StringValue: "stop_ga"
                        },
                        ga_id: {
                            DataType: "String",
                            StringValue: ga_id
                        },
                    }
                });
                const response = await sqsClient.send(command);
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
                    },
                    skip() {
                        return this.problem_id === null;
                    }
                },
            }
        },
        watch: {
            serviceStatus(){
                this.container_store = _.cloneDeep(this.serviceStatus['comet-algorithm']);

                console.log('--> CONTAINER STORE', this.container_store);
            },
            selected_container() {
                console.log('--> CHANGED SELECTED CONTAINER', this.selected_container);
            },
            container_algorithms() {
                console.log('--> CHANGED CONTAINER ALGORITHMS', this.container_algorithms);
            },
            objective_ids() {
                console.log('--> CHANGED SELECTED IDS', this.objective_ids);
            },
        },
        mounted() {
            this.container_store = _.cloneDeep(this.serviceStatus['comet-algorithm']);
        }

    }
</script>

<style scoped>
.gaSelected {
    background-color: black;
}

.border {
    border: 2px dashed orange;
}

</style>