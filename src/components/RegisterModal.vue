<template>
    <v-container>

        <v-snackbar v-model="error_noti" timeout="5000" color="error" elevation="24">
            Invalid credentials
            <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="error_noti = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>

        <!--REGISTER CARD-->
        <v-card
            width="450"
            loader-height="6"
            :loading="register_loading"
            light
        >
            <v-card-title>Register</v-card-title>
            <v-card-text>
                <v-form>
                    <v-text-field v-model="username" label="Username" clearable outlined :rules="field_rules"></v-text-field>
                    <v-text-field v-model="email" label="Email" clearable outlined :rules="field_rules"></v-text-field>
                    <v-text-field v-model="password1" label="Password" clearable outlined :rules="field_rules"></v-text-field>
                    <v-text-field v-model="password2" label="Repeat Password" clearable outlined :rules="field_rules"></v-text-field>
                </v-form>
                <v-row>
                    <v-col>
                        <v-btn color="success" :disabled="invalid_input" v-on:click="register()">Register</v-btn>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col>
                        <v-btn color="success" v-on:click="login_modal()">Go To Login</v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>



    </v-container>
</template>

<script>
    import {fetchPost} from "../scripts/fetch-helpers";
    export default {
        name: "register-modal",
        data: function () {
            return {
                username: '',
                email: '',
                password1: '',
                password2: '',
                field_rules: [v => (v && v.length > 0) || 'field must not be empty'],
                register_loading: false,
                error_noti: false
            }
        },
        computed: {
            invalid_input(){
                return this.username === '' || this.password1 === '' || this.password2 === '' || this.email === '' || this.password1 !== this.password2;
            }
        },
        methods: {
            async register(){
                this.register_loading = 'success';
                this.error_noti = false;
                console.log('--> REGISTERING');

                let reqData = new FormData();
                reqData.append("username", this.username);
                reqData.append("email", this.email);
                reqData.append("password1", this.password1);
                reqData.append("password2", this.password2);
                let dataResponse = await fetchPost(API_URL + 'auth/register', reqData);

                if (dataResponse.ok) {
                    let data = await dataResponse.json();
                    if (data['status'] === 'logged_in') {
                        await this.$store.dispatch('initialize');
                    }
                    else {
                        this.error_noti = true;
                    }
                }
                else {
                    console.error('Registration error');
                }
                this.register_loading = false;
            },
            async login_modal(){
                await this.$store.commit('set_register_overlay', false);
                await this.$store.commit('set_login_overlay', true);
            }
        },
        watch: {

        },
        async mounted(){
            console.log('--> MOUNTING LOGIN MODAL')
        }
    }
</script>






<style scoped>

</style>