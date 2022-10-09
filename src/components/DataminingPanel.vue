<template>
    <v-card light width='100%' height='100%' shaped raised>
        <v-card-title>Datamining</v-card-title>
        <v-card-subtitle>Service</v-card-subtitle>
        <v-container style="padding-left: 16px">
                <v-row style="margin: 2px;">
                    <v-btn tile large color="primary" elevation=0 :disabled="processing" v-on:click="restart_datamining"  style="margin: 1px;">Restart</v-btn>
                    <v-btn tile large color="success" elevation=0 :disabled="processing" v-on:click="start_datamining" style="margin: 1px;">Start</v-btn>
                    <v-btn tile large color="error" elevation=0   :disabled="processing" v-on:click="stop_datamining" style="margin: 1px;">Stop</v-btn>
                    <v-btn tile large color="warning" elevation=0 :disabled="processing" v-on:click="build_datamining"  style="margin: 1px;">Build</v-btn>
                </v-row>
                        
                <v-row style="margin-top: 20px; margin-left: 2px; margin-right: 2px;">
                        <v-btn-toggle group mandatory tile mt-0>
                            <v-btn style="margin-left: 0px;" v-on:click="display_output">Output</v-btn>
                            <v-btn style="margin-left: 0px;" v-on:click="display_error">Error</v-btn>
                        </v-btn-toggle>

                        <v-spacer></v-spacer>
                        <v-btn-toggle group mandatory tile mt-0>
                            <v-btn right style="margin-left: 0px;" v-on:click="tail_scroll">Tail</v-btn>
                        </v-btn-toggle>
                </v-row>

                <v-row style="margin-top: 5px; margin-left: 2px; margin-right: 2px;">
                        <template v-if="log_type === 'output'">
                            <v-textarea outlined no-resize rows=20 readonly v-model="standard_output" id="datamining__text_out"></v-textarea>
                        </template>
                        <template v-if="log_type === 'error'">
                            <v-textarea outlined no-resize rows=20 readonly v-model="standard_error" id="datamining__text_err"></v-textarea>
                        </template>

                </v-row>
        </v-container>
    </v-card>
</template>

<script>
    import {fetchGet, fetchPost} from '../scripts/fetch-helpers';
    import { mapState } from 'vuex';

    export default {
        name: 'interface-panel',
        data: function () {
            return {
                shaped_cards: true,
                processing: false,
                log_type: 'output',
                std_output: '',
                std_error: '',
            }
        },
        computed: {
            ...mapState({
                standard_output: state => state.dataminingPanel.standard_output,
                standard_error: state => state.dataminingPanel.standard_error,
                standard_display: state => state.dataminingPanel.standard_display
            }),
        },

        methods: {
            async tail_scroll(){
                if (this.log_type === "output") {
                    let textarea = document.getElementById('datamining__text_out');
                    textarea.scrollTop = textarea.scrollHeight;
                }
                if (this.log_type === "error") {
                    let textarea = document.getElementById('datamining__text_err');
                    textarea.scrollTop = textarea.scrollHeight;
                }
            },

            async display_output(){
                this.log_type = 'output';
            },
            async display_error(){
                this.log_type = 'error';
            },

            async restart_datamining(){
                this.send_daphne_command('datamining', 'restart');
            },
            async start_datamining(){
                this.send_daphne_command('datamining', 'start');
            },
            async stop_datamining(){
                this.send_daphne_command('datamining', 'stop');
            },
            async build_datamining(){
                this.send_daphne_command('datamining', 'build');
            },
            async send_daphne_command(service, command) {
                this.processing = true;
                let reqData = new FormData();
                reqData.append('service', service);
                reqData.append('command', command);
                console.log(reqData);
                let dataResponse = await fetchPost(API_URL + 'logapp/command', reqData);
                console.log(dataResponse);
                console.log(this.standard_output);
                this.processing = false;
            }
        },

        async mounted() {
            console.log("dataminingPanel mounted");
        },

        async beforeDestroy() {
            console.log("dataminingPanel destroyed");
        },


    }
</script>