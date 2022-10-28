<template>
    <v-container style="padding: 0px 18px 0px 18px; margin-left: 0; margin-right: 0"  class="secondary darken-2">
        <v-row justify="center" style="padding-top: 20px;">
            <v-col cols="12">
                <v-card>
                    <v-card-title>Services</v-card-title>
                    <v-card-subtitle>Last Ping: {{get_time_elapsed()}}</v-card-subtitle>

                    <v-container>

                        <!--TABS / ACTIONS-->
                        <v-row>
                            <v-col cols="9">
                                <v-tabs v-model="tab">
                                    <v-tab>Design Evaluator ({{currentStatus['comet-evaluator'].length}})</v-tab>
                                    <v-tab>Genetic Algorithm ({{currentStatus['comet-algorithm'].length}})</v-tab>
                                </v-tabs>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col>
                                <v-menu offset-y>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn color="primary" dark v-bind="attrs" v-on="on">
                                            Actions
                                            <v-icon dark>
                                                mdi-menu-down
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item v-on:click="stop_instance()" :disabled="cant_stop_instances" dense><v-list-item-title>Stop Instance</v-list-item-title></v-list-item>
                                        <v-list-item v-on:click="start_instance()" :disabled="cant_start_instances" dense><v-list-item-title>Start Instance</v-list-item-title></v-list-item>
                                        <v-divider></v-divider>
                                        <v-list-item v-on:click="run_container()" :disabled="cant_run_container" dense><v-list-item-title>Run Container</v-list-item-title></v-list-item>
                                        <v-list-item v-on:click="stop_container()" :disabled="cant_stop_container" dense><v-list-item-title>Stop Container</v-list-item-title></v-list-item>
                                        <v-list-item v-on:click="update_container()" :disabled="cant_run_container" dense><v-list-item-title>Update Container</v-list-item-title></v-list-item>
                                        <v-divider></v-divider>
                                        <div v-if="tab === 0">
                                            <v-list-item v-on:click="build_vassar()" :disabled="cant_msg_vassar" dense><v-list-item-title>Build Evaluator</v-list-item-title></v-list-item>
                                        </div>
                                        <div v-if="tab === 1">
                                            <v-list-item v-on:click="start_ga()" :disabled="cant_start_ga" dense><v-list-item-title>Start GA</v-list-item-title></v-list-item>
                                            <v-list-item v-on:click="stop_ga()" :disabled="cant_stop_ga" dense><v-list-item-title>Stop GA</v-list-item-title></v-list-item>
                                        </div>
                                    </v-list>
                                </v-menu>
                            </v-col>
                        </v-row>

                        <!--INSTANCES-->
                        <v-row>
                            <v-col cols="12">
                                <template>
                                    <v-simple-table>
                                        <template v-slot:default>
                                            <thead>
                                            <tr>
                                                <th colspan="6" scope="colgroup" style="text-align: center; font-weight: normal; font-size: 17px;">EC2 Instance</th>
                                                <th colspan="3" scope="colgroup" style="text-align: center; font-weight: normal; font-size: 17px;">Docker Container</th>
                                            </tr>
                                            <tr>
                                                <th><v-checkbox v-model="selectAll" :disabled="cant_select_all"></v-checkbox></th>
                                                <th>Identifier</th>
                                                <th>Ipv4</th>
                                                <th>State</th>
                                                <th>Status</th>
                                                <th>SSM Status</th>

                                                <th>Status</th>
                                                <th v-if="tab === 0">Evaluator</th>
                                                <th v-if="tab === 1">Algorithm</th>
                                                <th >Problem</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(container, idx) in tab_instances">
                                                    <td>
                                                        <div v-if="container['init_status'] === 'INITIALIZING'">
                                                            <v-progress-circular indeterminate></v-progress-circular>
                                                        </div>
                                                        <div v-if="container['init_status'] !== 'INITIALIZING'">
                                                            <v-checkbox v-model="container['selected']" v-if="container['busy'] === false"></v-checkbox>
                                                            <v-progress-circular indeterminate v-if="container['busy'] === true"></v-progress-circular>
                                                        </div>
                                                    </td>
                                                    <td>{{ container['instance']['IDENTIFIER'] }}</td>
                                                    <td>{{ container['instance']['Ipv4'] }}</td>
                                                    <td>{{ container['instance']['State'] }}</td>
                                                    <td>{{ container['instance']['Status'] }}</td>
                                                    <td>{{ container['instance']['SSMStatus'] }}</td>
                                                    <td>{{container['container']['Status']}}</td>
                                                    <td>{{container['container']['VassarStatus']}}</td>
                                                    <td>{{get_container_problem(container['container']['PROBLEM_ID'])}}</td>
                                                </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                </template>
                            </v-col>
                        </v-row>

                        <!--BUTTONS: CLOSE / RELOAD-->
                        <v-row>
                            <v-col>
                                <v-btn color="primary" to="/"><v-icon style="margin-left: -7px; margin-right: 3px;" dark small>mdi-arrow-left</v-icon>Back</v-btn>
                                <v-btn color="primary" v-on:click="send_ping" :disabled="refreshCount !== 0">
                                    <div v-if="refreshCount !== 0">{{ refreshCount }}</div>
                                    <div v-if="refreshCount === 0">Refresh</div>
                                </v-btn>
                            </v-col>
                        </v-row>

                    </v-container>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import {wsTools} from "../../scripts/websocket-tools";
    import {AllProblemsQuery} from "../../scripts/queries";
    import Vue from "vue";
    import * as _ from "lodash";

    export default {
        name: "service-page",
        data: function () {
            return {
                tab: null,
                tabs: ['Design Evaluator', 'Genetic Algorithm'],

                // --> Resource Info
                currentStatus: {
                    'comet-evaluator': [],
                    'comet-algorithm': []
                },

                // --> Request Ledger
                request_ledger: {},

                // --> Queries
                Problem: [],

                // --> Action Dropdown
                selectAll: false,
                isDropdownActive: false,

                // --> Timers
                lastUpdateCountMax: 36000,
                lastUpdateCount: 36000,
                lastUpdateCountTimer: null,

                refreshCount: 0,
                refreshCountTimer: null,

                actionCount: 0,
                actionCountTimer: null,
            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                user_info_id: state => state.user.user_info_id,
            }),
            ...mapGetters({
                serviceStatus: 'getServiceStatus',
                requestId: 'getRequestId',
                requestResults: 'getRequestResults'
            }),

            // --> Action Logic
            cant_start_instances(){
                // 1. A selection must be made
                // 2. Every selection must be in the 'stopped' state
                if(this.selected_instances.length === 0){
                    return true;
                }
                for(let x = 0; x < this.selected_instances.length; x++) {
                    let resource = this.selected_instances[x];
                    let state = resource['instance']['State'];
                    if(state !== 'stopped'){
                        return true;
                    }
                    if(resource['busy'] === true){
                        return true;
                    }
                }
                return false
            },
            cant_stop_instances(){
                // 1. A selection must be made
                // 2. Every selection must be in the 'running' state
                if(this.selected_instances.length === 0){
                    return true;
                }
                for(let x = 0; x < this.selected_instances.length; x++) {
                    let resource = this.selected_instances[x];
                    let state = resource['instance']['State'];
                    if(state !== 'running'){
                        return true;
                    }
                    if(resource['busy'] === true){
                        return true;
                    }
                }
                return false
            },
            cant_run_container(){
                // 1. A selection must be made
                // 2. SSM Status must be 'Online' for each selection
                // 3. Container ping obj must be empty
                if(this.selected_instances.length === 0){
                    return true;
                }
                for(let x = 0; x < this.selected_instances.length; x++) {
                    let resource = this.selected_instances[x];
                    if(resource['instance']['SSMStatus'] !== 'Online'){
                        return true;
                    }
                    if(resource['container']['Status'] === 'Running'){
                        return true;
                    }
                    if(resource['busy'] === true){
                        return true;
                    }
                }
                return false;
            },
            cant_stop_container(){
                // 1. A selection must be made
                // 2. SSM Status must be 'Online' for each selection
                if(this.selected_instances.length === 0){
                    return true;
                }
                for(let x = 0; x < this.selected_instances.length; x++) {
                    let resource = this.selected_instances[x];
                    let ssm_status = resource['instance']['SSMStatus'];
                    if(ssm_status !== 'Online'){
                        return true;
                    }
                    if(resource['container']['Status'] !== 'Running'){
                        return true;
                    }
                    if(resource['busy'] === true){
                        return true;
                    }
                }
                return false;
            },
            cant_msg_vassar(){
                return this.cant_stop_container;
            },
            cant_start_ga(){
                if(this.selected_instances.length === 0){
                    return true;
                }
                for(let x = 0; x < this.selected_instances.length; x++) {
                    let resource = this.selected_instances[x];
                    let ssm_status = resource['instance']['SSMStatus'];
                    if(ssm_status !== 'Online'){
                        return true;
                    }
                    if(resource['container']['Status'] !== 'Running'){
                        return true;
                    }
                    if(resource['container']['VassarStatus'] !== 'READY'){
                        return true;
                    }
                    if(resource['busy'] === true){
                        return true;
                    }
                }
                return false;
            },
            cant_stop_ga(){
                if(this.selected_instances.length === 0){
                    return true;
                }
                for(let x = 0; x < this.selected_instances.length; x++) {
                    let resource = this.selected_instances[x];
                    let ssm_status = resource['instance']['SSMStatus'];
                    if(ssm_status !== 'Online'){
                        return true;
                    }
                    if(resource['container']['Status'] !== 'Running'){
                        return true;
                    }
                    if(resource['container']['VassarStatus'] !== 'RUNNING'){
                        return true;
                    }
                    if(resource['busy'] === true){
                        return true;
                    }
                }
                return false;
            },
            cant_select_all(){
                let numKeys = Object.keys(this.request_ledger).length;
                return numKeys !== 0;
            },

            // --> All / Selected Instances Computed
            all_instances(){
                let vassar_containers = this.currentStatus['comet-evaluator'];
                let ga_containers = this.currentStatus['comet-algorithm'];
                if(vassar_containers.length === 0 && ga_containers.length === 0){
                    return [];
                }
                return vassar_containers.concat(ga_containers)
            },
            tab_instances(){
                if(this.tab === 0){
                    return this.currentStatus['comet-evaluator']
                }
                else{
                    return this.currentStatus['comet-algorithm']
                }
            },
            selected_instances(){
                let instances = [];
                for(let x = 0; x < this.tab_instances.length; x++){
                    let instance = this.tab_instances[x];
                    if(instance['selected'] === true){
                        instances.push(instance)
                    }
                }
                return instances;
            },
            selected_instance_ids(){
                let selections = {
                    'comet-evaluator': [],
                    'comet-algorithm': []
                };
                for(let x = 0; x < this.selected_instances.length; x++){
                    let resource = this.selected_instances[x];
                    if(resource['type'] === 'comet-evaluator'){
                        selections['comet-evaluator'].push(resource['instance']['IDENTIFIER']);
                    }
                    else{
                        selections['comet-algorithm'].push(resource['instance']['IDENTIFIER']);
                    }
                }
                return selections;
            },
        },
        methods: {

            // --> All / Selected Instances Getters
            get_all_instances(){
                let vassar_containers = this.currentStatus['comet-evaluator'];
                let ga_containers = this.currentStatus['comet-algorithm'];
                return vassar_containers.concat(ga_containers)
            },
            get_selected_instances(){
                let all_instances = this.get_all_instances();
                let selected_instances = [];
                for(let x = 0; x < all_instances.length; x++){
                    let instance = all_instances[x];
                    if(instance['selected'] === true){
                        selected_instances.push(instance)
                    }
                }
                return selected_instances;
            },
            get_selected_instance_ids(){
                let selections = {
                    'comet-evaluator': [],
                    'comet-algorithm': []
                };
                let selected_instances = this.get_selected_instances();
                for(let x = 0; x < selected_instances.length; x++){
                    let resource = selected_instances[x];
                    if(resource['type'] === 'comet-evaluator'){
                        selections['comet-evaluator'].push(resource['instance']['IDENTIFIER']);
                    }
                    else{
                        selections['comet-algorithm'].push(resource['instance']['IDENTIFIER']);
                    }
                }
                return selections;
            },
            get_display_title(){
                if(this.tab === 0){
                    return 'Design Evaluator Instances';
                }
                else if(this.tab === 1){
                    return 'Genetic Algorithm Instances';
                }
                return '';
            },

            // --> Modal Control
            send_ping(){
                this.set_refresh_counter(5);
                wsTools.websocket.send(JSON.stringify({msg_type: "ping_services"}));
            },
            reload_module(){
                console.log("--> RELOAD", this.serviceStatus);
                this.$apollo.queries.Problem.refetch();
                let vassar_containers = _.cloneDeep(this.serviceStatus['comet-evaluator']);
                let ga_containers = _.cloneDeep(this.serviceStatus['comet-algorithm']);
                // --> Compare function
                function compare(a, b) {
                    if ( a['instance']['IDENTIFIER'] < b['instance']['IDENTIFIER'] ){
                        return -1;
                    }
                    if ( a['instance']['IDENTIFIER'] > b['instance']['IDENTIFIER'] ){
                        return 1;
                    }
                    return 0;
                }
                vassar_containers.sort(compare);
                ga_containers.sort(compare);


                for(let x = 0; x < vassar_containers.length; x++){
                    let resource = vassar_containers[x]
                    let identifier = resource['instance']['IDENTIFIER']
                    resource['type'] = 'comet-evaluator'
                    resource['selected'] = false;
                    resource['busy'] = this.is_instance_busy(identifier);
                }


                for(let x = 0; x < ga_containers.length; x++){
                    let resource = ga_containers[x]
                    let identifier = resource['instance']['IDENTIFIER']
                    resource['type'] = 'comet-algorithm'
                    resource['selected'] = false;
                    resource['busy'] = this.is_instance_busy(identifier);
                }

                this.currentStatus = {
                    'comet-evaluator': vassar_containers,
                    'comet-algorithm': ga_containers
                };
                this.selectAll = false;
            },
            get_instance(identifier){
                let vassar_containers = this.currentStatus['comet-evaluator'];
                for(let x = 0; x < vassar_containers.length; x++){
                    if(vassar_containers[x]['instance']['IDENTIFIER'] === identifier){
                        return vassar_containers[x]
                    }
                }
                let ga_containers = this.currentStatus['comet-algorithm'];
                for(let x = 0; x < ga_containers.length; x++){
                    if(ga_containers[x]['instance']['IDENTIFIER'] === identifier){
                        return ga_containers[x]
                    }
                }
                return null;
            },
            is_instance_busy(identifier){
                let instance = this.get_instance(identifier)
                if(instance === null){
                    return false;
                }
                else{
                    return instance['busy'];
                }
            },
            is_instance_initializing(identifier){
                let instance = this.get_instance(identifier)
                if(instance === null){
                    return false;
                }
                else{
                    return instance['init_status'] === 'INITIALIZING';
                }
            },

            // --> Modal Content
            get_container_problem(problem_id){
                if(problem_id === 'error'){
                    return 'Offline';
                }
                else{
                    return this.get_problem_name(problem_id);
                }
            },
            get_problem_name(problem_id){
                if(problem_id !== "Booting" && problem_id !== "Offline"){
                    for(let x = 0; x < this.Problem.length; x++){
                        if(this.Problem[x].id === parseInt(problem_id)){
                            return this.Problem[x].name;
                        }
                    }
                }
                else{
                    return problem_id;
                }
                return "-----";
            },
            get_time_elapsed(){
                let time = 36000 - this.lastUpdateCount;
                let hours = Math.floor(time / 3600);
                let minutes = Math.floor(time / 60);
                let seconds = time - minutes * 60;
                return (hours + " (hr) - " + minutes + " (min) - " + seconds + " (sec)");
            },

            // --> Action Methods
            start_instance(){
                this.resource_msg('start_instance', 15);
                this.set_selected_instances_busy();
            },
            stop_instance(){
                this.resource_msg('stop_instance', 15);
                this.set_selected_instances_busy();
            },
            run_container(){
                this.resource_msg('run_container', 15);
                this.set_selected_instances_busy();
            },
            stop_container(){
                this.resource_msg('stop_container', 15);
                this.set_selected_instances_busy();
            },
            update_container(){
                this.resource_msg('update_container', 15);
                this.set_selected_instances_busy();
            },
            build_vassar(){
                this.resource_msg('build_vassar', 15);
                this.set_selected_instances_busy();
            },
            start_ga(){
                this.resource_msg('start_ga', 15);
                this.set_selected_instances_busy();
            },
            stop_ga(){
                this.resource_msg('stop_ga', 15);
                this.set_selected_instances_busy();
            },

            // --> Action Methods Helpers
            resource_msg(command, timeout){

                // --> Set action timeout
                this.set_action_counter(timeout);

                // --> 1. Generate request
                let request_id = this.generate_msg_id();
                let instance_ids = _.cloneDeep(this.selected_instance_ids);

                // --> 2. Send request
                console.log('--> RESOURCE REQUEST', request_id, command, instance_ids);
                wsTools.websocket.send(JSON.stringify({msg_type: "resource_msg", command: command, instance_ids: instance_ids, request_id: request_id}));

                // --> 3. Store in ledger
                Vue.set(this.request_ledger, request_id, {
                    exec_time: new Date().getTime() / 1000,
                    instance_ids: instance_ids,
                    command: command
                });

                // --> Clear all selections
                this.selectAll = false;
            },
            generate_msg_id(){
                let length = 15;
                let result           = '';
                let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let charactersLength = characters.length;
                for ( let i = 0; i < length; i++ ) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            },
            set_selected_instances_busy(){
                let instances = this.get_selected_instances();
                for(let x = 0; x < instances.length; x++){
                    instances[x]['busy'] = true;
                    instances[x]['selected'] = false;
                }
            },
            set_instances_ready(identifiers){
                let vassar_containers = this.currentStatus['comet-evaluator'];
                for(let x = 0; x < vassar_containers.length; x++){
                    if(identifiers.includes(vassar_containers[x]['instance']['IDENTIFIER'])){
                        vassar_containers[x]['busy'] = false;
                    }
                }
                let ga_containers = this.currentStatus['comet-algorithm'];
                for(let x = 0; x < ga_containers.length; x++){
                    if(identifiers.includes(ga_containers[x]['instance']['IDENTIFIER'])){
                        ga_containers[x]['busy'] = false;
                    }
                }
            },
            resource_msg_response(request_id, result) {

                // --> 1. Set Instances Ready
                let vassar_containers = result['comet-evaluator'];
                let ga_containers = result['comet-algorithm'];
                let all_instances = vassar_containers.concat(ga_containers);
                let all_identifiers = []
                for(let x = 0; x < all_instances.length; x++){
                    let result = all_instances[x]['result'];
                    all_identifiers.push(all_instances[x]['identifier']);
                }
                this.set_instances_ready(all_identifiers);

                // --> 2. Remove request from ledger
                if(request_id in this.request_ledger){
                    // delete this.request_ledger[request_id];
                    Vue.delete(this.request_ledger, request_id);
                }

                // --> 3. Send ping
                this.send_ping();
            },


            // --> Timers
            reset_update_counter(){
                if(this.lastUpdateCountTimer !== null){
                    clearTimeout(this.lastUpdateCountTimer);
                }
                this.lastUpdateCount = this.lastUpdateCountMax;
            },
            set_refresh_counter(time){
                if(this.refreshCountTimer !== null){
                    clearTimeout(this.refreshCountTimer);
                }
                this.refreshCount = time;
            },
            set_action_counter(time) {
                if(this.actionCountTimer !== null){
                    clearTimeout(this.actionCountTimer);
                }
                this.actionCount = time;
                this.isDropdownActive = false;
            },
        },
        watch: {

            // --> Triggered by service ping, resource_msg
            serviceStatus() {
                this.reset_update_counter();
                this.set_refresh_counter(0);
                this.reload_module();
            },
            requestId(){
                if(this.requestId === null){
                    return;
                }
                console.log('--> RESOURCE RESPONSE', this.requestId);
                console.log(this.requestResults);

                // --> Handle response on a 3 sec timeout
                let request_id = _.cloneDeep(this.requestId);
                let results = _.cloneDeep(this.requestResults);
                setTimeout(() => this.resource_msg_response(request_id, results), 5000);
            },

            // --> Select All
            tab(){
                this.selectAll = false;
                let instances = this.get_all_instances();
                for(let x = 0; x < instances.length; x++){
                    let instance = instances[x];
                    instance['selected'] = false;
                }
            },
            selectAll(){
                let instances = [];
                if(this.tab === 0){
                    instances = this.currentStatus['comet-evaluator']
                }
                else if(this.tab === 1){
                    instances = this.currentStatus['comet-algorithm']
                }
                for(let x = 0; x < instances.length; x++){
                    let instance = instances[x];
                    if(instance['busy'] === false){
                        instance['selected'] = this.selectAll;
                    }
                }
            },

            // --> Timers
            lastUpdateCount: {
                handler(value) {
                    if (value > 0) {
                        this.lastUpdateCountTimer = setTimeout(() => {
                            this.lastUpdateCount--;
                        }, 1300);
                    }
                },
                immediate: true // This ensures the watcher is triggered upon creation
            },
            refreshCount: {
                handler(value) {
                    if (value > 0) {
                        this.refreshCountTimer = setTimeout(() => {
                            this.refreshCount--;
                        }, 1300);
                    }
                },
                immediate: true // This ensures the watcher is triggered upon creation
            },
            actionCount: {
                handler(value) {
                    if (value > 0) {
                        this.actionCountTimer = setTimeout(() => {
                            this.actionCount--;
                        }, 1300);
                    }
                },
                immediate: true
            }
        },
        apollo: {
            Problem: {
                query: AllProblemsQuery,
            },
        },
        async mounted() {
            console.log('--> MOUNTING SERVICE PAGE');
            if(wsTools.websocket === null){
                await wsTools.wsConnect(this.$store);
                this.send_ping();
            }
            this.reload_module();
        }
    }
</script>

<style scoped>

</style>