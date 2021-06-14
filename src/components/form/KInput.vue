<template>
  <div>
    <!-- 输入：:value
    输出：@input -->
    <input type="text" :value="value" @input="onInput" v-bind="$attrs" >
  </div>
</template>

<script>
  export default {
    inheritAttrs: false,
    props:{
      value: {
        type: String,
        default:''
      }
    },
    methods:{
      onInput(e){
        this.$emit('input', e.target.value)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>