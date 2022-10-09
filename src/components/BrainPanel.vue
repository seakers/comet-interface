<template>
    <v-card light width='100%' height='100%' shaped raised>
        <v-card-title>Brain</v-card-title>
        <v-card-subtitle>API Gateway</v-card-subtitle>
        <v-container style="padding-left: 16px">
                <v-row style="margin: 2px;">
                    <v-btn tile large color="primary" elevation=0 :disabled="processing" v-on:click="restart_brain"  style="margin: 1px;">Restart</v-btn>
                    <v-btn tile large color="success" elevation=0 :disabled="processing" v-on:click="start_brain" style="margin: 1px;">Start</v-btn>
                    <v-btn tile large color="error" elevation=0   :disabled="processing" v-on:click="stop_brain" style="margin: 1px;">Stop</v-btn>
                    <v-btn tile large color="warning" elevation=0 :disabled="processing" v-on:click="run_webscraper_brain"  style="margin: 1px;">Run Webscraper</v-btn>
                    <v-btn tile large color="lime" elevation=0    :disabled="processing" v-on:click="migrate_database_brain"  style="margin: 1px;">Migrate Database</v-btn>
                    <v-btn tile large color="blue-grey" elevation=0    :disabled="processing" v-on:click="train_brain"  style="margin: 1px;">Train</v-btn>
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
                            <v-textarea outlined no-resize rows=20 readonly v-model="standard_output" id="brain__text_out"></v-textarea>
                        </template>
                        <template v-if="log_type === 'error'">
                            <v-textarea outlined no-resize rows=20 readonly v-model="standard_error" id="brain__text_err"></v-textarea>
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
                standard_output: state => state.brainPanel.standard_output,
                standard_error: state => state.brainPanel.standard_error,
                standard_display: state => state.brainPanel.standard_display
            }),
        },

        methods: {
            async tail_scroll(){
                if (this.log_type === "output") {
                    let textarea = document.getElementById('brain__text_out');
                    textarea.scrollTop = textarea.scrollHeight;
                }
                if (this.log_type === "error") {
                    let textarea = document.getElementById('brain__text_err');
                    textarea.scrollTop = textarea.scrollHeight;
                }
            },

            async display_output(){
                this.log_type = 'output';
            },
            async display_error(){
                this.log_type = 'error';
            },

            async restart_brain(){
                this.send_daphne_command('brain', 'restart');
            },
            async start_brain(){
                this.send_daphne_command('brain', 'start');
            },
            async stop_brain(){
                this.send_daphne_command('brain', 'stop');
            },
            async run_webscraper_brain(){
                this.send_daphne_command('brain', 'index_historian_database');
            },
            async migrate_database_brain(){
                this.send_daphne_command('brain', 'migrate');
            },
            async train_brain(){
                this.send_daphne_command('brain', 'train');
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
            console.log("BrainPanel mounted");
        },

        async beforeDestroy() {
            console.log("BrainPanel destroyed");
        },


    }
</script>