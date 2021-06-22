// Vue.util.defineReactive(obj, key, val)
function defineReactive(obj, key, val) {
  // 递归
  observe(val)

  // 属性拦截
  Object.defineProperty(obj, key, {
    get(){
      console.log('get', val)
      return val
    },
    set(v){
      if(v!==val){
        console.log('set', v)
        // 赋值是对象的时候，设置成响应式对象
        observe(v)
        val = v
        // update()
      }
    }
  })
}

// 遍历传入的obj的所有属性，执行响应式处理
function observe (obj){
  // 首先判断obj是对象
  if( typeof obj !== 'object' || obj === null){
    return  obj
  }

  Object.keys(obj).forEach(key=>defineReactive(obj, key, obj[key]))
}

// 动态的新增一个属性

function set(obj, key, val){
  return defineReactive(obj, key, val)
}

const obj={
  foo: 'foo',
  bar: 'bar',
  tar: {
    nar:' tar nar'
  }
}
// 用户不能手动设置所有属性：递归响应式处理过程
// defineReactive(obj,'foo','1')
observe(obj)

obj.foo
obj.foo = 'foooo'
obj.bar
obj.bar = 'bar111'
obj.tar
obj.tar.nar
// obj.dong = 'dong'
set(obj, 'dong', 'dong')
obj.dong

obj.tar = {
  a:'1'
}
// 数组支持不了，拦截能够改变数组的7个方法，重写，让他们做数组操作的同时，变更通知