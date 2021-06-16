<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props:{
    model:{
      type: Object,
      required: true
    },
    rules: Object
  },
  provide(){
    return {
      form: this,
    }
  },
  methods:{
    validate(cb){
      // 遍历执行所有items的校验方法,拥有prop属性才执行校验
      // $children ？？？
      const promises = this.$children
      .filter(item=>item.prop)
      .map((item)=>item.validate());
      
      console.log(promises);

      Promise.all(promises)
      .then(()=>cb(true))
      .catch(()=>cb(false));
    }
  }
};
</script>

<style lang="scss" scoped></style>
