<script>
    import SysStat from './SysStat.vue';

    export default{
        components: {SysStat},
        props: ['ocnum'],
        data(){
            return {
                info: [{}],
                systems: [{}],
                selected_rows: [],
                services: [],
                sel_service: '',
                sel_state: '',
                state_list: [
                        {label: "Start", value: "start"}, 
                        {label:"Stop", value: "stop"}
                    ]
            }
        },
        watch: {
            async ocnum(newval, oldval){
                this.update();
            }
        },
        async created(){
            this.update();
            this.update_errors();
            setInterval(() => {
                this.update_errors();
            }, 3000);
        },
        computed:{
            headers(){
                if(this.systems.length < 1){ return []; }
                return ['SN', 'IP', 'Services', 'Errors'];
            },
            table_body(){
                return ['SN', 'ip', {slot: 'service_ind'}, {slot: 'errors'}];
            },
            service_list(){
                return this.services.map(service => {
                    return {label: service, value: service};
                });
            }
        },
        methods:{
            async update_errors(){
                this.systems.forEach(async sys=>{
                    try{
                        let error_ob = (await( await fetch(`http://${sys.ip}/errors`) ).json())['events'];
                        sys.errors = [...error_ob["OS"], ...error_ob["BMC"]].filter(er=>er.length>2);
                    }catch{

                    }
                });
            },
            async update(){
                this.info = await( await fetch('http://10.0.7.170/order/'+this.ocnum) ).json();

                const sysArray = [];
                for(let sys of this.info){
                    sysArray.push(
                        {
                            SN: sys["serial"],
                            ip: sys["OS IP"],
                            errors: []
                        }
                    );
                }
                this.systems = sysArray;
            },
            sys_event(){
                this.selected_rows.forEach(i=>{
                    fetch(`http://${this.systems[i].ip}/services/${this.sel_service}?state=${this.sel_state}`, {
                        method: 'POST'
                    });
                });
            },
            add_services(services){
                services.forEach(service => {
                    if(!this.services.includes(service)){
                        this.services.push(service);
                    }
                });
            }
        }
    }
</script>

<template>
    <ui-table
        v-model="selected_rows"
        fullwidth
        :data = "systems"
        :thead = "headers"
        :tbody = "table_body"
        row-checkbox>
        <template #service_ind='{data}'>
            <SysStat :info='data' :key='data.ip' @add_services='add_services'/>
        </template>
        <template #errors='{data}'>
            <ui-collapse v-show='data.errors.length > 0'>
                <template #toggle>
                    <ui-icon class='error'>
                        error
                    </ui-icon>
                </template>
                <ui-list :key='data.ip'>
                    <ui-item v-for='err in data.errors' :key='err'>
                        {{err}}
                    </ui-item>
                </ui-list>
            </ui-collapse>
        </template>
    </ui-table>
    <ui-select class='actionSelect' :options='service_list' v-model='sel_service'/>
    <ui-select class='actionSelect' :options='state_list' v-model='sel_state'/>
    <ui-button @click='sys_event' :disabled='sel_service == ""'>Apply</ui-button>
</template>

<style>
.systemTable{
    width: 2300px;
}
.actionSelect{
    margin:20px;
}
.error{
    color: #b00020;
}
</style>