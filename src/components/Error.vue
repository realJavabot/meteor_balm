<script>
export default{
    props: ['info'],
    data(){
        return {
            errors: [],
            filter_arr: ["| 2", "ACPI Error", "Base OS Boot", "SYS-0062", "SYS-0063", "PWR-0020", "PWR-0000", "LAN-0005", "LAN-0006", "PWR-0003", "SEC-0000", "chassis intrusion", "HEST: Enabling Firmware", "Invalid Username", "OEM, First AC Power on", "Node Product Key"]
        }
    },
    async created(){
        if(!this.info || !this.info.ip){return;}
        this.update();
        setInterval(this.update, 3000);
    },
    methods: {
        async update(){
            try{
                if(!this.info.ip){throw Error('no ip');}
                let res = await fetch(`http://${this.info.ip}/errors`).catch(e=>{return;});

                if(!res){
                    throw Error('bad request');
                }

                let filter_func = err => typeof(err) == "string" && err.length > 2 && !this.filter_arr.some(v=>err.includes(v));

                let error_ob = (await res.json()).events;
                error_ob["BMC"] = error_ob["BMC"].filter(filter_func);
                error_ob["OS"] = error_ob["OS"].filter(filter_func);
                this.errors = [...error_ob["OS"], ...error_ob["BMC"]];
            }catch(e){
                console.log(`ip ${this.info.ip} failed, error: ${e}`);
            }
         }
    }
}
</script>

<template>
    <ui-collapse v-show='errors.length > 0'>
        <template #toggle>
            <ui-icon class='error'>
                error
            </ui-icon>
        </template>
        <ui-list>
            <ui-item v-for='err in errors'>
                {{err}}
            </ui-item>
        </ui-list>
    </ui-collapse>
</template>

<style>
.error{
    color: #b00020;
}
</style>