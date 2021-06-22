// 一个组件一个watcher

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



export default class KVue {
  constructor(options){

    // 0.保存配置
    this.$options = options
    this.$data = options.data

    // 1.递归遍历data中的对象，做响应式处理
    observe(this.$data)

    // 1.5 代理
    proxy(this)

    // 2.编译
    // new Compile(options.el, this)
    if(options.el){
      this.$mount(options.el)
    }

  }

  $mount(el) {
    // 1.获取宿主
    this.$el = document.querySelector(el);
    // 2.实现更新函数
    const updateComponent = () => {

      //dom 版本

      // 执行render，获取视图结构
      // const el = this.$options.render.call(this)
      // const parent = this.$el.parentElement;
      // parent.insertBefore(el, this.$el.nextSibling);
      // parent.removeChild(this.$el);
      // this.$el= el;

      // vnode版本
      // this._update(this.render())

      const vnode = this.$options.render.call(this, this.$createElement);
      this._update(vnode)
    }
    // 3.创建watcher实例
    new Watcher(this, updateComponent)
  }

  $createElement(tag, data, children){
    return {tag, data, children}; //最简单的vdom
  }

  _update(vnode){
    const preVnode = this._vnode;
    if(!preVnode){
      //init() 真实dom
      this.__patch__(this.$el, vnode)
    }else{
      // update
      this.__patch__(preVnode, vnode)
    }

  }

  __patch__(oldVnode, vnode){
    if(oldVnode.nodeType){
      //init() 真实dom
      // 递归创建
      const el =this.createElm(vnode);
      const parent = oldVnode.parentElement;
      const refElm = oldVnode.nextSibling;
      parent.insertBefore(el, refElm);
      parent.removeChild(oldVnode);

    }else{
      // update
      const el = vnode.el = oldVnode.el;

      //如果是相同节点
      if(oldVnode.tag === vnode.tag){
        // 判断双方子元素情况
        const oldCh = oldVnode.children;
        const newCh = vnode.children;

        if(typeof newCh ==='string'){
          if(typeof oldCh ==='string'){
            // text update
            if(newCh!==oldCh){
              el.textContent = newCh
            }
          }else{
            //textContent :elements replace with text
            el.textContent = newCh
          }

        } else{
          // newCh: arr
          if(typeof oldCh ==='string'){
            // text replace with elements
            el.innerHtml = '';
            newCh.forEach((child)=>el.appendChild(this.createElm(child)));

          }else{
            // 都是arr 首首，尾尾，首尾，尾首比较
            this.updateChildren(el, oldCh, newCh);

          }

        }
      }else{
        //如果不是相同节点 replace


      }


    }
    this._vnode = vnode;
  }

  updateChildren(parentElm, oldCh, newCh){
    // 这里暂且直接patch对应的索引的两个节点
    const len = Math.min(oldCh.length, newCh.length);
    for(let i=0; i<len; i++){
      this.__patch__(oldCh[i], newCh[i]);
    }
    //newCh更长，新增
    if(newCh.length > oldCh.length){
      newCh.slice(len).forEach((child)=>{
        const el = this.createElm(child);
        parentElm.appendChild(el);
      })
    }

    // oldCh更长，删除
    if(oldCh.length > newCh.length){
      oldCh.slice(len).forEach((child)=>{
        parentElm.removeChild(child.el);
      })
    }

  }

  // 递归创建整棵dom树
  createElm(vnode){
    const el = document.createElement(vnode.tag)
    if(vnode.children){
      // text
      if(typeof vnode.children === 'string'){
        el.textContent = vnode.children
      }else{
        // array
        vnode.children.forEach((n)=>{
          el.appendChild(this.createElm(n))
        })

      }

    }
    // 保存el和vnode关系，将来更新要用
    vnode.el = el
    return el
  }

}

// 遍历模板树，解析其中动态部分，初始化并获得更新函数
// class Compile {
//   constructor(el, vm){
//     this.$vm = vm

//     //获取宿主元素的dom
//     const dom = document.querySelector(el)

//     //编译它
//     this.compile(dom)
//   }

//   compile(el){
//     // 遍历 el
//     const childNodes = el.childNodes

//     childNodes.forEach(node=>{
//       if(this.isElement(node)){
//         // 元素:解析动态的指令、属性绑定、事件
//         // console.log("编译元素", node.nodeName);

//         const attrs = node.attributes;
//         Array.from(attrs).forEach((attr) => {
//           // 判断是否是一个动态属性

//           // 1.指令k-xxx="counter"
//           const attrName = attr.name;
//           const exp = attr.value;
//           if (this.isDir(attrName)) {
//             // 每个指令都有一个特殊处理函数 k-text k-html

//             const dir = attrName.substring(2);
//             // 看看是否是合法指令，如果是则执行处理函数

//             this[dir] && this[dir](node, exp);
//           }
//         });

//         // 递归
//         if(node.childNodes.length>0){
//           this.compile(node)
//         }

//       }else if(this.inInter(node)) {

//         // 插值绑定表达式
//         // console.log('编译插值',node.textContent)
//         this.compileText(node)

//       }
//     })
//   }

//   // 处理所有动态绑定
//   // dir指的就是指令名称
//   update(node, exp, dir) {
//     // 1.初始化
//     const fn = this[dir + "Updater"];
//     fn && fn(node, this.$vm[exp]);

//     // 2.创建Watcher实例，负责后续更新
//     new Watcher(this.$vm, exp, function(val) {
//       fn && fn(node, val);
//     });
//   }

//   // k-text
//   text(node, exp) {
//     // node.textContent = this.$vm[exp]

//     this.update(node, exp, "text");
//   }
//   textUpdater(node, val) {
//     node.textContent = val;
//   }

//   // k-html
//   html(node, exp) {
//     // node.innerHTML = this.$vm[exp]

//     this.update(node, exp, "html");
//   }
//   htmlUpdater(node, val) {
//     node.innerHTML = val;
//   }

//   // 解析{{ooxx}}
//   compileText(node) {
//     // 1.获取表达式的值
//     // node.textContent = this.$vm[RegExp.$1]

//     this.update(node, RegExp.$1, "text");
//   }


//   // 元素
//   isElement(node){
//     return node.nodeType ===1
//   }

//   // {{}}文本
//   inInter(node){
//     return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
//   }
//   // 判断是否是一个k-开头的指令
//   isDir(attrName) {
//     return attrName.startsWith("k-");
//   }
// }

// const warthers = []

// 负责具体节点更新 将来这个key值发生变化，就拿这个值去执行更新函数


class Watcher {
  constructor(vm, fn) {
    this.vm = vm;
    this.getter = fn;

    this.get();
  }

  get(){
    // 读当前值，触发依赖收集
    Dep.target = this
    this.getter.call(this.vm) // 触发响应式里的get，把关系建立起来
    Dep.target = null
  }

  // Dep将来会调用update
  update() {
    this.get()
  }
}

// Dep和响应式的属性key之间有一一对应关系
// 负责通知watchers更新
class Dep {
  constructor() {
    this.deps = new Set(); // 一个watcher只允许进来一次
  }
  addDep(watcher) {
    this.deps.add(watcher);
  }
  notify() {
    this.deps.forEach((watcher) => watcher.update());
  }
}

