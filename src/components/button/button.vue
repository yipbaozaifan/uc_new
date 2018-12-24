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
  border: 1px solid #387AFF;
  border-radius: 4px;
  cursor: pointer;
}
.blue {
  background-color: #387AFF;
  color: #ffffff;
}
.white {
  background-color: #fff;
  color: #387AFF;
}
.gray {
  background-color: #cccccc;
  color: #fff;
  border-color: #cccccc;
}
</style>
