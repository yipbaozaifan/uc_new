<template>
    <div class="modal">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: ['title']
}
</script>

<style lang="scss">
.modal {
    position: absolute;
    top:50%;
    left: 50%;
    width: 312px;
    min-height: 110px;
    margin-top:-55px;
    margin-left:-156px;
    background-color: #ffffff;
    z-index: 102;
    overflow: hidden;
    border-radius: 4px;
}
</style>
