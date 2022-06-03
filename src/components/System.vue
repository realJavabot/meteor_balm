<script>
import Dropdown from './Dropdown.vue';
import Arraylist from './Arraylist.vue';
import Status from './Status.vue';
export default{
    components: {Dropdown, Arraylist, Status},
    props: ['info', 'style', 'services']
}
</script>

<template>
    <tr>
        <td v-for='val in Object.values(info)' :style='style'>
            <Arraylist v-if='Array.isArray(val)' :array='val'/>
            <Dropdown v-else-if='typeof(val) == "object"' label='DROP' :info='val'/>
            <span v-else>{{val}}</span>
        </td>
        <Status v-for='serv in services' :ip='info.ip' :service='serv' :style='style'/>
    </tr>
</template>

<style>
tr{
    vertical-align: top;
}
</style>