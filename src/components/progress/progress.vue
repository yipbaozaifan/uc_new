<template>
    <div class="content">
        <div class="list list-steps">
            <div class="step">
               <div v-for="(step, index) in steps" :key="index" class="step-content">
                   <div class="step-main" :style="{
                        width: size+'px',
                        margin: `0 -${(size-24)/2}px` 
                    }">
                       <div class="step-num" :class="{'actived-step': (index+1) <= actived}">
                           <span>{{index+1}}</span>
                       </div>
                       <p class="step-name">{{step.name}}</p>
                   </div>
                   <div class="step-line" v-if="index < steps.length-1" :class="{'actived-step': (actived-1) > index}" :style="{width: (lineLength/(steps.length-1)) + 'px'}"></div>
               </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'mzprogress',
  props: {
    steps: {
      type: Array,
      default: new Array(),
    },
    actived: {
      type: Number,
      default: 1,
    },
    size: {
      type: String,
      default: '84',
    },
    lineLength: {
      type: String,
      default: '436'
    },
  },
}
</script>

<style lang="scss">
.step {
  width: 100%;
  min-width: 1000px;
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
  .step-content {
      vertical-align: top;
      font-size: 0;
  }
  .step-main {
    text-align: center;
    display: inline-block;
    vertical-align: top;
    z-index: 2;
    margin: 0 -30px;
    .step-num {
      width: 24px;
      height: 24px;
      margin: 0 auto;
      font-size: 12px;
      background-color: #cccccc;
      color: #fff;
      line-height: 24px;
      border-radius: 24px;
      &.actived-step {
        background-color: #387AFF;
      }
    }
    .step-name {
      font-size: 16px;
      margin-top: 10px;  
    }
  }
  .step-line {
    display: inline-block;
    vertical-align: top;
    height: 0;
    border-top: 10px solid #cccccc;
    margin: 0 -1px;
    margin-top: 7px;
    float: right;
    &.actived-step {
      border-top: 10px solid #387AFF;
    }
  }
}
</style>


