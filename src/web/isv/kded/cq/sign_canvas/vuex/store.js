import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new  Vuex.Store({
  state: {
      pageId: null,
      invoke: null,
      fileServer: null
  },
  mutations: {
    UPDATE_ALL_DATA (state, props) {
        const data = props.data
        if (data && data.eventName){
            switch (data.eventName) {
                case 'editOrder':
                    state.list= data.data
                    break
            }

        }
    },
    INIT_DATA (state, pageId) {
        state.pageId = pageId
        state.invoke = window.kdinvokes[pageId].invoke
        state.fileServer = window.kdinvokes[pageId].fileServer
    }
  },
  getters: {
      fileServer: state => state.fileServer
  },
  actions: {
      saveImg: ({ rootState}, obj) => {
        return rootState.invoke('save', obj)
      },
      closeView: ({ rootState}, obj) => {
          return rootState.invoke('close', obj)
      }
  }
})

