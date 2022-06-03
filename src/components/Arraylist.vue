<script>
export default{
    props: ['array']
}
</script>

<template>
    <td>
        <select>
            <option v-for='val in array'>{{val}}</option>
        </select>
    </td>
</template>