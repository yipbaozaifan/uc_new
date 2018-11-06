<template>
    <div class="mz-selector">
        <select name="" id="">
            <option v-for="(item, index) in options" :value="item.value" :key="index">{{item.value}}</option>
        </select>
    </div>
</template>

<script>
export default {
    props: ['options'],
}
</script>

