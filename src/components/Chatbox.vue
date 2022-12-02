<template>
    <v-container>

        <!-- HEADER-->
        <v-list-item class="white--text">
            <v-list-item-content>
                <v-list-item-title class="text-h6">
                    <span>Virtual Assistant</span>

                    <!--SETTINGS-->
<!--                    <v-menu bottom left>-->
<!--                        <template v-slot:activator="{ on, attrs }">-->
<!--                            <v-btn dark icon v-bind="attrs" v-on="on" style="float: right" height="24"-->
<!--                                   :class="{ 'yellow&#45;&#45;text': recommender_status }"-->
<!--                            >-->
<!--                                <v-icon>mdi-cog</v-icon>-->
<!--                            </v-btn>-->
<!--                        </template>-->
<!--                        <v-list>-->
<!--                            <v-list-item-group v-model="settings" multiple active-class="">-->
<!--                                <v-list-item>-->
<!--                                    <template v-slot:default="{ active }">-->
<!--                                        <v-list-item-action>-->
<!--                                            <v-checkbox :input-value="active"></v-checkbox>-->
<!--                                        </v-list-item-action>-->

<!--                                        <v-list-item-content>-->
<!--                                            <v-list-item-title>Recommender</v-list-item-title>-->
<!--                                        </v-list-item-content>-->
<!--                                    </template>-->
<!--                                </v-list-item>-->
<!--                            </v-list-item-group>-->
<!--                        </v-list>-->
<!--                    </v-menu>-->
                </v-list-item-title>

                <v-list-item-subtitle class="white--text">
                    Dialogue History
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-divider class="white" style="margin-top: 5px;"></v-divider>


        <!-- MESSAGES-->
        <v-container fluid style="padding-bottom: 75px;">
            <v-row dense>
                <v-slide-y-reverse-transition group>

                    <v-col v-for="(item, idx) in messages" :key="idx" cols="12" style="padding-top: 6px; padding-bottom: 6px;">
                        <v-card :style="get_message_style(item.message_writer)">
                            <v-card-title style="padding-top: 10px; padding-bottom: 4px;" class="text-subtitle-2">
                                <div v-if="item.message_writer === 'User'">{{username}}</div>
                                <div v-if="item.message_writer !== 'User'">{{ item.message_writer }}</div>
                                <div v-if="item.loading === true">
                                    <div style="margin-top: -4px; padding-left: 5px;">
                                        <v-progress-circular color="#ff8200" width="2" size="14" indeterminate></v-progress-circular>
                                    </div>
                                </div>


                                <div v-if="item.loading === false">
                                    <div v-if="item.response_error === true">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn icon left x-small elevation="0" style="margin-top: -4px;" v-bind="attrs" v-on="on">
                                                    <v-icon color="red">mdi-alert</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>{{item.date}}</span>
                                        </v-tooltip>
                                    </div>
                                    <div v-if="item.response_error === false">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn icon left x-small elevation="0" style="margin-top: -4px;" v-bind="attrs" v-on="on">
                                                    <v-icon color="green">mdi-check-bold</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>{{item.date}}</span>
                                        </v-tooltip>
                                    </div>
                                </div>



                                <v-btn icon right absolute x-small elevation="0" v-on:click="set_message_hidden_status(item.id, true)">
                                    <v-icon color="analogous2">mdi-close</v-icon>
                                </v-btn>
                            </v-card-title>

                            <v-card-text style="padding-bottom: 10px;">
                                {{ item.message }}
                            </v-card-text>

                            <!--ADDITIONAL INFO DROPDOWN-->
                            <v-divider v-if="item.more_info !== null" style="margin-top: 0; margin-bottom: 0;"></v-divider>
                            <v-card-actions v-if="item.more_info !== null" style="padding-top: 8px; padding-left: 16px;">
                                <span class="text-subtitle-2">Full Report</span>
                                <v-spacer></v-spacer>
                                <v-btn icon @click="item.show_more_info = !item.show_more_info">
                                    <v-icon>{{ item.show_more_info ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                                </v-btn>
                            </v-card-actions>

                            <!--ADDITIONAL INFO-->
                            <v-expand-transition v-if="item.more_info !== null">
                                <div v-show="item.show_more_info">
                                    <v-divider style="margin: 0;"></v-divider>
                                    <v-card-text style="padding-top: 0; padding-left: 0; padding-right: 0;">
                                        <p style="padding: 16px;">{{item.more_info}}</p>




                                        <!--DESIGN COMPARISON-->


<!--                                        <v-list dense>-->
<!--                                            <v-list-group v-for="(module, idx) in JSON.parse(JSON.stringify(item.more_info))" :key="idx" :value="false">-->
<!--                                                &lt;!&ndash;LEARNING MODULE&ndash;&gt;-->
<!--                                                <template v-slot:activator>-->
<!--                                                    <v-list-item-content>-->
<!--                                                        <v-list-item-title>-->
<!--                                                            {{module.name}}-->
<!--                                                        </v-list-item-title>-->
<!--                                                        <v-list-item-subtitle>{{(module.confidence * 100).toFixed(1)}}%</v-list-item-subtitle>-->
<!--                                                    </v-list-item-content>-->
<!--                                                </template>-->

<!--                                                &lt;!&ndash;SLIDE&ndash;&gt;-->
<!--                                                <v-list-item v-for="(slide, idx_s) in module.slides.slice(0, 5)" :key="idx_s">-->


<!--                                                    <v-container>-->
<!--                                                        <v-row>-->
<!--                                                            <v-col cols="10">-->
<!--                                                                <v-list-item-title>-->
<!--                                                                    Slide {{slide.id}}-->
<!--                                                                    <v-progress-linear :value="slide.confidence * 100" rounded color="analogous2"></v-progress-linear>-->
<!--                                                                </v-list-item-title>-->
<!--                                                            </v-col>-->
<!--                                                            <v-col cols="2">-->
<!--                                                                <v-tooltip bottom>-->
<!--                                                                    <template v-slot:activator="{ on, attrs }">-->
<!--                                                                        <v-btn icon small color="success" v-bind="attrs" v-on="on" @click="go_to_slide(module, slide)">-->
<!--                                                                            <v-icon>mdi-arrow-right-bold</v-icon>-->
<!--                                                                        </v-btn>-->
<!--                                                                    </template>-->
<!--                                                                    <span>Go to slide</span>-->
<!--                                                                </v-tooltip>-->
<!--                                                            </v-col>-->
<!--                                                        </v-row>-->
<!--                                                    </v-container>-->

<!--                                                    &lt;!&ndash;                                                    <v-list-item-content>&ndash;&gt;-->
<!--                                                    &lt;!&ndash;                                                        <v-list-item-title>&ndash;&gt;-->

<!--                                                    &lt;!&ndash;                                                            Slide {{slide.id}}&ndash;&gt;-->
<!--                                                    &lt;!&ndash;                                                            <v-progress-linear :value="slide.confidence * 100" rounded></v-progress-linear>&ndash;&gt;-->


<!--                                                    &lt;!&ndash;                                                        </v-list-item-title>&ndash;&gt;-->
<!--                                                    &lt;!&ndash;                                                    </v-list-item-content>&ndash;&gt;-->
<!--                                                </v-list-item>-->

<!--                                            </v-list-group>-->
<!--                                        </v-list>-->


                                    </v-card-text>
                                </div>
                            </v-expand-transition>

                        </v-card>
                    </v-col>

                </v-slide-y-reverse-transition>
            </v-row>
        </v-container>


        <!-- FOOTER -->
        <v-footer fixed color="primary lighten-1" height="90">
            <v-container>
                <v-row no-gutters>
                    <v-col class="text-center white--text" cols="12">
                        <v-text-field
                            v-model="user_message"
                            outlined
                            append-icon="mdi-send"
                            background-color="white"
                            v-on:click:append="send_user_message()"
                            @keydown.enter="send_user_message()"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-container>
        </v-footer>



    </v-container>
</template>

<script>
    import {fetchPost} from "../scripts/fetch-helpers";
    import {mapState} from "vuex";
    import {MessageSubscription} from "../scripts/subscriptions";
    import { SetMessageHiddenStatus, InsertMessage, SetMessageLoadingStatus, SetMessageErrorStatus } from "../scripts/queries";

    export default {
        name: "chatbox",
        data: function (){
            return {
                messages_db: null,
                messages: [],
                user_message: '',
            }
        },
        computed: {
            ...mapState({
                user_info_id: state => state.user.user_info_id,
                username: state => state.user.username,
                email: state => state.user.email,
                chatbox: state => state.user.chatbox,
            }),
        },
        methods: {
            get_message_style(type){
                if(type === 'User'){
                    return 'border-radius: 20px 20px 20px 4px; margin-right: 40px;'
                }
                return 'border-radius: 20px 20px 4px 20px; margin-left: 40px;'
            },

            async send_user_message(){
                console.log('--> SENDING MESSAGE');

                // --> 1. Insert user message in database
                let msg_id = await this.insert_user_message()

                // --> 2. Send request to brain
                let request_data = new FormData();
                request_data.append('command', this.user_message);
                let data_response = await fetchPost(API_URL + 'assistant/command', request_data);
                if (data_response.ok) {
                    let data = await data_response.json();
                    if(data['response_status'] === 'error'){
                        await this.set_message_error_status(msg_id, true);
                    }
                }
                else {
                    await this.set_message_error_status(msg_id, true);
                }
                await this.set_message_loading_status(msg_id, false);

                // --> 3. Reset message field to empty
                this.user_message = '';
            },
            async insert_user_message(){
                let mutation = await this.$apollo.mutate({
                    mutation: InsertMessage,
                    variables: {
                        user_info_id: this.user_info_id,
                        message_writer: 'User',
                        message_type: 'textual',
                        message: this.user_message,
                        more_info: null,
                    },
                    update: (cache, { data: { result } }) => {},
                });
                let msg_id = mutation.data.result.id;
                console.log('--> INSERTED MESSAGE ID', msg_id);
                return msg_id;
            },

            async set_message_hidden_status(msg_id, hidden_status){
                console.log('--> CLEARING MESSAGE', msg_id);
                let mutation = await this.$apollo.mutate({
                    mutation: SetMessageHiddenStatus,
                    variables: {
                        message_id: msg_id,
                        hidden: hidden_status
                    },
                    update: (cache, { data: { result } }) => {},
                });
            },
            async set_message_loading_status(msg_id, loading_status){
                let mutation = await this.$apollo.mutate({
                    mutation: SetMessageLoadingStatus,
                    variables: {
                        message_id: msg_id,
                        loading: loading_status
                    },
                    update: (cache, { data: { result } }) => {},
                });
                console.log('--> LOADING STATUS', mutation);
            },
            async set_message_error_status(msg_id, response_error){
                let mutation = await this.$apollo.mutate({
                    mutation: SetMessageErrorStatus,
                    variables: {
                        message_id: msg_id,
                        response_error: response_error
                    },
                    update: (cache, { data: { result } }) => {},
                });
                console.log('--> ERROR STATUS', mutation);
            }
        },
        watch: {
            messages() {
                // --> Scroll to the bottom of the message window
                console.log('--> SCROLLING DOWN');
                // let cmessage = this.$el.querySelector('#cmessage')
            }
        },
        apollo: {
            $subscribe: {
                messages_db: {
                    deep: true,
                    query: MessageSubscription,
                    variables() {
                        return {
                            user_info_id: this.user_info_id
                        }
                    },
                    result(result){
                        console.log('--> MESSAGE:', result);
                        let messages = result.data.messages_db;

                        // --> 1. Calculate number of new messages
                        if(this.chatbox === false){
                            let num_new = messages.length - this.messages.length;
                            this.$store.commit('add_new_messages', num_new);
                        }
                        else{
                            this.$store.commit('set_new_messages', 0);
                        }

                        // --> 2. Copy over messages
                        for(let x = 0; x < messages.length; x++){
                            messages[x].date = (new Date(Date.parse(messages[x].date))).toLocaleString();
                            if(messages[x].more_info !== null){
                                messages[x].more_info = JSON.parse(messages[x].more_info)
                                messages[x].more_info_str = JSON.stringify(messages[x].more_info);
                                messages[x].show_more_info = false;
                            }
                        }
                        this.messages = messages;
                    },
                    skip() {
                        return (this.user_info_id === null);
                    },
                }
            }
        }
    }
</script>

<style scoped>

</style>