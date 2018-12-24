<template>
    <a class="btn" :class="type" @click="clickEvent">
        {{text}}
    </a>
</template>

<script>
export default {
  props:['text','type'],
  methods: {
    clickEvent() {
      this.$emit('clicked');
    }    
  }
}
</script>

<style lang="scss">
.btn {
  display: inline-block;
  font-size: 16px; 
  width: 100%;
  text-align: center;
  height: 36px;
  line-height: 36px;
  border: 1px solid #198DED;
  border-radius: 36px;
  cursor: pointer;
}
.blue {
  background-color: #198DED;
  color: #ffffff;
}
.white {
  background-color: #fff;
  color: #198DED;
}
.gray {
  background-color: #cccccc;
  color: #fff;
  border-color: #cccccc;
}
</style>
