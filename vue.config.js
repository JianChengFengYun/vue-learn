const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
console.log(process.env.foo)
console.log('process.env.VUE_APP_DONG',process.env.VUE_APP_DONG);

module.exports = {
    publicPath: '/best-practice',
    devServer:{
        port: 7070,
    },
    // configureWebpack: {
    //     resolve:{
    //         alias: {
    //             comps: path.join(__dirname, 'src/components')
    //         }
    //     }
    // },
    // 根据环境变量动态设置
    configureWebpack(config){
        // 合并配置
        // return {

        // }
        config.resolve.alias.comps = path.join(__dirname, 'src/components')
        
        if(process.env.NODE_ENV === 'development'){
            config.name = 'vue best practice'
        }else{
            config.name = 'vue项目最佳实践'
        }
    },
    // 连式调用 // config.rules
    chainWebpack(config){
        // 1.添加新的loader，负责去icon目录加载图标，方便直接使用  npm i svg-sprite-loader -D
        config.module.rule('icon') // 终端 vue inspect --rule icon 查看是否生效
            .include.add(resolve('src/icon')).end() //上下文变成了.include对应的set集合 .end()恢复上下文
            .test(/\.svg$/)
            .use('svg-sprite-loader')
                .loader('svg-sprite-loader')    //上下文也会变，后续操作需要注意！！！！！
                .options({symbolId: 'icon-[name]'}) //将来使用svg图标的时候就用 'icon-[name]' 这个名称
            


        // 2. 当前项目下已经有一个加载svg的loager，让他排除掉我的icon目录  
        // 终端：用 vue inspect 审查、参考配置项
            // 看规则 vue inspect --rules  当前项目下相关的规则，可以与之交互
            // vue inspect --rule svg  查看svg规则

            //  /* config.module.rule('svg') */     用这个表达式可以修改svg规则
            // {
            //     test: /\.(svg)(\?.*)?$/,
            //     use: [
            //     /* config.module.rule('svg').use('file-loader') */
            //     {
            //         loader: '/Users/zoe/Documents/project/vue-learn/node_modules/@vue/cli-service/node_modules/file-loader/dist/cjs.js',
            //         options: {
            //         name: 'img/[name].[hash:8].[ext]'
            //         }
            //     }
            //     ]
            // }
        config.module.rule('svg')
        .exclude.add(resolve('src/icon'))    // 终端 vue inspect --rule svg 查看是否生效

    }
}