// import Home from '../views/Home.vue'

let Vue

// vue插件形式
// 实现一个install方法，该方法会在use的时候被调用
class KVueRouter{
    constructor(options){
        // 拿到路由配置
        this.options = options

        // 将this.current声明为响应式
        Vue.util.defineReactive(
            this,
            'current',
            window.location.hash.slice(1) || '/'
        )

        // 2.监听hashchang事件，并在变化时候响应，获取hash部分
        window.addEventListener('hashchange',() => {
            // console.log(this.current)
            this.current = window.location.hash.slice(1)
        })
    }

}

// 形参1是vue构造函数
KVueRouter.install = function (_Vue) {
    // 传入构造函数，可以修改原型，用于扩展
    Vue=_Vue

    // install中this是KVueRouter

    // 1.注册$router 为了组件中可以用this.$router使用router实例
    // 延迟执行接下来代码，等到router实例创建之后
    // 全局混入：Vue.mixn    
    Vue.mixin({
        beforeCreate(){
            // 此处this指的是组件实例
            if(this.$options.router){
                
                Vue.prototype.$router = this.$options.router
            }
        }
    })

    // 2. 注册router-link和router-view组件
    Vue.component('router-link',{
        props: {
            to:{
                type: String,
                requied: true
            }
        },
        render(h){
            // return <a href={'#' +this.to}>{this.$slots.default}</a>
            return h('a',{
                attrs: {
                    href:'#'+this.to
                }
                },
                this.$slots.default
            )
        }
    })
    Vue.component('router-view',{
        render(h){
            //h函数还可以接受一个组件，直接渲染
            // return h(Home)

            // 响应式 this.current

            // 0.获取router实例
            // console.log(this.$router.options, this.$router.current)
            let component = null;
            const  route = this.$router.options.routes.find(
                (route) => route.path === this.$router.current
            )
            if(route){
                component = route.component
            }


            //1.获取hash部分，获取path

            // 2.根据path从路由表中获取组件 path？路由配置信息？


            return h(component)
        }
    })
}
export default KVueRouter;