// 在main.js上通过import引入Vue库和自己写的Vue组件库
import Vue from 'vue';
import store from './vuex/store';
import Main from './views/Main.vue';

//全局注册 main.js
import SignCanvas from "sign-canvas";

Vue.use(SignCanvas);

import {
    Button,
    Row,
    Loading,
    MessageBox
} from 'element-ui'

Vue.use(Loading);
Vue.use(Button);
Vue.use(Row)

Vue.prototype.$confirm = MessageBox.confirm;




(function (KDApi) {
    function MyComponent (model) {
            this._setModel(model)
    }

    MyComponent.prototype = {
        _setModel (model) {
            this.model = model
        },
        init (props) {
            console.log('-----init', this.model.style, props)
            setHtml(this.model, props)
        },
        update (props) {
            console.log('-----update', this.model, props)
            setData(props)
        },
        destoryed () {
            console.log('-----destoryed', this.model)
            // 移除挂载在window 中model对象
            if (window.kdinvokes !== undefined){
                delete window.kdinvokes[this.model.pageId]
            }
        }
    }

    const setHtml = (model, props) => {
        // 统一管理invoke
        if (window.kdinvokes === undefined) {
            // 初始化为空对象
            window.kdinvokes = {}
        }
        // 存储invoke 函数
        window.kdinvokes[model.pageId] = model

        initData(props, model.pageId)
        const files = ['./css/index.css']
        KDApi.loadFile(files, model, () => {
            new Vue({
                el: model.dom,
                store,
                render: h => h(Main)
            })

        })
    }

    const setData = props => store.commit('UPDATE_ALL_DATA', props)
    const initData = (props, pageId) => store.commit('INIT_DATA', pageId)

    // 注册自定义组件
    KDApi.register('sign_canvas', MyComponent)
})(window.KDApi)
