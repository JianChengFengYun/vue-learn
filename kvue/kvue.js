function defineReactive(obj, key, val) {
  // 递归
  observe(val)
  // dep与key一一对应
  const dep = new Dep()

  // 属性拦截
  Object.defineProperty(obj, key, {
    get(){
      // console.log('get', val)
      // 依赖收集建立
      Dep.target && dep.addDep(Dep.target)
      return val
    },
    set(v){
      if(v!==val){
        // console.log('set', v)
        observe(v)
        val = v
        // update()
        // // 全量更新
        // warthers.forEach(w=>w.update())
        // 通知更新
        dep.notify()
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


function proxy(vm){
  Object.keys(vm.$data).forEach(key=>{
    Object.defineProperty(vm, key,{
      get(){
        return vm.$data[key]
      },
      set(v){
        vm.$data[key] = v
      }
    })
  })
}



class KVue {
  constructor(options){

    // 0.保存配置
    this.$options = options
    this.$data = options.data

    // 1.递归遍历data中的对象，做响应式处理
    observe(this.$data)

    // 1.5 代理
    proxy(this)

    // 2.编译
    new Compile(options.el, this)

  }
}

// 遍历模板树，解析其中动态部分，初始化并获得更新函数
class Compile {
  constructor(el, vm){
    this.$vm = vm

    //获取宿主元素的dom
    const dom = document.querySelector(el)

    //编译它
    this.compile(dom)
  }

  compile(el){
    // 遍历 el
    const childNodes = el.childNodes

    childNodes.forEach(node=>{
      if(this.isElement(node)){
        // 元素:解析动态的指令、属性绑定、事件
        // console.log("编译元素", node.nodeName);

        const attrs = node.attributes;
        Array.from(attrs).forEach((attr) => {
          // 判断是否是一个动态属性

          // 1.指令k-xxx="counter"
          const attrName = attr.name;
          const exp = attr.value;
          if (this.isDir(attrName)) {
            // 每个指令都有一个特殊处理函数 k-text k-html

            const dir = attrName.substring(2);
            // 看看是否是合法指令，如果是则执行处理函数

            this[dir] && this[dir](node, exp);
          }
        });

        // 递归
        if(node.childNodes.length>0){
          this.compile(node)
        }

      }else if(this.inInter(node)) {

        // 插值绑定表达式
        // console.log('编译插值',node.textContent)
        this.compileText(node)

      }
    })
  }

  // 处理所有动态绑定
  // dir指的就是指令名称
  update(node, exp, dir) {
    // 1.初始化
    const fn = this[dir + "Updater"];
    fn && fn(node, this.$vm[exp]);

    // 2.创建Watcher实例，负责后续更新
    new Watcher(this.$vm, exp, function(val) {
      fn && fn(node, val);
    });
  }

  // k-text
  text(node, exp) {
    // node.textContent = this.$vm[exp]

    this.update(node, exp, "text");
  }
  textUpdater(node, val) {
    node.textContent = val;
  }

  // k-html
  html(node, exp) {
    // node.innerHTML = this.$vm[exp]

    this.update(node, exp, "html");
  }
  htmlUpdater(node, val) {
    node.innerHTML = val;
  }

  // 解析{{ooxx}}
  compileText(node) {
    // 1.获取表达式的值
    // node.textContent = this.$vm[RegExp.$1]

    this.update(node, RegExp.$1, "text");
  }


  // 元素
  isElement(node){
    return node.nodeType ===1
  }

  // {{}}文本
  inInter(node){
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
  // 判断是否是一个k-开头的指令
  isDir(attrName) {
    return attrName.startsWith("k-");
  }
}

// const warthers = []

// 负责具体节点更新 将来这个key值发生变化，就拿这个值去执行更新函数
class Watcher {
  constructor(vm, key, updater) {
    this.vm = vm;
    this.key = key;
    this.updater = updater;

    // warthers.push(this)
    // 读当前值，触发依赖收集
    Dep.target = this
    this.vm[this.key] // 触发响应式里的get，把关系建立起来
    Dep.target = null
  }
  
  // Dep将来会调用update
  update() {
    const val = this.vm[this.key];
    this.updater.call(this.vm, val);
  }
}

// Dep和响应式的属性key之间有一一对应关系
// 负责通知watchers更新
class Dep {
  constructor() {
    this.deps = [];
  }
  addDep(dep) {
    this.deps.push(dep);
  }
  notify() {
    this.deps.forEach((dep) => dep.update());
  }
}

