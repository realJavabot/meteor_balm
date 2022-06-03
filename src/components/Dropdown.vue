<script>
import Arraylist from './Arraylist.vue';
export default{
    components: {Arraylist},
    props: ['label', 'info'],
    data(){
        return {
            toggled: false
        }
    }
}
</script>

<template>
    <button @click='toggled = !toggled'>{{label}}</button>
    <table v-if='toggled' class='dropTable'>
        <tr v-for='[key, data] in Object.entries(info)'>
            <th>{{key}}:</th>
            <Arraylist v-if='Array.isArray(data)' :array='data'/>
            <td v-else>{{data}}</td>
        </tr>
    </table>
</template>

<style>
tr{
    text-align:left;
}
.dropTable{
    z-index: 1;
    background-color: white;
}
</style>