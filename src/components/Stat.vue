<script>
    import SysStat from './SysStat.vue';
    import { useEvent } from 'balm-ui';

    export default{
        components: {SysStat},
        props: ['ocnum'],
        data(){
            return {
                info: [{}],
                systems: [{errors: []}],
                selected_rows: [],
                services: [],
                sel_service: '',
                sel_state: '',
                state_list: [
                        {label: "Start", value: "start"}, 
                        {label:"Stop", value: "stop"}
                    ],
                balmUI: useEvent(),
                files: []
            }
        },
        watch: {
            async ocnum(newval, oldval){
                this.update();
            },
            files(newval, oldval){
                console.log(newval);
            }
        },
        async created(){
            this.update();
            this.update_errors();
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
            update_errors(cur_index = 0){
                let filter_arr = ["/", "PWR-0020", "PWR-0000", "LAN-0005", "LAN-0006", "PWR-0003", "SEC-0000", "chassis intrusion", "HEST: Enabling Firmware", "Invalid Username", "OEM, First AC Power on", "Node Product Key"];
                let filter_func = err => typeof(err) == "string" && err.length > 2 && !filter_arr.some(v=>err.includes(v));
                let sys = this.systems[cur_index];
                fetch(`http://${sys.ip}/errors`, {mode: 'cors'}).then(res => {
                    if(!res){return;}
                    return res.json();
                }).then(error => {
                    let error_ob = error.events;
                    error_ob["BMC"] = error_ob["BMC"].filter(filter_func);
                    error_ob["OS"] = error_ob["OS"].filter(filter_func);
                    sys.errors = [...error_ob["OS"], ...error_ob["BMC"]];
                });
                setTimeout(()=>{ this.update_errors((cur_index + 1) % this.systems.length); }, 500);
            },
            async update(){
                try{
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
                }catch{}
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
    <div>
        <ui-select class='actionSelect' :options='service_list' v-model='sel_service'/>
        <ui-select class='actionSelect' :options='state_list' v-model='sel_state'/>
        <ui-button @click='sys_event' :disabled='sel_service == ""'>Apply</ui-button>
    </div>
    <div>
        <ui-file 
            accept="image/*" 
            multiple
            @change="balmUI.onChange('files', $event)"
        ></ui-file>
    </div>
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