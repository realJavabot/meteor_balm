<script>
export default{
    props: ['ip', 'service', 'style'],
    data(){
        return {
            status: 'na'
        }
    },
    async created(){
        this.update();
        setInterval(this.update, 3000);
    },
    methods: {
        async update(){
            this.status = (await (await fetch(`http://${this.ip}/services/${this.service}`)).json()).status;
        }
    },
    computed: {
        backgroundColor(){
            return {
                'na': 'white',
                'Stopped': 'grey',
                'Running': 'yellow',
                'succeeded': 'green'
            }[this.status];
        }
    }
}
</script>

<template>
    <td :style='[ style, { backgroundColor } ]'>
        <span>{{service.split('.')[0]}}: {{status}}</span>
    </td>
</template>