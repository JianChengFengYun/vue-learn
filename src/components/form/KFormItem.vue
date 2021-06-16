<template>
  <div>
    <label v-if="label">{{label}}</label>
    <slot></slot>
    <p v-if='error'>{{error}}</p>
    <!-- <p>{{form.rules[prop]}}</p> -->
  </div>
</template>

<script>
import Validator from "async-validator";

export default {
  inject:['form'],
  props:{
    label: {
      type: String,
      default:'',
    },
    prop: String
  },
  data(){
    return{
      error: ''
    }
  },
  methods:{
    validate(){
      // 加载一个校验库
      // 1.获取规则和值 拥有prop属性才执行校验
      const rules = this.form.rules[this.prop]
      const value = this.form.model[this.prop]
      // 2.获得校验器实例
      const validator = new Validator({[this.prop]: rules})
      // validate返回promise,因为有时候是异步校验
      return validator.validate({[this.prop]: value}, (errors)=>{
        if(errors){
          // console.log(errors)
          this.error = errors[0].message
        }else{
          this.error = ''
        }

      })

    }
  },
  mounted(){
    this.$on('validate',()=>{
      this.validate()
    })
  }
  
};
</script>

<style lang="scss" scoped></style>
