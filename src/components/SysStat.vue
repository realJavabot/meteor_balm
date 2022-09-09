<script>
import Dropdown from './Dropdown.vue';
import Arraylist from './Arraylist.vue';
import Status from './Status.vue';
export default{
    components: {Dropdown, Arraylist, Status},
    props: ['info', 'controller'],
    emits: ['add_services'],
    data(){
        return {
            confirmed: false,
            services: [],
            message: `Pinging ${this.info.SN} at ${this.info.ip}...`,
            mounted: true,
            updateInt: {}
        }
    },
    unmounted(){
        clearInterval(this.updateInt);
    },
    mounted(){
        this.updateInt = setInterval(this.attempt, 1000);
    },
    methods: {
         async attempt(){
            try{
                if(!this.info.ip){throw Error('no ip');}
                const { signal } = this.controller;
                let res = await fetch(`http://${this.info.ip}/services`, { signal }).catch(e=>{return;});
                if(!res){
                    throw Error('bad request');
                }
                this.services = await res.json();
                this.$emit('add_services', this.services);
                this.confirmed = true;
            }catch(e){
                console.log(`ip ${this.info.ip} failed, error: ${e}`);
                this.message = `${this.info.SN} unavailable atm`;
                if(this.info.ip == undefined){
                    return;
                }
            }
         }
    }
}
</script>

<template>
    <Status v-for='serv in services' :ip='info.ip' :service='serv' :controller='controller' v-if='confirmed'/>
    <span v-else> {{message}} </span>
</template>

<style>
</style>