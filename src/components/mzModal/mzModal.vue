<template>
    <div class="modal">
        <div class="modal-top">
            <a class="close-btn" @click="emit('close')"></a>
        </div>
        <span class="modal-name">{{title}}</span>
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
    width: 420px;
    min-height: 250px;
    margin-top:-125px;
    margin-left:-210px;
    background-color: #ffffff;
    z-index: 102;
    overflow: hidden;
    border-radius: 4px;
    .modal-top {
        height: 46px;
        width: 100%;
        overflow: hidden;
        position: relative;
        color: #000000;
        .close-btn {
            outline: none;
            position: absolute;
            width: 30px;
            height: 30px;
            cursor: pointer;
            overflow: hidden;
            top: 8px;
            right: 8px;
        }
    }
    .modal-name {
        font-size: 18px;
        line-height: 18px;
        width: 100%;
        text-align: center;
        display: inline-block;
        margin-bottom: 12px;
    }
}
</style>
