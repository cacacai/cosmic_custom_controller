import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new  Vuex.Store({
  state: {
      invoke: null,
      pageId: null,
      tagList: null   //标签列表
  },
  mutations: {
      //接收后台传输的所有的标签列表数据
    UPDATE_ALL_DATA (state, props) {
        const data = props.data
        if (data && data.eventName){
            switch (data.eventName) {
                case 'tagList':
                    state.tagList= data.data
            }
        }
    },
    INIT_DATA (state, pageId) {
        state.pageId = pageId
        state.invoke = window.kdinvokes[pageId].invoke
    }
  },
  getters: {
      tagList: (state) => {
        return state.tagList
    }
  },
  actions: {
      //向后台发送选择的标签
    sendSelectTags: ({ // json树 新增
                          rootState
                        }, obj) => {
        return rootState.invoke('selectTag', obj)
    }
  }
})

