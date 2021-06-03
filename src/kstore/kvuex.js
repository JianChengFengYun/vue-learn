// Store: 统一存贮state，并且是响应式的
// 他给用户提供api：commit/dispatch

let Vue
class Store {
    constructor(options){
        this.options = options
        this._mutations = options.mutations
        this._actions = options.actions
        this._wrappedGetters = options.getters

        //getters
        const computed = {}
        this.getters = {}
        // doubleCounter(state){}
        const store = this
        Object.keys(this._wrappedGetters).forEach(key=>{
            // 获取用户定义的getters函数
            const fn = store._wrappedGetters[key]
            // 转换为computed可以使用的无参形式
            computed[key] = function(){
                return fn(store.state)
            }
            //为getters定义只读属性
            Object.defineProperty(store.getters, key, {
                get: ()=> store._vm[key]
            })
        })

        // 1.对state做响应式处理

        // 不可预测
        // this.state = new Vue({
        //     data(){
        //         return options.state
        //     }
        // })
        // setInterval(()=>{
        //     this.state.counter++
        // },1000)

        this._vm = new Vue({
            data(){
                return {
                    // 不做代理
                    $$state: options.state
                }
            },
            // 没有参数
            computed
        })

        

        // 绑定this
        this.commit = this.commit.bind(this)
        this.dispatch = this.dispatch.bind(this)
    
        
    }

    get state(){
        return this._vm._data.$$state
    }
    set state(v){
        console.log('请使用repalaceState重置state')
    }

    // store.commit('add' ,2)
    commit(type, payload){
        // 根据type从mutations中获取函数执行它
        const entry = this._mutations[type]
        if(!entry){
            console.log('unknow mutation!')
            return ;
        }
        entry(this.state, payload)
    }
    dispatch( type, payload){
        const entry = this._actions[type]
        if(!entry){
            console.log('unknow actions!')
            return ;
        }
        entry(this, payload)
    }
}

function install(_Vue){
    Vue=_Vue
    // 注册$store
    Vue.mixin({
        beforeCreate(){
            // 此处this指的是组件实例
            if(this.$options.store){
                
                Vue.prototype.$store = this.$options.store
            }
        }
    })
}

export default {Store, install}